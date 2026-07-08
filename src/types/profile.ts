import { Media } from "./media";
import { Booking } from "./booking";

export interface Profile {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
  bookings?: Booking[];
  venueManager: boolean;
}
