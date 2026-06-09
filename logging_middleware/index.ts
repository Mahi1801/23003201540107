const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYWhpLjIzYjE1NDEwMjVAYWJlcy5hYy5pbiIsImV4cCI6MTc4MDk4NTg2NSwiaWF0IjoxNzgwOTg0OTY1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiN2ExZGViYjQtOGFiYi00ZjUwLWFmNTMtNjc2MzdiYjFjMWJiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFoaSBzaW5naGFsIiwic3ViIjoiOGUyOTVjZmUtNDMxMi00M2M3LWE0ZTItOGVmY2FkNjVlMjI2In0sImVtYWlsIjoibWFoaS4yM2IxNTQxMDI1QGFiZXMuYWMuaW4iLCJuYW1lIjoibWFoaSBzaW5naGFsIiwicm9sbE5vIjoiMjMwMDMyMTU0MDEwNyIsImFjY2Vzc0NvZGUiOiJjWHVxaHQiLCJjbGllbnRJRCI6IjhlMjk1Y2ZlLTQzMTItNDNjNy1hNGUyLThlZmNhZDY1ZTIyNiIsImNsaWVudFNlY3JldCI6IndzVm5wd0FXVkJjVmROamsifQ.GzKjarvgMjVMc9WIQTuUKuM4mdqLf-QblvO-m0VnGnk"; 

export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string
) {
  await fetch("http://4.224.186.213/evaluation-service/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify({
      stack,
      level,
      package: pkg,
      message
    })
  });
}
