import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().trim().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginFormSchema>;
