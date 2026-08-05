import { Booking } from "@/types/booking";

export interface BookingFormProps {
  maxGuests: number;
  price: number;
  bookings?: Booking[];
  venueId: string;
}
