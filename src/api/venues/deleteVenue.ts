import { venuesUrl } from "@/constants/apiUrls";
import { getKey } from "@/api/helpers/getKey";
import { useAuthStore } from "@/store/authStore";

/**
 * Delete a venue owned by the authenticated user.
 * @param {string} id - Venue id to delete.
 * @returns {Promise<Response>} Resolves with the fetch `Response` when deletion succeeds.
 * @throws {Error} When API key or access token is missing, or deletion fails.
 */
export async function deleteVenue(id: string) {
  const apiKey = await getKey();
  if (!apiKey) {
    throw new Error("API key is not available");
  }

  const accessToken = useAuthStore.getState().token;
  if (!accessToken) {
    throw new Error("Access token is not available");
  }

  const response = await fetch(`${venuesUrl}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Deleting venue failed");
  }

  return response;
}