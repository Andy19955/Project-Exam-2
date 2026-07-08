import { venuesUrl } from "@/constants/apiUrls";

export async function fetchVenues() {
  const response = await fetch(`${venuesUrl}?_owner=true&sort=created&sortOrder=desc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Failed to fetch venues");
  }
  return result;
}
