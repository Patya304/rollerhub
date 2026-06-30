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
  },
  {
    marker: "02",
    eyebrow: "Felelősségvállalás",
    title: "Biztosítás",
    description:
      "Kötelező és ajánlott biztosítási formák elektromos rollerekhez.",
    href: "/knowledge/biztositas",
  },
  {
    marker: "03",
    eyebrow: "Okmányok",
    title: "Jogosítvány",
    description: "Mikor kell jogosítvány? Milyen kategória vonatkozik rád?",
    href: "/knowledge/jogositvany",
  },
  {
    marker: "04",
    eyebrow: "Szabályozás",
    title: "Roller szabályok",
    description: "Aktuális szabályok, zónák, sebességhatárok Magyarországon.",
    href: "/knowledge/szabalyok",
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
            key={t.href}
            href={t.href}
            marker={t.marker}
            eyebrow={t.eyebrow}
            title={t.title}
            description={t.description}
          />
        ))}
      </AppPanelList>
    </AppPage>
  );
}
