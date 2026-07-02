export type ThemeOption = {
  value: string;
  label: string;
  hint: string;
  recommended?: boolean;
};

type SettingsThemeOptionsProps = {
  options: ThemeOption[];
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export function SettingsThemeOptions({
  options,
  value,
  onChange,
  disabled = false,
}: SettingsThemeOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {options.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={disabled ? undefined : () => onChange?.(t.value)}
            disabled={disabled}
            className={`relative rounded-lg border p-3 text-left transition-colors ${
              active
                ? "border-primary bg-primary/5 ring-primary ring-1"
                : disabled
                  ? "opacity-60"
                  : "hover:bg-muted/50"
            } ${disabled ? "cursor-default" : ""}`}
          >
            {t.recommended && (
              <span className="text-primary absolute top-2 right-2 text-xs font-semibold">
                ★
              </span>
            )}
            <span className="block text-sm font-semibold">{t.label}</span>
            <span className="text-muted-foreground text-xs">
              {t.recommended ? `${t.hint} · ajánlott` : t.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
