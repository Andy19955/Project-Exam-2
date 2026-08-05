"use client";
import { Booking } from "@/types/booking";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import LoginForm from "@/app/login/LoginForm";
import { createBooking } from "@/api/bookings/createBooking";
import { BookingFormProps } from "@/types/bookingFormProps";

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

function toBookingDateString(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
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

export default function BookingForm({ maxGuests, price, bookings, venueId }: BookingFormProps) {
  const [dateRange, setDateRange] = useState<DateValue>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [selectionError, setSelectionError] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings ?? []);
  const [calendarKey, setCalendarKey] = useState(0);

  const nights = getNights(dateRange);
  const checkIn = Array.isArray(dateRange) ? dateRange[0] : null;
  const checkOut = Array.isArray(dateRange) ? dateRange[1] : null;
  const hasCompleteRange = Boolean(checkIn && checkOut);

  const overlapsBookedRange = Boolean(
    hasCompleteRange &&
    Array.isArray(dateRange) &&
    localBookings.some((booking) => {
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

  const isAuthenticated = useAuthStore((state) => state.user !== null);

  const disableBookedDates = ({ date, view }: { date: Date; view: string }) => view === "month" && isBookedDay(date, localBookings);

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
    const rangeOverlapsBooking = localBookings.some((booking) => {
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

  async function handleBooking() {
    if (!checkIn || !checkOut) {
      return;
    }

    const bookingData = {
      dateFrom: toBookingDateString(checkIn),
      dateTo: toBookingDateString(checkOut),
      guests: guestCount,
      venueId: venueId,
    };

    return createBooking(bookingData);
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingSuccess("");
    setBookingError("");

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!isValidStay) {
      return;
    }

    setIsBooking(true);

    try {
      const result = await handleBooking();
      if (result?.data) {
        setLocalBookings((currentBookings) => [...currentBookings, result.data as Booking]);
      }
      setBookingSuccess("Booking confirmed. Your stay has been reserved.");
      setDateRange(null);
      setGuestCount(1);
      setCalendarKey((currentKey) => currentKey + 1);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4 px-4 py-6" onSubmit={handleSubmit}>
        {bookingSuccess ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{bookingSuccess}</p> : null}
        {bookingError ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{bookingError}</p> : null}
        <Calendar key={calendarKey} onChange={handleDateChange} value={dateRange} selectRange={true} minDate={new Date()} tileDisabled={disableBookedDates} className="min-w-full rounded-lg" />
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
        <button
          type="submit"
          disabled={!isValidStay || isBooking}
          className="w-full rounded-2xl bg-(--background-dark) cursor-pointer p-4 text-sm font-semibold text-white transition hover:bg-(--background-dark-soft) disabled:cursor-not-allowed disabled:bg-(--background-dark-soft) disabled:opacity-60"
        >
          {isBooking ? "Booking..." : isAuthenticated ? "Book now" : "Log in to book"}
        </button>
      </form>
      {showLoginModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-(--text-primary)">Log in to book</h2>
                <p className="text-sm text-(--text-secondary)">Sign in to continue with your booking.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="rounded-full p-2 text-(--text-secondary) transition cursor-pointer hover:bg-black/5 hover:text-(--text-primary)"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <LoginForm source="booking" onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
