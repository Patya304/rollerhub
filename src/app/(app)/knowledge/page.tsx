import {
  AppPage,
  AppPageHeader,
  AppPanelList,
  AppListItem,
} from "@/components/app-page";

const topics = [
  {
    marker: "01",
    title: "KRESZ",
    description: "Alap közlekedési szabályok rollereseknek.",
    href: "/knowledge/kresz",
    available: true,
  },
  {
    marker: "02",
    title: "Biztosítás",
    description: "Biztosítási tudnivalók elektromos rollerekhez.",
    href: "/knowledge/biztositas",
    available: true,
  },
  {
    marker: "03",
    title: "Jogosítvány",
    description: "Jogosítvány és kategóriák rollereseknek.",
    href: "/knowledge/jogositvany",
    available: true,
  },
  {
    marker: "04",
    title: "Roller szabályok",
    description: "Szabályok és korlátozások Magyarországon.",
    href: "/knowledge/szabalyok",
    available: true,
  },
];

export default function KnowledgePage() {
  return (
    <AppPage>
      <AppPageHeader
        title="Tudástár"
        description="Szabályok és hasznos infók rollereseknek."
      />

      <AppPanelList label="Témakörök">
        {topics.map((t) => (
          <AppListItem
            key={t.marker}
            href={t.available ? t.href : undefined}
            marker={t.marker}
            title={t.title}
            description={t.description}
            meta={t.available ? undefined : "Készül"}
            disabled={!t.available}
          />
        ))}
      </AppPanelList>

      <div className="space-y-1 px-1">
        <p className="text-muted-foreground text-xs">
          A cikkek tájékoztató jellegűek. Hivatalos információkért ezeket az
          oldalakat érdemes megnézni:
        </p>
        <ul className="text-muted-foreground space-y-0.5 text-xs">
          <li>
            →{" "}
            <a
              href="https://kozut.hu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              kozut.hu
            </a>
            : Közúti közlekedési hatóság
          </li>
          <li>
            →{" "}
            <a
              href="https://kav.hu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              kav.hu
            </a>
            : Közlekedési Alkalmassági és Vizsgaközpont
          </li>
        </ul>
      </div>
    </AppPage>
  );
}
