import { Notification, WEIGHT } from "./types";

export function sortByPriority(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    const weightDiff = (WEIGHT[b.Type] || 0) - (WEIGHT[a.Type] || 0);
    if (weightDiff !== 0) return weightDiff;
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
  });
}