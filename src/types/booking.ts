import { Profile } from "@/types/profile";
import { Media } from "@/types/media";

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer: Profile;
  banner: Media[];
}
