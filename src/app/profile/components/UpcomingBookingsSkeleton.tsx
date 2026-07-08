"use client";

import CardSkeleton from "@/components/CardSkeleton";

export default function UpcomingBookingsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-(--text-primary)">Upcoming Bookings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
