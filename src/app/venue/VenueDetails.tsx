"use client";

import { useEffect, useState } from "react";
import { Venue } from "@/types/venue";
import { amenities } from "@/constants/amenities";
import Image from "next/image";
import BookingForm from "@/app/venue/[id]/BookingForm";

export default function VenueDetails({ id }: { id: string }) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSingleVenue = async () => {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true`);
        const result = await response.json();
        if (!response.ok || result?.errors || !result?.data) {
          setNotFound(true);
          setVenue(null);
          return;
        }

        setVenue(result.data);
      } catch (error) {
        setNotFound(true);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleVenue();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (notFound || !venue) return <div>Venue not found</div>;

  const locationText = venue.location.city && venue.location.country ? `${venue.location.city}, ${venue.location.country}` : venue.location.city || venue.location.country || "Location not available";

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4 rounded-4xl border border-white/70 bg-white/75 px-6 py-6 shadow-lg">
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-(--text-primary)">
          <span>{locationText}</span>
          <span>|</span>
          <span>{venue.rating} guest rating</span>
          <span>|</span>
          <span>Up to {venue.maxGuests} guests</span>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-(--text-primary) sm:text-5xl">{venue.name}</h1>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-6 w-full">
          <section className="rounded-4xl border border-(--border) bg-white shadow-lg">
            <div className="relative aspect-16/10 w-full rounded-4xl">
              <Image src={venue.media?.[0]?.url ?? "/placeholder.jpg"} alt={venue.media?.[0]?.alt ?? "Venue image"} fill className="object-cover rounded-4xl" />
              <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-(--text-primary) shadow-sm">From ${venue.price} / night</span>
                <span className="rounded-full bg-(--background-dark)/70 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">{venue.rating} rating</span>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-6 rounded-4xl border border-(--border) bg-white/85 p-6 shadow-lg sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--text-secondary)">What this place offers</h2>
                <p className="max-w-3xl text-(--text-primary) sm:text-lg">{venue.description}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 rounded-3xl bg-(--background-soft) p-5 text-sm text-(--text-primary)">
              <div className="flex-1 flex flex-col gap-3">
                <p className="font-semibold text-(--text-primary)">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(venue.meta || {}).map(([key, value]) =>
                    value
                      ? (() => {
                          const amenity = amenities[key as keyof typeof amenities];
                          return (
                            <span key={key} className="rounded-full bg-white px-3 py-1 font-medium text-slate-700 shadow-sm">
                              <i className={amenity.icon + " mr-2"}></i>
                              {amenity.label}
                            </span>
                          );
                        })()
                      : null,
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <p className="font-semibold text-(--text-primary)">Location</p>
                <p>
                  <i className="fa fa-map-marker mr-2"></i>
                  {locationText}
                </p>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-6 rounded-4xl border border-(--border) bg-white/85 p-6 shadow-lg sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--text-secondary)">Hosted by</p>
                <h2 className="text-2xl font-semibold text-(--text-primary)">Meet your host</h2>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 rounded-3xl bg-linear-to-br from-(--background-dark) to-(--background-dark-soft) p-5 text-white shadow-lg sm:items-center">
              <Image
                src={venue.owner?.avatar?.url ?? "/placeholder.jpg"}
                alt={venue.owner?.name ?? "Host avatar"}
                width={96}
                height={96}
                className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white/10"
              />
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xl font-semibold">{venue.owner?.name}</h3>
                  <p className="text-sm text-(--text-light)">{venue.owner?.email}</p>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-(--text-light)">{venue.owner?.bio}</p>
              </div>
            </div>
          </section>
        </div>
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-4xl bg-white shadow-lg">
            <div className="flex flex-col gap-3 bg-(--background-dark) px-6 py-6 text-white rounded-t-4xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-(--text-light)">Booking</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-semibold">${venue.price}</span>
                <span className="pb-1 text-sm text-(--text-light)">per night</span>
              </div>
              <p className="text-sm leading-6 text-(--text-light)">Book your stay with a clean, fast checkout flow and instant reservation details.</p>
            </div>
            <BookingForm maxGuests={venue.maxGuests} />
          </div>
        </aside>
      </div>
    </div>
  );
}
