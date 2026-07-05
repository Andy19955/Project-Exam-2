"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { userLogin } from "@/api/auth/userLogin";
import { loginFormSchema, type LoginData } from "@/schemas/loginFormSchema";
import { useAuthStore } from "@/store/authStore";
import { z } from "zod";

type FieldErrors = Partial<Record<keyof LoginData, string>>;

export default function LoginForm() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setFieldErrors({});
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const formValues = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const validationResult = loginFormSchema.safeParse(formValues);

    if (!validationResult.success) {
      const flattenedErrors = z.flattenError(validationResult.error);
      setFieldErrors({
        email: flattenedErrors.fieldErrors.email?.[0],
        password: flattenedErrors.fieldErrors.password?.[0],
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await userLogin(validationResult.data);
      const userData = {
        name: response.data.name,
        email: response.data.email,
        venueManager: response.data.venueManager,
      };
      useAuthStore.getState().setAuth(response.data.accessToken, userData);
      router.push("/");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          className={`rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${fieldErrors.email ? "border-(--error) focus:ring-(--error)" : "border-gray-300 focus:ring-blue-500"}`}
          required
        />
        {fieldErrors.email ? <p className="text-sm text-(--error)">{fieldErrors.email}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          className={`rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${fieldErrors.password ? "border-(--error) focus:ring-(--error)" : "border-gray-300 focus:ring-blue-500"}`}
          required
        />
        {fieldErrors.password ? <p className="text-sm text-(--error)">{fieldErrors.password}</p> : null}
      </div>
      {formError ? <div className="rounded-md bg-(--background-error) p-3 text-sm text-(--error)">{formError}</div> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
