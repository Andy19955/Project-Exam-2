import type { LoginData } from "@/schemas/loginFormSchema";

export async function userLogin(credentials: LoginData) {
  const response = await fetch("https://v2.api.noroff.dev/auth/login?_holidaze=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Login failed");
  }
  return result;
}
