import { profileUrl } from "@/constants/apiUrls";
import { getKey } from "@/api/helpers/getKey";
import { useAuthStore } from "@/store/authStore";
import type { ProfileData } from "@/types/profileData";

/**
 * Update a user's profile data (requires authentication).
 * @param {string} name - Username of the profile to update.
 * @param {ProfileData} profileData - The profile payload to send.
 * @returns {Promise<any>} Resolves with the updated profile response.
 * @throws {Error} When API key or access token is missing, or the API responds with an error.
 */
export async function updateProfile(name: string, profileData: ProfileData) {
  const apiKey = await getKey();
  if (!apiKey) {
    throw new Error("API key is not available");
  }

  const accessToken = useAuthStore.getState().token;
  if (!accessToken) {
    throw new Error("Access token is not available");
  }
  const response = await fetch(`${profileUrl}/${name}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
    body: JSON.stringify({ ...profileData }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Updating profile failed");
  }
  return result;
}
