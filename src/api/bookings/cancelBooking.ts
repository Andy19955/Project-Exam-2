import { bookingsUrl } from "@/constants/apiUrls";
import { getKey } from "@/api/helpers/getKey";
import { useAuthStore } from "@/store/authStore";

/**
 * Cancel an existing booking.
 * @param {string} bookingId - The booking id to cancel.
 * @returns {Promise<Response>} Resolves with the fetch `Response` on success.
 * @throws {Error} When API key or access token is missing, or cancellation fails.
 */
export async function cancelBooking(bookingId: string) {
  const apiKey = await getKey();
  if (!apiKey) {
    throw new Error("API key is not available");
  }

  const accessToken = useAuthStore.getState().token;
  if (!accessToken) {
    throw new Error("Access token is not available");
  }
  const response = await fetch(`${bookingsUrl}/${bookingId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Cancel booking failed");
  }
  return response;
}
