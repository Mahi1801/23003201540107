const CREDENTIALS = {
  email: "mahi.23b1541025@abes.ac.in",
  name: "mahi singhal",
  rollNo: "2300321540107",
  accessCode: "cXuqht",
  clientID: "8e295cfe-4312-43c7-a4e2-8efcad65e226",
  clientSecret: "wsVnpwAWVBcVdNjk"
};

let cachedToken: string | null = null;
let cachedTokenExpiry = 0;

async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedTokenExpiry - 30) {
    return cachedToken;
  }

  const authResponse = await fetch("http://4.224.186.213/evaluation-service/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(CREDENTIALS)
  });

  if (!authResponse.ok) {
    throw new Error(`Authentication failed with status ${authResponse.status}`);
  }

  const authData = await authResponse.json();
  cachedToken = authData.access_token;
  cachedTokenExpiry = authData.expires_in;
  return cachedToken;
}

const WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications() {
  console.log("fetchNotifications: Initiating HTTP request...");
  try {
    const token = await getAuthToken();
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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