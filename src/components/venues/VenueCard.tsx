import { Venue } from "@/types/venue";
import Image from "next/image";
import Link from "next/link";

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className="flex flex-col shadow-md rounded-lg border border-(--border) bg-(--surface)">
      <Image src={venue.media[0]?.url || "/placeholder.jpg"} alt={venue.media[0]?.alt || venue.name} width={340} height={160} className="object-cover rounded-t-lg w-full min-h-40" />
      <div className="flex flex-col justify-between h-full p-4">
        <div>
          <h3 className="text-lg font-bold mb-1">{venue.name}</h3>
          <p className="text-(--text-secondary) line-clamp-3">{venue.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold">${venue.price.toFixed(2)}</span>
          <Link
            key={venue.id}
            href={`/venue/${venue.id}`}
            className="border border-(--border) text-(--text-secondary) border-solid rounded-lg px-3 py-2 hover:bg-(--surface-dark) transition-colors duration-200"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
