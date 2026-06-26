"use client";
import { Booking } from "@/types/booking";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type DateValuePiece = Date | null;
type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

function parseBookingDate(dateString: string) {
  const [datePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

function isBookedDay(date: Date, bookings: Booking[]) {
  const day = startOfDay(date).getTime();
  const today = startOfDay(new Date()).getTime();

  return bookings.some((booking) => {
    const bookingStart = parseBookingDate(booking.dateFrom).getTime();
    const bookingEnd = parseBookingDate(booking.dateTo).getTime();

    if (bookingEnd <= today) return false;

    return day >= Math.max(bookingStart, today) && day < bookingEnd;
  });
}

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

export default function BookingForm({ maxGuests, price, bookings }: { maxGuests: number; price: number; bookings: Booking[] }) {
  const [dateRange, setDateRange] = useState<DateValue>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [selectionError, setSelectionError] = useState(false);

  const nights = getNights(dateRange);
  const checkIn = Array.isArray(dateRange) ? dateRange[0] : null;
  const checkOut = Array.isArray(dateRange) ? dateRange[1] : null;
  const hasCompleteRange = Boolean(checkIn && checkOut);

  const overlapsBookedRange = Boolean(
    hasCompleteRange &&
    Array.isArray(dateRange) &&
    bookings.some((booking) => {
      const rangeStart = startOfDay(checkIn as Date).getTime();
      const rangeEnd = startOfDay(checkOut as Date).getTime();
      const bookingStart = Math.max(startOfDay(parseBookingDate(booking.dateFrom)).getTime(), startOfDay(new Date()).getTime());
      const bookingEnd = startOfDay(parseBookingDate(booking.dateTo)).getTime();

      if (bookingEnd <= startOfDay(new Date()).getTime()) return false;

      return rangeStart < bookingEnd && rangeEnd > bookingStart;
    }),
  );

  const isValidStay = nights >= 1 && !overlapsBookedRange;
  const total = isValidStay ? price * nights * guestCount : 0;

  const disableBookedDates = ({ date, view }: { date: Date; view: string }) => view === "month" && isBookedDay(date, bookings);

  const handleDateChange = (value: DateValue) => {
    if (!Array.isArray(value)) {
      setDateRange(value);
      setSelectionError(false);
      return;
    }

    const [nextCheckIn, nextCheckOut] = value;

    if (!nextCheckIn || !nextCheckOut) {
      setDateRange(value);
      setSelectionError(false);
      return;
    }

    const rangeStart = startOfDay(nextCheckIn).getTime();
    const rangeEnd = startOfDay(nextCheckOut).getTime();
    const rangeOverlapsBooking = bookings.some((booking) => {
      const bookingStart = Math.max(startOfDay(parseBookingDate(booking.dateFrom)).getTime(), startOfDay(new Date()).getTime());
      const bookingEnd = startOfDay(parseBookingDate(booking.dateTo)).getTime();

      if (bookingEnd <= startOfDay(new Date()).getTime()) return false;

      return rangeStart < bookingEnd && rangeEnd > bookingStart;
    });

    if (rangeOverlapsBooking || rangeEnd <= rangeStart) {
      setDateRange(nextCheckIn);
      setSelectionError(true);
      return;
    }

    setDateRange(value);
    setSelectionError(false);
  };

  return (
    <form className="flex flex-col gap-4 px-4 py-6">
      <Calendar onChange={handleDateChange} value={dateRange} selectRange={true} minDate={new Date()} tileDisabled={disableBookedDates} className="min-w-full rounded-lg" />
      {selectionError ? <p className="text-sm font-medium text-amber-700">A booking must stay within an available date range. Choose dates that do not cross an occupied period.</p> : null}
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
