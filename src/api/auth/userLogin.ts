import { signInUrl } from "@/constants/apiUrls";
import type { LoginData } from "@/schemas/loginFormSchema";

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
