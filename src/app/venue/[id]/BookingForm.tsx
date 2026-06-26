"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type DateValuePiece = Date | null;
type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

export default function BookingForm({ maxGuests }: { maxGuests: number }) {
  const [dateRange, setDateRange] = useState<DateValue>(null);

  return (
    <form className="flex flex-col gap-4 px-4 py-6">
      <Calendar onChange={setDateRange} value={dateRange} selectRange={true} minDate={new Date()} className="min-w-full rounded-lg" />
      <label className="flex flex-col gap-2 text-sm font-medium text-(--text-primary)">
        <span>Guests</span>
        <select className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white">
          {Array.from({ length: maxGuests }, (_, index) => index + 1).map((guestCount) => (
            <option key={guestCount} value={guestCount}>
              {guestCount} guest{guestCount > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-(--text-primary)">
        <span>Special request</span>
        <textarea
          rows={4}
          placeholder="Tell the owner about your arrival time or preferences"
          className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition placeholder:text-(--text-muted) focus:border-(--border-dark) focus:bg-white"
        />
      </label>
      <button type="submit" className="w-full rounded-2xl bg-(--background-dark) cursor-pointer p-4 text-sm font-semibold text-white transition hover:bg-(--background-dark-soft)">
        Book now
      </button>
    </form>
  );
}
