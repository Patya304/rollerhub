import { prisma } from "@/lib/prisma";
import {
  conditionInputSchema,
  normalizeConditionInput,
  toConditionDto,
  type ConditionDto,
} from "@/modules/sale-report/condition";

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

// A jogosultság mindig a Scooter tulajdonosán (userId, deletedAt: null)
// keresztül ellenőrzött - nincs külön ownerId a ScooterConditionön, hogy ne
// legyen egy második, önállóan elszállható konzisztencia-probléma.
async function findOwnedScooter(userId: string, scooterId: string) {
  return prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
    select: { id: true },
  });
}

export async function getOwnerCondition(
  userId: string,
  scooterId: string,
): Promise<ConditionDto> {
  const scooter = await prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
    select: { condition: { select: conditionSelect } },
  });
  if (!scooter) return null;
  return toConditionDto(scooter.condition);
}

export type ConditionMutationResult =
  | { status: "not_found" }
  | { status: "invalid"; fieldErrors: Record<string, string> }
  | { status: "ok"; condition: ConditionDto };

export async function upsertOwnerCondition(
  userId: string,
  scooterId: string,
  raw: unknown,
): Promise<ConditionMutationResult> {
  const scooter = await findOwnedScooter(userId, scooterId);
  if (!scooter) return { status: "not_found" };

  const parsed = conditionInputSchema.safeParse(normalizeConditionInput(raw));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "invalid", fieldErrors };
  }

  const data = parsed.data;
  const saved = await prisma.scooterCondition.upsert({
    where: { scooterId },
    create: { scooterId, ...data },
    update: { ...data },
    select: conditionSelect,
  });

  return { status: "ok", condition: toConditionDto(saved) };
}
