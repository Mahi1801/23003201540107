export async function fetchAllNotifications() {
  const response = await fetch("/api/notifications");
  if (!response.ok) throw new Error("Failed to fetch notifications");
  const data = await response.json() as any;
  return data.notifications || [];
}