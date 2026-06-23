import Link from "next/link";
import VenueGrid from "@/components/venues/VenueGrid";

export default function PopularVenues() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between my-5">
        <h2 className="text-2xl font-bold">Popular Venues</h2>
        <Link href="/venues" className="text-(--text-muted) hover:underline hover:text-(--text-secondary) transition-all duration-200">
          View all
        </Link>
      </div>
      <VenueGrid />
    </section>
  );
}
