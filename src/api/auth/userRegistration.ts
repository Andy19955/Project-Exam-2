import { registerUrl } from "@/constants/apiUrls";
import type { RegistrationData } from "@/schemas/registerFormSchema";

/**
 * Register a new user.
 * @param {RegistrationData} registrationData - Object with `name`, `email`, `password`, and optional `venueManager`.
 * @returns {Promise<any>} Resolves with the API response for the created user.
 * @throws {Error} When the API responds with validation errors or the network request fails.
 */
export async function userRegistration(registrationData: RegistrationData) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationData),
  };

  const response = await fetch(registerUrl, options);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Registration failed.");
  }
  return json;
}
