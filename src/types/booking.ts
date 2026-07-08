import { Profile } from "@/types/profile";
import { Venue } from "./venue";

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer?: Profile;
  venue?: Venue;
}
