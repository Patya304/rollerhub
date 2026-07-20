import { prisma } from "@/lib/prisma";
import { generateShareToken } from "@/modules/sale-report/token";
import {
  computeReadiness,
  type Readiness,
} from "@/modules/sale-report/readiness";
import {
  buildSaleReportDto,
  type SaleReportDto,
} from "@/modules/sale-report/dto";
import {
  toConditionDto,
  toConditionEntry,
} from "@/modules/sale-report/condition";
import {
  buildSnapshot,
  hashSnapshot,
  sortServicesDeterministically,
} from "@/modules/sale-report/snapshot";
import { saleReportSnapshotSchema } from "@/modules/sale-report/snapshot-schema";
import { evaluateStoredSnapshot } from "@/modules/sale-report/stored-snapshot";

const conditionSelect = {
  overall: true,
  battery: true,
  brakes: true,
  tires: true,
  lights: true,
  frame: true,
  cosmetics: true,
  knownIssuesState: true,
  knownIssues: true,
  updatedAt: true,
} as const;

const reportScooterSelect = {
  brand: true,
  model: true,
  year: true,
  photoUrl: true,
  currentMileage: true,
  batteryCapacity: true,
  topSpeed: true,
  rangeKm: true,
  color: true,
  services: {
    where: { deletedAt: null },
    orderBy: { performedAt: "desc" as const },
    select: { type: true, performedAt: true, odometerKm: true },
  },
  _count: { select: { services: { where: { deletedAt: null } } } },
  valueEstimates: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
    select: { estimatedValue: true },
  },
  condition: { select: conditionSelect },
  user: {
    select: { name: true, username: true, image: true, profileIsPublic: true },
  },
};

type ReportScooter = NonNullable<
  Awaited<ReturnType<typeof findOwnedScooterForReport>>
>;

async function findOwnedScooterForReport(userId: string, scooterId: string) {
  return prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
    select: reportScooterSelect,
  });
}

function toReadinessInput(scooterId: string, scooter: ReportScooter) {
  return {
    scooterId,
    brand: scooter.brand,
    model: scooter.model,
    currentMileage: scooter.currentMileage,
    photoUrl: scooter.photoUrl,
    year: scooter.year,
    serviceCount: scooter._count.services,
    hasEstimate: scooter.valueEstimates.length > 0,
    condition: toConditionEntry(scooter.condition),
  };
}

function toDto(scooter: ReportScooter, updatedAt: Date): SaleReportDto {
  return buildSaleReportDto({
    scooter: {
      brand: scooter.brand,
      model: scooter.model,
      year: scooter.year,
      photoUrl: scooter.photoUrl,
      currentMileage: scooter.currentMileage,
      batteryCapacity: scooter.batteryCapacity,
      topSpeed: scooter.topSpeed,
      rangeKm: scooter.rangeKm,
      color: scooter.color,
      // Ugyanaz a determinisztikus sorrend, mint a snapshotban - a
      // tulajdonosi élő előnézet és a publikus oldal soha ne térjen el
      // pusztán a DB lekérdezési sorrend miatt.
      services: sortServicesDeterministically(scooter.services),
      serviceCount: scooter._count.services,
      estimatedValue: scooter.valueEstimates[0]?.estimatedValue ?? null,
      condition: toConditionDto(scooter.condition),
      user: scooter.user,
    },
    updatedAt,
  });
}

// Az élő roller/szerviz/becslés/állapotfelmérés adatból épített snapshot,
// validálva. Ugyanez a függvény szolgál a publikáláskori mentéshez és az
// "élő tartalom eltér-e a publikustól" összevetéshez is - így a két oldal
// garantáltan azonos logikával épül fel.
function buildValidatedLiveSnapshot(scooter: ReportScooter) {
  const snapshot = buildSnapshot({
    brand: scooter.brand,
    model: scooter.model,
    year: scooter.year,
    currentMileage: scooter.currentMileage,
    photoUrl: scooter.photoUrl,
    batteryCapacity: scooter.batteryCapacity,
    topSpeed: scooter.topSpeed,
    rangeKm: scooter.rangeKm,
    color: scooter.color,
    condition: toConditionDto(scooter.condition),
    services: scooter.services,
    estimatedValue: scooter.valueEstimates[0]?.estimatedValue ?? null,
  });
  const parsed = saleReportSnapshotSchema.safeParse(snapshot);
  return parsed.success ? parsed.data : null;
}

// Négy, egymást kizáró állapot a tulajdonosi workspace számára - pontosan
// ennek a négynek felel meg a Section 20 szerinti négy előírt szöveg:
// "missing" -> legacy, snapshot nélküli aktív report ("frissíteni kell az
// új formátumra"); "invalid" -> tárolt snapshot corrupt/inkonzisztens
// ("nem olvashatók, publikáld újra"); "up_to_date" -> a tárolt snapshot
// valid ÉS az élő hash megegyezik vele; "outdated" -> a tárolt snapshot
// valid, de az élő tartalom már eltér tőle.
export type PublishedSnapshotStatus =
  | "not_shared"
  | "missing"
  | "invalid"
  | "up_to_date"
  | "outdated";

export type OwnerSaleReportState =
  | { status: "not_found" }
  | {
      status: "ok";
      readiness: Readiness;
      report: {
        isActive: boolean;
        publicToken: string;
        publishedAt: Date | null;
      } | null;
      preview: SaleReportDto;
      snapshotStatus: PublishedSnapshotStatus;
    };

export async function getOwnerSaleReportState(
  userId: string,
  scooterId: string,
): Promise<OwnerSaleReportState> {
  const scooter = await findOwnedScooterForReport(userId, scooterId);
  if (!scooter) return { status: "not_found" };

  const report = await prisma.saleReport.findFirst({
    where: { scooterId, ownerId: userId },
  });
  const readiness = computeReadiness(toReadinessInput(scooterId, scooter));

  let snapshotStatus: PublishedSnapshotStatus = "not_shared";
  if (report?.isActive) {
    const stored = evaluateStoredSnapshot(report);
    if (stored.status === "missing") {
      snapshotStatus = "missing";
    } else if (stored.status === "invalid") {
      snapshotStatus = "invalid";
    } else {
      const liveSnapshot = buildValidatedLiveSnapshot(scooter);
      const liveHash = liveSnapshot ? hashSnapshot(liveSnapshot) : null;
      snapshotStatus =
        liveHash !== null && liveHash === stored.hash
          ? "up_to_date"
          : "outdated";
    }
  }

  return {
    status: "ok",
    readiness,
    report: report
      ? {
          isActive: report.isActive,
          publicToken: report.publicToken,
          publishedAt: report.publishedAt,
        }
      : null,
    preview: toDto(scooter, new Date()),
    snapshotStatus,
  };
}

export type ShareMutationResult =
  | { status: "not_found" }
  | { status: "not_ready"; missingRequired: string[] }
  | { status: "conflict" }
  | {
      status: "ok";
      publicToken: string;
      publishedAt: Date;
      alreadyUpToDate?: boolean;
      // Kizárólag a `createOrReactivateShare` tölti ki: `true`, ha ez a
      // hívás ténylegesen létrehozott vagy újraaktivált egy megosztást
      // (friss, valid snapshottal); `false`, ha egy már aktív reportra
      // érkezett idempotens ismételt POST, amely semmit nem írt/nem
      // ellenőrizte a snapshot állapotát - ilyenkor `alreadyUpToDate`
      // szemantikailag hibás lenne, ezért nem is állítjuk.
      createdOrReactivated?: boolean;
    };

// Új megosztás létrehozása, vagy visszavont/inaktív megosztás
// újraaktiválása. Már AKTÍV, megfelelő ownerű reportnál a művelet
// idempotens: nem generál új tokent, nem érinti a snapshotot, a korábban
// kiküldött link és publikált tartalom érvényben marad. Inaktívból aktívba
// váltáskor a token MINDIG új értéket kap, és friss snapshot készül - egy
// korábban visszavont link tokenje így soha nem térhet vissza érvényesként.
// Párhuzamos kérések ellen feltételes `updateMany`/egyedi constraint utáni
// újraolvasással védekezünk, nem a kliens `busy` state-jére támaszkodva.
export async function createOrReactivateShare(
  userId: string,
  scooterId: string,
): Promise<ShareMutationResult> {
  const scooter = await findOwnedScooterForReport(userId, scooterId);
  if (!scooter) return { status: "not_found" };

  const readiness = computeReadiness(toReadinessInput(scooterId, scooter));
  if (!readiness.canShare) {
    return { status: "not_ready", missingRequired: readiness.missingRequired };
  }

  const existing = await prisma.saleReport.findFirst({
    where: { scooterId, ownerId: userId },
  });

  // Már aktív: idempotens válasz, semmilyen írás nem történik (a
  // snapshot frissítése tudatos "Megosztás frissítése" művelet, nem ez).
  // Nem állítunk `alreadyUpToDate`-et - ez a művelet nem ellenőrizte a
  // snapshot tényleges állapotát, azt a kliens a friss szerverpropból
  // (`snapshotStatus`) kapja meg.
  if (existing?.isActive) {
    return {
      status: "ok",
      publicToken: existing.publicToken,
      publishedAt: existing.publishedAt ?? existing.updatedAt,
      createdOrReactivated: false,
    };
  }

  const liveSnapshot = buildValidatedLiveSnapshot(scooter);
  if (!liveSnapshot) return { status: "not_found" };
  const hash = hashSnapshot(liveSnapshot);
  const publishedAt = new Date();
  const token = await generateUniqueToken();

  if (existing) {
    // Inaktív/visszavont sor újraaktiválása. Feltételes `updateMany`: csak
    // akkor aktiválunk, ha a sor a mi olvasásunk óta is inaktív maradt -
    // ha egy párhuzamos kérés közben már reaktiválta, nem írjuk felül
    // csendben, hanem visszaolvassuk a ténylegesen aktív állapotot.
    await prisma.saleReport.updateMany({
      where: { scooterId, isActive: false },
      data: {
        ownerId: userId,
        publicToken: token,
        isActive: true,
        revokedAt: null,
        snapshot: liveSnapshot,
        snapshotHash: hash,
        snapshotVersion: 1,
        publishedAt,
      },
    });
    const current = await prisma.saleReport.findUnique({
      where: { scooterId },
      select: {
        ownerId: true,
        isActive: true,
        publicToken: true,
        publishedAt: true,
      },
    });
    if (current?.isActive && current.ownerId === userId) {
      return {
        status: "ok",
        publicToken: current.publicToken,
        publishedAt: current.publishedAt ?? publishedAt,
        createdOrReactivated: true,
      };
    }
    return { status: "not_found" };
  }

  // Még nem létező sor: create. Egyedi constraint ütközés esetén (egy
  // párhuzamos kérés közben már létrehozta) visszaolvassuk a ténylegesen
  // létrejött reportot, de csak akkor adjuk vissza sikeres válaszként, ha
  // az aktív ÉS a megfelelő ownerhez tartozik - eltérésnél nem szivárogtatunk
  // részletet, se nem javítunk automatikusan, csak semleges not_found-ot
  // adunk, mint egy sikertelen másodikat.
  try {
    const created = await prisma.saleReport.create({
      data: {
        scooterId,
        ownerId: userId,
        publicToken: token,
        isActive: true,
        snapshot: liveSnapshot,
        snapshotHash: hash,
        snapshotVersion: 1,
        publishedAt,
      },
    });
    return {
      status: "ok",
      publicToken: created.publicToken,
      publishedAt: created.publishedAt ?? publishedAt,
      createdOrReactivated: true,
    };
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      const current = await prisma.saleReport.findUnique({
        where: { scooterId },
        select: {
          ownerId: true,
          isActive: true,
          publicToken: true,
          publishedAt: true,
        },
      });
      if (current?.isActive && current.ownerId === userId) {
        return {
          status: "ok",
          publicToken: current.publicToken,
          publishedAt: current.publishedAt ?? publishedAt,
          createdOrReactivated: true,
        };
      }
      return { status: "not_found" };
    }
    throw e;
  }
}

const refreshedReportSelect = {
  id: true,
  ownerId: true,
  isActive: true,
  publicToken: true,
  publishedAt: true,
  updatedAt: true,
  snapshot: true,
  snapshotHash: true,
  snapshotVersion: true,
} as const;

// Legfeljebb egy belső újrapróbálkozás egy ütköző konkurrens frissítés
// esetén - nincs korlátlan rekurzió.
const MAX_REFRESH_ATTEMPTS = 2;

// Megosztás frissítése: nem generál új tokent. Mindig újraépíti az élő
// snapshotot; csak akkor jelzünk "naprakész"-t, ha a MEGLÉVŐ tárolt
// snapshot ténylegesen valid ÉS a belőle újraszámított hash egyezik az
// élő hash-sel - egy corrupt/inkonzisztens tárolt sor mindig újraírásra
// kerül, akkor is, ha a nyers `snapshotHash` mező véletlenül egyezne. Ez a
// legacy (snapshot nélküli) aktív reportokra is vonatkozik: az első
// snapshotjukat is ez a művelet hozza létre, a MEGLÉVŐ tokennel, revoke
// nélkül.
//
// Optimista concurrency: a művelet elején beolvasott report-generációhoz
// (token + updatedAt) kötjük az írást. Ha közben revoke történt, vagy egy
// reaktiválás új tokent generált, a feltételes update nem talál egyezést,
// és a művelet visszaolvasás után `not_found`-ot ad - egy régi refresh
// soha nem írhatja felül egy újabb report-generáció adatait.
export async function refreshShare(
  userId: string,
  scooterId: string,
): Promise<ShareMutationResult> {
  const scooter = await findOwnedScooterForReport(userId, scooterId);
  if (!scooter) return { status: "not_found" };

  const readiness = computeReadiness(toReadinessInput(scooterId, scooter));
  if (!readiness.canShare) {
    return { status: "not_ready", missingRequired: readiness.missingRequired };
  }

  const liveSnapshot = buildValidatedLiveSnapshot(scooter);
  if (!liveSnapshot) return { status: "not_found" };
  const liveHash = hashSnapshot(liveSnapshot);

  return attemptRefresh(userId, scooterId, liveSnapshot, liveHash, 0);
}

async function attemptRefresh(
  userId: string,
  scooterId: string,
  liveSnapshot: NonNullable<ReturnType<typeof buildValidatedLiveSnapshot>>,
  liveHash: string,
  attempt: number,
): Promise<ShareMutationResult> {
  const existing = await prisma.saleReport.findFirst({
    where: { scooterId, ownerId: userId, isActive: true },
    select: refreshedReportSelect,
  });
  if (!existing) return { status: "not_found" };

  const seenToken = existing.publicToken;
  const seenUpdatedAt = existing.updatedAt;

  const stored = evaluateStoredSnapshot(existing);
  if (stored.status === "valid" && stored.hash === liveHash) {
    // Ne a korábban beolvasott (immár esetleg elavult) objektumból adjunk
    // sikert - olvassuk vissza ismét, és csak akkor jelezzünk naprakészt,
    // ha a jelenlegi állapot is aktív, owner-konzisztens, ugyanaz a token,
    // és a jelenlegi tárolt snapshot hash-e is egyezik az élővel.
    const reread = await prisma.saleReport.findUnique({
      where: { scooterId },
      select: refreshedReportSelect,
    });
    if (
      !reread ||
      !reread.isActive ||
      reread.ownerId !== userId ||
      reread.publicToken !== seenToken
    ) {
      return { status: "not_found" };
    }
    const rereadStored = evaluateStoredSnapshot(reread);
    if (rereadStored.status === "valid" && rereadStored.hash === liveHash) {
      return {
        status: "ok",
        publicToken: reread.publicToken,
        publishedAt: reread.publishedAt ?? new Date(),
        alreadyUpToDate: true,
      };
    }
    // Időközben megváltozott a tárolt tartalom - egy biztonságos belső
    // újrapróbálkozás az aktuális állapotra alapozva.
    if (attempt < MAX_REFRESH_ATTEMPTS) {
      return attemptRefresh(
        userId,
        scooterId,
        liveSnapshot,
        liveHash,
        attempt + 1,
      );
    }
    return { status: "conflict" };
  }

  const publishedAt = new Date();
  const result = await prisma.saleReport.updateMany({
    where: {
      id: existing.id,
      scooterId,
      ownerId: userId,
      isActive: true,
      publicToken: seenToken,
      updatedAt: seenUpdatedAt,
    },
    data: {
      snapshot: liveSnapshot,
      snapshotHash: liveHash,
      snapshotVersion: 1,
      publishedAt,
      updatedAt: publishedAt,
    },
  });

  if (result.count > 0) {
    return { status: "ok", publicToken: seenToken, publishedAt };
  }

  // A feltételes update (id + token + updatedAt előfeltétel) nem talált
  // egyezést - vagy visszavonták, vagy egy reaktiválás új tokent generált,
  // vagy egy párhuzamos refresh már írt. Visszaolvassuk a ténylegesen
  // aktuális állapotot, és csak owner-konzisztens, UGYANAZON token melletti
  // aktív sorra adunk sikert.
  const current = await prisma.saleReport.findUnique({
    where: { scooterId },
    select: refreshedReportSelect,
  });
  if (!current || !current.isActive || current.ownerId !== userId) {
    return { status: "not_found" };
  }
  if (current.publicToken !== seenToken) {
    // Reaktiválták új tokennel - ez a (régi) refresh nem kezelheti az új
    // report-generációt.
    return { status: "not_found" };
  }
  const currentStored = evaluateStoredSnapshot(current);
  if (currentStored.status === "valid" && currentStored.hash === liveHash) {
    return {
      status: "ok",
      publicToken: current.publicToken,
      publishedAt: current.publishedAt ?? publishedAt,
      alreadyUpToDate: true,
    };
  }
  // Ugyanaz a token aktív, de közben más live tartalom lett publikálva -
  // egy biztonságos belső újrapróbálkozás, korlátlan rekurzió nélkül.
  if (attempt < MAX_REFRESH_ATTEMPTS) {
    return attemptRefresh(
      userId,
      scooterId,
      liveSnapshot,
      liveHash,
      attempt + 1,
    );
  }
  return { status: "conflict" };
}

// A `expectedPublicToken` megköveteli, hogy a kliens pontosan azt a
// tokent vonja vissza, amit ő maga is lát - egy elavult böngészőfül soha
// nem vonhat vissza egy időközben (revoke + újbóli megosztás után)
// keletkezett ÚJ tokent.
export async function revokeShare(
  userId: string,
  scooterId: string,
  expectedPublicToken: string,
): Promise<{ status: "not_found" } | { status: "ok" }> {
  const result = await prisma.saleReport.updateMany({
    where: {
      scooterId,
      ownerId: userId,
      isActive: true,
      publicToken: expectedPublicToken,
    },
    data: { isActive: false, revokedAt: new Date() },
  });
  return result.count > 0 ? { status: "ok" } : { status: "not_found" };
}

async function generateUniqueToken(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const token = generateShareToken();
    const existing = await prisma.saleReport.findUnique({
      where: { publicToken: token },
      select: { id: true },
    });
    if (!existing) return token;
  }
  throw new Error("Nem sikerült egyedi tokent generálni.");
}
