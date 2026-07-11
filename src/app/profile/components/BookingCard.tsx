"use client";

import { Booking } from "@/types/booking";
import Link from "next/link";
import { useState } from "react";
import { cancelBooking } from "@/api/bookings/cancelBooking";
import MediaImage from "../../../components/MediaImage";

export default function BookingCard({ booking, onBookingCancelled }: { booking: Booking; onBookingCancelled?: () => Promise<void> | void }) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const locationText =
    booking.venue?.location.city && booking.venue?.location.country
      ? `${booking.venue?.location.city}, ${booking.venue?.location.country}`
      : booking.venue?.location.city || booking.venue?.location.country || "Location not available";

  async function handleConfirmCancellation() {
    setShowCancelModal(false);
    try {
      await cancelBooking(booking.id);
      await onBookingCancelled?.();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  }

  return (
    <>
      <article className="flex flex-col shadow-md rounded-lg border border-(--border) bg-(--surface)">
        <MediaImage
          src={booking.venue?.media?.[0]?.url || "/images/venue-placeholder.svg"}
          alt={booking.venue?.media?.[0]?.alt || booking.venue?.name || "Venue image"}
          width={340}
          height={192}
          className="object-cover rounded-t-lg min-h-48 w-full h-48"
        />
        <div className="flex flex-col justify-between h-full p-4">
          <h3 className="text-lg font-bold mb-1">{booking.venue?.name}</h3>
          <div className="flex flex-col gap-1">
            <p>
              <strong>Check in:</strong>&nbsp;{new Date(booking.dateFrom).toLocaleDateString()}
            </p>
            <p>
              <strong>Check out:</strong>&nbsp;{new Date(booking.dateTo).toLocaleDateString()}
            </p>
            <p>
              <strong>Guests:</strong>&nbsp;{booking.guests}
            </p>
            <p className="text-sm text-(--text-secondary)">
              <i className="fas fa-map-marker-alt mr-1"></i>
              {locationText}
            </p>
            <div className="flex gap-1 flex-wrap items-center">
              <Link
                href={`/venue/${booking.venue?.id}`}
                className="flex-1 text-nowrap border border-(--secondary) hover:border-(--secondary-hover) text-(--secondary) hover:text-white mt-3 font-semibold border-solid text-center rounded-lg px-3 py-1 hover:bg-(--secondary-hover) transition-colors duration-200"
              >
                View Venue
              </Link>
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 text-nowrap cursor-pointer border border-(--error) hover:border-(--error-hover) text-(--error) hover:text-white mt-3 font-semibold border-solid text-center rounded-lg px-3 py-1 hover:bg-(--error-hover) transition-colors duration-200"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </article>
      {showCancelModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Confirm cancellation</h2>
                <p>Are you sure you want to cancel this booking?</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-full p-2 text-(--text-secondary) transition cursor-pointer hover:bg-black/5 hover:text-(--text-primary)"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-2xl border border-(--border) px-4 py-3 font-semibold text-white bg-(--primary) hover:bg-(--primary-hover) transition-all cursor-pointer"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="flex-1 rounded-2xl border border-(--error) bg-(--error) px-4 py-3 font-semibold text-white transition hover:bg-(--error-hover) cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
