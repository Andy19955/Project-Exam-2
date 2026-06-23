import { Media } from "@/types/media";

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
}
