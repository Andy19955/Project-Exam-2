"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { userRegistration } from "@/api/auth/userRegistration";
import { registerFormSchema, type RegistrationData } from "@/schemas/registerFormSchema";
import { z } from "zod";

type FieldErrors = Partial<Record<keyof RegistrationData, string>>;

export default function RegisterForm() {
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
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      venueManager: formData.get("venueManager") === "on",
    };

    const validationResult = registerFormSchema.safeParse(formValues);

    if (!validationResult.success) {
      const flattenedErrors = z.flattenError(validationResult.error);
      setFieldErrors({
        name: flattenedErrors.fieldErrors.name?.[0],
        email: flattenedErrors.fieldErrors.email?.[0],
        password: flattenedErrors.fieldErrors.password?.[0],
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await userRegistration(validationResult.data);
      router.push("/login?registered=1");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          className={`rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${fieldErrors.name ? "border-(--error) focus:ring-(--error)" : "border-gray-300 focus:ring-blue-500"}`}
          required
        />
        {fieldErrors.name ? <p className="text-sm text-(--error)">{fieldErrors.name}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
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
          className={`rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${fieldErrors.password ? "border-(--error) focus:ring-(--error)" : "border-gray-300 focus:ring-blue-500"}`}
          required
        />
        {fieldErrors.password ? <p className="text-sm text-(--error)">{fieldErrors.password}</p> : null}
      </div>
      <div className="flex gap-2 items-center">
        <input type="checkbox" id="venueManager" name="venueManager" className="w-4 h-4" />
        <label htmlFor="venueManager" className="font-semibold">
          Register as a venue manager
        </label>
      </div>
      {formError ? <div className="rounded-md bg-(--background-error) p-3 text-sm text-(--error)">{formError}</div> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
