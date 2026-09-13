"use client";

import { Booking } from "@/types/booking";
import BookingCard from "./BookingCard";

function parseBookingDate(dateString: string) {
  const [datePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export default function UpcomingBookings({ bookings, onBookingCancelled }: { bookings?: Booking[]; onBookingCancelled?: () => Promise<void> | void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingBookings = bookings?.filter((booking) => parseBookingDate(booking.dateTo) > today) ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-(--text-primary)">Upcoming Bookings</h2>
      {upcomingBookings.length === 0 && <p className="text-(--text-secondary)">You have no upcoming bookings.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {upcomingBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} onBookingCancelled={onBookingCancelled} />
        ))}
      </div>
    </section>
  );
}
