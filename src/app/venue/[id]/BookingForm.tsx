"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type DateValuePiece = Date | null;
type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

const demoData = {
  id: "1",
  name: "Demo Venue",
  description: "This is a demo venue for testing purposes.",
  media: [
    {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Demo Venue Image",
    },
  ],
  price: 100,
  maxGuests: 5,
  rating: 4.5,
  created: "20.06.2026",
  updated: "24.06.2026",
  meta: {
    wifi: true,
    parking: true,
    breakfast: false,
    pets: true,
  },
  owner: {
    name: "Demo Owner",
    email: "demo@example.com",
    bio: "Ava curates bright, design-led stays with a calm Scandinavian feel and quick, thoughtful communication.",
    avatar: {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Demo image",
    },
  },
  location: {
    address: "123 Demo Street",
    city: "Demo City",
    zip: "12345",
    country: "Demo Country",
    continent: "Demo Continent",
    lat: 12.345678,
    long: 98.7654321,
  },
};

export default function BookingForm() {
  const [dateRange, setDateRange] = useState<DateValue>(null);

  return (
    <form className="flex flex-col gap-4 px-4 py-6">
      <Calendar onChange={setDateRange} value={dateRange} selectRange={true} minDate={new Date()} className="min-w-full rounded-lg" />
      <label className="flex flex-col gap-2 text-sm font-medium text-(--text-primary)">
        <span>Guests</span>
        <select className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white">
          {Array.from({ length: demoData.maxGuests }, (_, index) => index + 1).map((guestCount) => (
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
