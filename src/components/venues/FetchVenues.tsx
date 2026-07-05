"use client";

import { useState, useEffect } from "react";
import { Venue } from "@/types/venue";
import { FetchVenuesProps } from "@/types/fetchVenuesProps";
import VenueCard from "@/components/venues/VenueCard";
import CardSkeleton from "@/components/CardSkeleton";
import { venuesUrl } from "@/constants/apiUrls";

export default function FetchVenues({ showGrid = true, limit, enableLoadMore = false }: FetchVenuesProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initialVisibleCount = typeof limit === "number" ? limit : 20;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(venuesUrl);
        const data = await response.json();

        setVenues(data.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (error) return <div>Error: {error.message}</div>;

  const visibleVenues = venues.slice(0, visibleCount);
  const canLoadMore = enableLoadMore && visibleCount < venues.length;

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
                <VenueCard key={venue.id} venue={venue} />
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
