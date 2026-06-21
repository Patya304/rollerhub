export const SERVICE_TYPES = [
  "TIRE_CHANGE",
  "BRAKE_CHANGE",
  "BATTERY",
  "SERVICE",
  "OTHER",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  TIRE_CHANGE: "Gumicsere",
  BRAKE_CHANGE: "Fékcsere",
  BATTERY: "Akkumulátor",
  SERVICE: "Szerviz",
  OTHER: "Egyéb",
};
