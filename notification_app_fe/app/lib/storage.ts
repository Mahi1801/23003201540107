export function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const stored = localStorage.getItem("readNotifications");
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

export function markAsRead(id: string): void {
  const readIds = getReadIds();
  readIds.add(id);
  localStorage.setItem("readNotifications", JSON.stringify([...readIds]));
}