"use client";

import { useEffect, useState } from "react";
import Hero from "./Hero";
import Venues from "./Venues";
import { fetchVenues } from "@/api/venues/fetchVenues";
import { Venue } from "@/types/venue";
import { SearchState } from "@/types/searchState";

const defaultSearchState: SearchState = {
  query: "",
  sort: "created",
  sortOrder: "asc",
};

export default function VenueBrowser() {
  const [searchState, setSearchState] = useState<SearchState>(defaultSearchState);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const loadVenues = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchVenues();
        if (active) {
          setVenues(result.data);
        }
      } catch (error) {
        if (active) {
          setError(error as Error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadVenues();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero query={searchState.query} sort={searchState.sort} sortOrder={searchState.sortOrder} onSearch={setSearchState} onReset={() => setSearchState(defaultSearchState)} />
      <Venues query={searchState.query} sort={searchState.sort} sortOrder={searchState.sortOrder} venues={venues} loading={loading} error={error} />
    </>
  );
}
