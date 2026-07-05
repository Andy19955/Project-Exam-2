export async function getKey(): Promise<string | null> {
  const hostname = window.location.hostname;
  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(hostname) || hostname.endsWith(".local") || hostname.endsWith(".test");

  if (isLocalHost) {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    return apiKey ?? null;
  } else {
    const response = await fetch("/.netlify/functions/getKeys");
    if (!response.ok) throw new Error("Failed to fetch API key");
    const data = await response.json();
    return data.apiKey;
  }
}
