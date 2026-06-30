import { registerUrl } from "@/constants/apiUrls";
import type { RegistrationData } from "@/schemas/registerFormSchema";

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
