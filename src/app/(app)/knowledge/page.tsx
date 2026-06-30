import {
  AppPage,
  AppPageHeader,
  AppPanelList,
  AppListItem,
} from "@/components/app-page";

const topics = [
  {
    marker: "01",
    eyebrow: "Közlekedési szabályok",
    title: "KRESZ",
    description: "Rollerrel az úton — mi szabad, mi nem, hol közlekedhetsz.",
    href: "/knowledge/kresz",
    available: false,
  },
  {
    marker: "02",
    eyebrow: "Felelősségvállalás",
    title: "Biztosítás",
    description:
      "Kötelező és ajánlott biztosítási formák elektromos rollerekhez.",
    href: "/knowledge/biztositas",
    available: false,
  },
  {
    marker: "03",
    eyebrow: "Okmányok",
    title: "Jogosítvány",
    description: "Mikor kell jogosítvány? Milyen kategória vonatkozik rád?",
    href: "/knowledge/jogositvany",
    available: false,
  },
  {
    marker: "04",
    eyebrow: "Szabályozás",
    title: "Roller szabályok",
    description: "Aktuális szabályok, zónák, sebességhatárok Magyarországon.",
    href: "/knowledge/szabalyok",
    available: false,
  },
];

export default function KnowledgePage() {
  return (
    <AppPage>
      <AppPageHeader
        eyebrow="05 · Tudástár"
        title="Tudásközpont"
        description="Fontos tudnivalók a rollerezésről Magyarországon."
      />

      <AppPanelList label="Témakörök">
        {topics.map((t) => (
          <AppListItem
            key={t.marker}
            href={t.available ? t.href : undefined}
            marker={t.marker}
            eyebrow={t.eyebrow}
            title={t.title}
            description={t.description}
            meta={t.available ? undefined : "Hamarosan"}
            disabled={!t.available}
          />
        ))}
      </AppPanelList>

      <p className="text-muted-foreground px-1 text-xs">
        A tudáscikkek hamarosan elérhetőek lesznek. Addig is a{" "}
        <a
          href="https://kozut.hu"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          közút.hu
        </a>{" "}
        és a KAV oldalán találsz hiteles információt.
      </p>
    </AppPage>
  );
}
