import Link from "next/link";

const topics = [
  {
    title: "KRESZ",
    description: "Közlekedési szabályok rollerrel.",
    href: "/knowledge/kresz",
  },
  {
    title: "Biztosítás",
    description: "Kötelező és ajánlott biztosítások.",
    href: "/knowledge/biztositas",
  },
  {
    title: "Jogosítvány",
    description: "Mikor kell jogosítvány a rollerhez?",
    href: "/knowledge/jogositvany",
  },
  {
    title: "Roller szabályok",
    description: "Hol és hogyan közlekedhetsz.",
    href: "/knowledge/szabalyok",
  },
];

export default function KnowledgePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Tudásközpont</h1>
      <p className="text-muted-foreground text-sm">
        Hasznos tudnivalók a rollerezésről Magyarországon.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="hover:bg-accent rounded-lg border p-4 transition-colors"
          >
            <p className="font-medium">{t.title}</p>
            <p className="text-muted-foreground text-sm">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
