import { z } from "zod";

export const createVenueFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  imageUrl: z.url("Enter a valid URL"),
  imageAlt: z.string("Image alt text must be a string").optional(),
  price: z.number().min(0, "Price must be a positive number"),
  maxGuests: z.number().min(1, "A venue must accommodate at least one guest"),
  wifi: z.boolean().optional(),
  parking: z.boolean().optional(),
  breakfast: z.boolean().optional(),
  pets: z.boolean().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
  continent: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type CreateVenueData = z.infer<typeof createVenueFormSchema>;
