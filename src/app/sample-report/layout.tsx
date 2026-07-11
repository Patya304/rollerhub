// A minta riport a pricing oldalról nyílik, ezért ugyanabban a fix témájú,
// app stílusú keretben jelenik meg.
export default function SampleReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="black-orange"
      className="bg-background text-foreground flex min-h-screen flex-col"
    >
      {children}
    </div>
  );
}
