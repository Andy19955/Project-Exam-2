"use client";

import { Venue } from "@/types/venue";
import VenueCard from "@/components/venues/VenueCard";
import { useState } from "react";
import CreateNewVenueForm from "./CreateNewVenueForm";

export default function ProfileVenues({ venues }: { venues?: Venue[] }) {
  const [showCreateVenueModal, setShowCreateVenueModal] = useState(false);
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-bold text-(--text-primary)">Your Venues</h2>
          <button
            className="flex items-center gap-2 w-fit cursor-pointer rounded-full border border-(--border) bg-(--surface) px-4 py-2 text-sm font-semibold text-(--text-primary) shadow-sm transition-colors hover:bg-(--surface-dark)/50"
            onClick={() => setShowCreateVenueModal(true)}
          >
            <i className="fa-solid fa-plus" />
            Create New Venue
          </button>
        </div>
        {venues?.length === 0 && <p className="text-(--text-secondary)">You have no venues.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues?.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>
      {showCreateVenueModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={() => setShowCreateVenueModal(false)}>
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-(--text-primary)">Create Venue</h2>
                <p className="text-(--text-secondary)">Fill in the details to create a new venue.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateVenueModal(false)}
                className="rounded-full p-2 text-(--text-secondary) transition cursor-pointer hover:bg-black/5 hover:text-(--text-primary)"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <CreateNewVenueForm onCancel={() => setShowCreateVenueModal(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
