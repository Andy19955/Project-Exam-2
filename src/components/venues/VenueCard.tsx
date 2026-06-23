import { Venue } from "@/types/venue";
import Image from "next/image";
import Link from "next/link";

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className="flex flex-col box-shadow-md rounded-lg bg-(--surface)">
      <Image src={venue.media[0]?.url || ""} alt={venue.media[0]?.alt || venue.name} width={340} height={160} className="object-cover rounded-t-lg w-full h-40" />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">{venue.name}</h3>
        <p className="text-(--text-muted)">{venue.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold">${venue.price.toFixed(2)}</span>
          <Link href={`/venues/${venue.id}`} className="border border-(--border) text-(--text-secondary) border-solid rounded-lg px-3 py-2 hover:bg-(--surface-hover) transition-colors duration-200">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
