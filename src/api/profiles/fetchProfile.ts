import { profileUrl } from "@/constants/apiUrls";
import { getKey } from "@/api/helpers/getKey";
import { useAuthStore } from "@/store/authStore";

/**
 * Fetch a user's profile including bookings and venues (requires auth).
 * @param {string} name - The profile username to fetch.
 * @returns {Promise<any>} Resolves with the profile data in `data`.
 * @throws {Error} When API key or access token is missing, or the API responds with an error.
 */
export async function fetchProfile(name: string) {
  const apiKey = await getKey();
  if (!apiKey) {
    throw new Error("API key is not available");
  }

  const accessToken = useAuthStore.getState().token;
  if (!accessToken) {
    throw new Error("Access token is not available");
  }

  const response = await fetch(`${profileUrl}/${name}/?_bookings=true&_venues=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Fetch profile failed");
  }
  return result;
}
