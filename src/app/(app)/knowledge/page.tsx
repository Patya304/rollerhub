import Link from "next/link";
import { AppPage, AppPageHeader } from "@/components/app-page";

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
    <AppPage>
      <AppPageHeader
        title="Tudásközpont"
        description="Hasznos tudnivalók a rollerezésről Magyarországon."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="hover:bg-accent rounded-lg border p-4 transition-colors"
          >
            <p className="font-medium">{t.title}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t.description}
            </p>
          </Link>
        ))}
      </div>
    </AppPage>
  );
}
