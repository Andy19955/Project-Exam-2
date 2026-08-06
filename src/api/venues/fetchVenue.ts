import { venuesUrl } from "@/constants/apiUrls";

/**
 * Fetch a single venue by id.
 * @param {string} id - Venue id to fetch.
 * @returns {Promise<any>} Resolves with the API response containing the venue in `data`.
 * @throws {Error} When the network request fails or the API responds with an error.
 */
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