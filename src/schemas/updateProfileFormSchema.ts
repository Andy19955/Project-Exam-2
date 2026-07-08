import { z } from "zod";

export const updateProfileFormSchema = z.object({
  bannerUrl: z.url("Enter a valid URL"),
  bannerAlt: z.string("Banner alt text must be a string").optional(),
  avatarUrl: z.url("Enter a valid URL"),
  avatarAlt: z.string("Avatar alt text must be a string").optional(),
  bio: z.string("Bio must be a string").optional(),
  venueManager: z.boolean("Venue manager must be a boolean"),
});

export type UpdateProfileData = z.infer<typeof updateProfileFormSchema>;
