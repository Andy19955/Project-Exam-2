"use client";

import { useState } from "react";
import { Venue } from "@/types/venue";
import { FetchVenuesProps } from "@/types/fetchVenuesProps";
import VenueCard from "@/components/venues/VenueCard";
import CardSkeleton from "@/components/CardSkeleton";
import { useAuthStore } from "@/store/authStore";

function compareVenueValues(a: Venue, b: Venue, sort: string, sortOrder: "asc" | "desc") {
  const multiplier = sortOrder === "asc" ? 1 : -1;

  if (sort === "name") {
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) * multiplier;
  }

  if (sort === "created" || sort === "updated") {
    return (new Date(a[sort]).getTime() - new Date(b[sort]).getTime()) * multiplier;
  }

  if (sort === "price" || sort === "rating" || sort === "maxGuests") {
    return (a[sort] - b[sort]) * multiplier;
  }

  if (sort === "meta.wifi" || sort === "meta.parking" || sort === "meta.breakfast" || sort === "meta.pets") {
    const metaKey = sort.split(".")[1] as keyof Venue["meta"];
    const availabilityDifference = Number(a.meta[metaKey]) - Number(b.meta[metaKey]);

    return availabilityDifference !== 0 ? availabilityDifference * multiplier : a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) * multiplier;
  }

  return (new Date(a.created).getTime() - new Date(b.created).getTime()) * multiplier;
}

export default function DisplayVenues({
  showGrid = true,
  limit,
  enableLoadMore = false,
  query = "",
  sort = "created",
  sortOrder = "desc",
  venues = [],
  loading = false,
  error = null,
}: FetchVenuesProps) {
  const initialVisibleCount = typeof limit === "number" ? limit : 20;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  if (error) return <div>Error: {error.message}</div>;

  const normalizedQuery = query.trim().toLowerCase();
  const searchedVenues = normalizedQuery
    ? venues.filter((venue) => {
        return [venue.name, venue.description, venue.location.city, venue.location.country, venue.location.continent].some((value) => value?.toLowerCase().includes(normalizedQuery));
      })
    : venues;
  const sortedVenues = [...searchedVenues].sort((a, b) => compareVenueValues(a, b, sort, sortOrder));
  const visibleVenues = sortedVenues.slice(0, visibleCount);
  const canLoadMore = enableLoadMore && visibleCount < sortedVenues.length;

  return (
    <>
      {showGrid ? (
        loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: Math.min(initialVisibleCount, 12) }).map((_, index) => (
              <CardSkeleton key={`skel-${index}`} />
            ))}
          </div>
        ) : visibleVenues.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} isOwner={hydrated && user?.name === venue.owner?.name} />
              ))}
            </div>
            {canLoadMore ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((currentCount) => currentCount + 20)}
                  className="rounded-full border border-(--border-dark) bg-white px-6 py-3 cursor-pointer text-sm font-semibold text-(--text-primary) shadow-sm transition hover:bg-(--surface-dark)"
                >
                  Load More Venues
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-center text-(--text-primary)">No venues found.</p>
        )
      ) : null}
    </>
  );
}
