import { z } from "zod";

export const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Name can only contain letters, numbers, and underscores"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .regex(/@stud\.noroff\.no$/, "Email must be a stud.noroff.no address"),
  password: z.string().trim().min(8, "Password must be at least 8 characters long"),
  venueManager: z.boolean().optional(),
});

export type RegistrationData = z.infer<typeof registerFormSchema>;
