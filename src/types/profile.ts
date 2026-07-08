import { Media } from "./media";
import { Booking } from "./booking";
import { Venue } from "./venue";

export interface Profile {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
  bookings?: Booking[];
  venueManager: boolean;
  venues?: Venue[];
}
