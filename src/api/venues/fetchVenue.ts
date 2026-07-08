import { venuesUrl } from "@/constants/apiUrls";

export async function fetchVenue(id: string) {
  const response = await fetch(`${venuesUrl}/${id}?_owner=true&_bookings=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Failed to fetch venue");
  }

  return result;
}