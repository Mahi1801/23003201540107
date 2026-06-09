import { Log } from "./index";

async function test() {
  console.log("Sending log request to evaluation service...");
  try {
    await Log("frontend", "info", "component", "Logging middleware initialized successfully");
    console.log("Log request completed successfully!");
  } catch (error) {
    console.error("Error sending log request:", error);
  }
}

test();