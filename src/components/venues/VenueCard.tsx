import { Venue } from "@/types/venue";
import Image from "next/image";
import Link from "next/link";
import { amenities } from "@/constants/amenities";

export default function VenueCard({ venue }: { venue: Venue }) {
  const locationText = venue.location.city && venue.location.country ? `${venue.location.city}, ${venue.location.country}` : venue.location.city || venue.location.country || "Location not available";

  return (
    <article className="flex flex-col shadow-md rounded-lg border border-(--border) bg-(--surface)">
      <Image src={venue.media[0]?.url || "/placeholder.jpg"} alt={venue.media[0]?.alt || venue.name} width={340} height={160} className="object-cover rounded-t-lg w-full min-h-40" />
      <div className="flex flex-col justify-between h-full p-4">
        <h3 className="text-lg font-bold mb-1">{venue.name}</h3>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-(--text-secondary)">
            <i className="fas fa-map-marker-alt mr-1"></i>
            {locationText}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <span className="font-semibold">${venue.price.toFixed(2)} / night</span>
            <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
              {Object.entries(venue.meta).map(([key, value]) =>
                value
                  ? (() => {
                      const amenity = amenities[key as keyof typeof amenities];
                      return <i key={key} className={amenity.icon} title={amenity.label}></i>;
                    })()
                  : null,
              )}
            </div>
          </div>
          <Link
            href={`/venue/${venue.id}`}
            className="border border-(--secondary) hover:border-(--secondary-hover) text-(--secondary) hover:text-white mt-3 font-semibold border-solid text-center rounded-lg px-3 py-1 hover:bg-(--secondary-hover) transition-colors duration-200"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
