import {
  AppPage,
  AppPageHeader,
  AppPanelList,
  AppListItem,
} from "@/components/app-page";
import { KNOWLEDGE_TOPICS } from "@/modules/preview/demo-data";

export default function PreviewKnowledgePage() {
  return (
    <AppPage>
      <AppPageHeader
        eyebrow="06 · Tudástár"
        title="Tudásközpont"
        description="Fontos tudnivalók a rollerezésről Magyarországon."
      />

      <AppPanelList label="Témakörök">
        {KNOWLEDGE_TOPICS.map((t) => (
          <AppListItem
            key={t.marker}
            marker={t.marker}
            eyebrow={t.eyebrow}
            title={t.title}
            description={t.description}
            meta="Hamarosan"
            disabled
          />
        ))}
      </AppPanelList>

      <div className="space-y-1 px-1">
        <p className="text-muted-foreground text-xs">
          A tudáscikkek hamarosan elérhetőek lesznek. Addig is ezeken az
          oldalakon találsz hiteles információt:
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
            </a>{" "}
            — Közúti közlekedési hatóság
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
            </a>{" "}
            — Közlekedési Alkalmassági és Vizsgaközpont
          </li>
        </ul>
      </div>
    </AppPage>
  );
}
