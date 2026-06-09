const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYWhpLjIzYjE1NDEwMjVAYWJlcy5hYy5pbiIsImV4cCI6MTc4MDk4OTQ5MiwiaWF0IjoxNzgwOTg4NTkyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiN2IzMjZmM2EtMDMwOS00MTk5LTgzMWMtYjI0ZjBiM2M2ZmEyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFoaSBzaW5naGFsIiwic3ViIjoiOGUyOTVjZmUtNDMxMi00M2M3LWE0ZTItOGVmY2FkNjVlMjI2In0sImVtYWlsIjoibWFoaS4yM2IxNTQxMDI1QGFiZXMuYWMuaW4iLCJuYW1lIjoibWFoaSBzaW5naGFsIiwicm9sbE5vIjoiMjMwMDMyMTU0MDEwNyIsImFjY2Vzc0NvZGUiOiJjWHVxaHQiLCJjbGllbnRJRCI6IjhlMjk1Y2ZlLTQzMTItNDNjNy1hNGUyLThlZmNhZDY1ZTIyNiIsImNsaWVudFNlY3JldCI6IndzVm5wd0FXVkJjVmROamsifQ.ujmQl9b4TMnnkst3YKSYN5UhUW7u7MO_Yhjn4q6Q7IM";

const WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications() {
  console.log("fetchNotifications: Initiating HTTP request...");
  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    console.log("fetchNotifications: Response status:", response.status);
    const data = await response.json() as any;
    console.log("fetchNotifications: Parsing JSON completed.");
    return data.notifications;
  } catch (err) {
    console.error("fetchNotifications: Error during fetch:", err);
    throw err;
  }
}

async function getTopNotifications(n: number = 10) {
  console.log("getTopNotifications: Fetching notifications...");
  const notifications = await fetchNotifications();

  if (!notifications || notifications.length === 0) {
    console.log("getTopNotifications: No notifications received");
    return [];
  }

  console.log(`getTopNotifications: Received ${notifications.length} notifications, sorting them...`);
  const sorted = notifications.sort((a: any, b: any) => {
    const weightDiff = (WEIGHT[b.Type] || 0) - (WEIGHT[a.Type] || 0);
    if (weightDiff !== 0) return weightDiff;
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
  });

  return sorted.slice(0, n);
}

async function main() {
  console.log("main: Starting execution...");
  try {
    const top10 = await getTopNotifications(10);
    console.log("Top 10 Priority Notifications:");
    console.log(JSON.stringify(top10, null, 2));
  } catch (error) {
    console.error("main: Critical error occurred:", error);
  }
}

main();