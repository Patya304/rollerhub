import { StatCell } from "@/components/app-page";
import { GarageVehicleListItem } from "@/components/garage-vehicle-list-item";

// Presentational publikus profil nézet: a valódi /profile/@username oldal és
// az előnézet is ezt rendereli. Csak propsból dolgozik, nincs auth/Prisma/fetch.

export type PublicProfileScooter = {
  brand: string;
  model: string;
  year: number | null;
  currentMileage: number;
};

// Kis profil-identitás blokk: a Profilom oldal élő előnézete is ezt használja.
export function ProfileIdentity({
  name,
  username,
  image,
  bio,
}: {
  name: string;
  username: string;
  image: string | null;
  bio?: string | null;
}) {
  const monogram = name.replace(/^@/, "").charAt(0).toUpperCase();
  return (
    <div className="flex items-center gap-4">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          className="h-14 w-14 shrink-0 rounded-full border object-cover"
        />
      ) : (
        <span className="bg-muted text-muted-foreground flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold">
          {monogram}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-semibold">{name}</p>
        <p className="text-muted-foreground text-sm">@{username}</p>
        {bio && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
}

export function PublicProfileView({
  name,
  username,
  image,
  bio,
  memberSinceYear,
  scooters,
  totalKm,
  serviceCount,
  eyebrow = "Publikus profil",
}: {
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
  memberSinceYear: number;
  scooters: PublicProfileScooter[];
  totalKm: number;
  serviceCount: number;
  eyebrow?: string;
}) {
  const monogram = name.replace(/^@/, "").charAt(0).toUpperCase();

  return (
    <>
      {/* Profil fejléc */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="flex items-center gap-4 px-5 py-5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="h-16 w-16 shrink-0 rounded-full border object-cover"
            />
          ) : (
            <span className="bg-muted text-muted-foreground flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold">
              {monogram}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight">{name}</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              @{username} · RollerHub-tag {memberSinceYear} óta
            </p>
          </div>
        </div>
        {bio && (
          <div className="border-border/50 border-t px-5 py-4">
            <p className="text-sm leading-relaxed">{bio}</p>
          </div>
        )}
      </div>

      {/* Statok */}
      <div className="grid grid-cols-3 gap-2">
        <StatCell label="Rollerek" value={String(scooters.length)} />
        <StatCell
          label="Összes km"
          value={totalKm.toLocaleString("hu-HU")}
          unit="km"
        />
        <StatCell label="Szervizek" value={String(serviceCount)} />
      </div>

      {/* Rollerek */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Rollerek
          </p>
        </div>
        {scooters.length === 0 ? (
          <p className="text-muted-foreground px-5 py-6 text-sm">
            Még nincs publikus roller.
          </p>
        ) : (
          <div className="divide-border/40 divide-y">
            {scooters.map((s, idx) => {
              const meta = [
                s.year ? String(s.year) : null,
                `${s.currentMileage.toLocaleString("hu-HU")} km`,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <GarageVehicleListItem
                  key={`${s.brand}-${s.model}-${idx}`}
                  marker={String(idx + 1).padStart(2, "0")}
                  title={`${s.brand} ${s.model}`}
                  meta={meta}
                  disabled
                />
              );
            })}
          </div>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        A profilon csak alapadatok jelennek meg. A szervizkönyv, az értékbecslés
        és a menetnapló privát marad.
      </p>
    </>
  );
}
