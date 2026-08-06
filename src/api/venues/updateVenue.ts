import { venuesUrl } from "@/constants/apiUrls";
import { getKey } from "@/api/helpers/getKey";
import { useAuthStore } from "@/store/authStore";
import type { VenueData } from "@/types/venueData";

/**
 * Update an existing venue.
 * @param {string} id - The id of the venue to update.
 * @param {VenueData} venueData - The updated venue payload.
 * @returns {Promise<any>} Resolves with the API response containing the updated venue.
 * @throws {Error} When API key or access token is missing, or the API returns an error.
 */
export async function updateVenue(id: string, venueData: VenueData) {
  const apiKey = await getKey();
  if (!apiKey) {
    throw new Error("API key is not available");
  }

  const accessToken = useAuthStore.getState().token;
  if (!accessToken) {
    throw new Error("Access token is not available");
  }

  const response = await fetch(`${venuesUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
    body: JSON.stringify(venueData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Updating venue failed");
  }

  return result;
}
