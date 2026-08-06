import { bookingsUrl } from "@/constants/apiUrls";
import { getKey } from "@/api/helpers/getKey";
import { useAuthStore } from "@/store/authStore";

/**
 * Create a booking for a venue.
 * @param {{ dateFrom: string; dateTo: string; guests: number; venueId: string }} bookingData - Booking payload.
 * @returns {Promise<any>} Resolves with the created booking response.
 * @throws {Error} When API key or access token is missing, or the API responds with an error.
 */
export async function createBooking(bookingData: { dateFrom: string; dateTo: string; guests: number; venueId: string }) {
  const apiKey = await getKey();
  if (!apiKey) {
    throw new Error("API key is not available");
  }

  const accessToken = useAuthStore.getState().token;
  if (!accessToken) {
    throw new Error("Access token is not available");
  }
  const response = await fetch(`${bookingsUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
    body: JSON.stringify({ ...bookingData }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Create booking failed");
  }
  return result;
}
