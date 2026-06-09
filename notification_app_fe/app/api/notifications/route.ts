import { NextResponse } from "next/server";

const BASE_URL = "http://4.224.186.213/evaluation-service";

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

  console.log("Token missing or expired. Fetching fresh token...");
  const authResponse = await fetch(`${BASE_URL}/auth`, {
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
  console.log("Successfully retrieved fresh token. Expiry epoch:", cachedTokenExpiry);
  return cachedToken;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const notificationType = searchParams.get("notification_type");

  let targetUrl = `${BASE_URL}/notifications`;
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit);
  if (notificationType && notificationType !== "All") {
    params.append("notification_type", notificationType);
  }

  const queryString = params.toString();
  if (queryString) {
    targetUrl += `?${queryString}`;
  }

  try {
    const token = await getAuthToken();

    const response = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch from backend" },
      { status: 500 }
    );
  }
}
