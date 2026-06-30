import Link from "next/link";
import { type ReactNode } from "react";

export function AppPage({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-2xl space-y-4">{children}</div>;
}

export function AppPageHeader({
  title,
  description,
  eyebrow,
  action,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 pb-1">
      <div>
        {eyebrow && (
          <p className="text-primary mb-1.5 text-xs font-semibold tracking-[0.2em] uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 pt-0.5">{action}</div>}
    </div>
  );
}

export function AppEmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed px-8 py-14 text-center">
      {icon && <p className="mb-4 text-4xl">{icon}</p>}
      <p className="font-semibold">{title}</p>
      {description && (
        <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/**
 * Nagy, nyomható app-sor.
 * Önállóan is használható, de legjobban AppPanelList-en belül.
 */
export function AppListItem({
  href,
  marker,
  eyebrow,
  title,
  description,
  meta,
  icon,
  disabled,
}: {
  href?: string;
  marker?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  icon?: string;
  disabled?: boolean;
}) {
  const inner = (
    <>
      {/* Bal oldal: marker vagy ikon */}
      {(marker || icon) && (
        <span className="flex w-8 shrink-0 items-start justify-center pt-0.5">
          {icon ? (
            <span className="text-xl leading-none">{icon}</span>
          ) : (
            <span className="text-muted-foreground/50 font-mono text-xs font-semibold tabular-nums">
              {marker}
            </span>
          )}
        </span>
      )}

      {/* Közép: eyebrow + title + description */}
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="text-muted-foreground mb-0.5 text-xs font-medium tracking-widest uppercase">
            {eyebrow}
          </p>
        )}
        <p
          className={`leading-snug font-semibold ${disabled ? "text-muted-foreground" : ""}`}
        >
          {title}
        </p>
        {description && (
          <p className="text-muted-foreground mt-0.5 text-sm leading-snug">
            {description}
          </p>
        )}
        {meta && (
          <p className="text-muted-foreground/70 mt-1 font-mono text-xs tabular-nums">
            {meta}
          </p>
        )}
      </div>

      {/* Jobb oldal: nyíl */}
      <span
        className={`shrink-0 text-sm transition-colors ${
          disabled
            ? "text-muted-foreground/30"
            : "text-muted-foreground group-hover:text-primary"
        }`}
      >
        →
      </span>
    </>
  );

  const cls = `group flex items-center gap-4 px-5 py-4 transition-colors ${
    disabled ? "cursor-default opacity-60" : "hover:bg-muted/30 cursor-pointer"
  }`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return <div className={cls}>{inner}</div>;
}

/**
 * Több AppListItem egy közös panelben, elválasztó borderrel.
 * Appos menülistás megjelenés.
 */
export function AppPanelList({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      {label && (
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            {label}
          </p>
        </div>
      )}
      <div className="divide-border/40 divide-y">{children}</div>
    </div>
  );
}

/** Kis adatcella panel — 2-4 oszlopos stat gridhez */
export function StatCell({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="bg-muted/40 rounded-lg px-3 py-2.5">
      <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-base leading-none font-semibold tabular-nums">
        {value}
        {unit && (
          <span className="text-muted-foreground ml-1 text-xs font-normal">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

/** Panel szekció — border-b headerrel, szabad tartalommal */
export function AppSection({
  label,
  children,
  className,
  id,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`bg-card overflow-hidden rounded-xl border ${className ?? ""}`}
    >
      <div className="border-border/50 border-b px-5 py-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
          {label}
        </p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

/** Nagy, önálló kattintható kártya ikonnal (dashboard nav-elem) */
export function AppCard({
  href,
  icon,
  title,
  description,
  badge,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <a
      href={href}
      className="bg-card hover:border-primary/50 group flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors"
    >
      <span className="bg-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{title}</p>
          {badge && (
            <span className="text-primary border-primary/30 rounded-full border px-1.5 py-0.5 text-xs">
              {badge}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
      </div>
      <span className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors">
        →
      </span>
    </a>
  );
}
