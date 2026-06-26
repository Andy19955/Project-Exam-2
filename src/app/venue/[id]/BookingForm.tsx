"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type DateValuePiece = Date | null;
type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

function formatDate(date: Date | null) {
  if (!date) return "Not selected";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getNights(dateRange: DateValue) {
  if (!Array.isArray(dateRange)) return 0;

  const [checkIn, checkOut] = dateRange;
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function BookingForm({ maxGuests, price }: { maxGuests: number; price: number }) {
  const [dateRange, setDateRange] = useState<DateValue>(null);
  const [guestCount, setGuestCount] = useState(1);

  const nights = getNights(dateRange);
  const isValidStay = nights >= 1;
  const total = isValidStay ? price * nights * guestCount : 0;
  const checkIn = Array.isArray(dateRange) ? dateRange[0] : null;
  const checkOut = Array.isArray(dateRange) ? dateRange[1] : null;
  const hasCompleteRange = Boolean(checkIn && checkOut);

  return (
    <form className="flex flex-col gap-4 px-4 py-6">
      <Calendar onChange={setDateRange} value={dateRange} selectRange={true} minDate={new Date()} className="min-w-full rounded-lg" />
      {hasCompleteRange && !isValidStay ? <p className="text-sm font-medium text-amber-700">A booking must span at least one night. Choose a checkout date after the check-in date.</p> : null}
      <div className="grid gap-3 rounded-3xl border border-(--border) bg-(--surface-dark) p-4 text-sm text-(--text-primary)">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-(--text-secondary)">Check-in</span>
          <span className="text-right font-semibold">{formatDate(checkIn)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-(--text-secondary)">Check-out</span>
          <span className="text-right font-semibold">{formatDate(checkOut)}</span>
        </div>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-(--text-primary)">
        <span>Guests</span>
        <select
          value={guestCount}
          onChange={(event) => setGuestCount(Number(event.target.value))}
          className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white"
        >
          {Array.from({ length: maxGuests }, (_, index) => index + 1).map((guestCount) => (
            <option key={guestCount} value={guestCount}>
              {guestCount} guest{guestCount > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-col gap-3 rounded-3xl border border-(--border-dark) bg-(--background-dark) px-4 py-4 text-white shadow-sm">
        <div className="flex items-center justify-between gap-4 text-sm text-(--text-light)">
          <span>{isValidStay ? `${nights} night${nights > 1 ? "s" : ""}` : "Select two different dates"}</span>
          <span>
            {guestCount} guest{guestCount > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm text-(--text-light)">Estimated total</span>
          <span className="text-3xl font-semibold">{isValidStay ? `$${total.toLocaleString("en-US")}` : "--"}</span>
        </div>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-(--text-primary)">
        <span>Special request</span>
        <textarea
          rows={4}
          placeholder="Tell the owner about your arrival time or preferences"
          className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition placeholder:text-(--text-muted) focus:border-(--border-dark) focus:bg-white"
        />
      </label>
      <button
        type="submit"
        disabled={!isValidStay}
        className="w-full rounded-2xl bg-(--background-dark) cursor-pointer p-4 text-sm font-semibold text-white transition hover:bg-(--background-dark-soft) disabled:cursor-not-allowed disabled:bg-(--background-dark-soft) disabled:opacity-60"
      >
        Book now
      </button>
    </form>
  );
}
