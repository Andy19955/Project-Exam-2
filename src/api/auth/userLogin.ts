import { signInUrl } from "@/constants/apiUrls";
import type { LoginData } from "@/schemas/loginFormSchema";

/**
 * Authenticate a user.
 * @param {LoginData} loginData - Object containing `email` and `password`.
 * @returns {Promise<any>} Resolves with the API response.
 * @throws {Error} When the network request fails or credentials are invalid.
 */
export async function userLogin(loginData: LoginData) {
  const response = await fetch(signInUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Login failed");
  }
  return result;
}
