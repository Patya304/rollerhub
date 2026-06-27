import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  devlogEntries,
  DEVLOG_TYPE_LABELS,
  type DevlogType,
} from "@/modules/devlog/data/devlog-entries";

export const metadata: Metadata = {
  title: "Fejlesztési napló – RollerHub",
  description: "A RollerHub fejlesztési mérföldkövei.",
};

const TYPE_BADGE_CLASS: Record<DevlogType, string> = {
  feature: "bg-green-100 text-green-700",
  fix: "bg-red-100 text-red-700",
  improvement: "bg-blue-100 text-blue-700",
  planning: "bg-amber-100 text-amber-700",
};

export default function DevlogPage() {
  const entries = [...devlogEntries].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <span className="bg-muted text-muted-foreground inline-block rounded-full px-3 py-1 text-xs font-medium">
        Nyilvános fejlesztési napló
      </span>
      <h1 className="mt-3 text-2xl font-semibold">
        RollerHub fejlesztési napló
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Itt követheted, hogyan fejlődik a RollerHub. Ez egy nyilvános, de nem
        főmenüs oldal, ahol röviden dokumentálom az új funkciókat, javításokat
        és fontosabb mérföldköveket.
      </p>

      <div className="mt-8 space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-muted-foreground text-xs">
                  {new Date(entry.date).toLocaleDateString("hu-HU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_BADGE_CLASS[entry.type]}`}
                >
                  {DEVLOG_TYPE_LABELS[entry.type]}
                </span>
              </div>
              <CardTitle className="mt-1 text-lg">{entry.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium">{entry.summary}</p>
              <p className="text-muted-foreground text-sm">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
