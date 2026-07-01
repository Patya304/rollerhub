import { PreviewAppShell } from "@/modules/preview/components/preview-app-shell";

export default function PreviewAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="black-orange"
      className="bg-background text-foreground min-h-screen"
    >
      <PreviewAppShell>{children}</PreviewAppShell>
    </div>
  );
}
