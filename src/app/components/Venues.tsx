"use client";

import DisplayVenues from "@/components/venues/DisplayVenues";
import { FetchVenuesProps } from "@/types/fetchVenuesProps";

export default function Venues({ query, sort, sortOrder, venues, loading, error }: FetchVenuesProps) {
  const venueKey = `${query ?? ""}-${sort ?? ""}-${sortOrder ?? ""}`;

  return (
    <section className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between my-5">
        <h2 className="text-2xl font-bold">Venues</h2>
      </div>
      <DisplayVenues key={venueKey} limit={20} enableLoadMore={true} query={query} sort={sort} sortOrder={sortOrder} venues={venues} loading={loading} error={error} />
    </section>
  );
}
