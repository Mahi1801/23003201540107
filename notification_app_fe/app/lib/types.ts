export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

export const WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};