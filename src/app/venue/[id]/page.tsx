import Image from "next/image";
import Link from "next/link";
import BookingForm from "@/app/venue/[id]/BookingForm";

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

const amenities = {
  wifi: {
    icon: "fa fa-wifi",
    label: "Wi-Fi",
  },
  parking: {
    icon: "fa fa-car",
    label: "Parking",
  },
  breakfast: {
    icon: "fa fa-coffee",
    label: "Breakfast",
  },
  pets: {
    icon: "fa fa-paw",
    label: "Pets allowed",
  },
};

export default function VenuePage() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <Link
          href="/venues/"
          className="flex items-center gap-2 rounded-full w-fit border border-(--border-dark) bg-(--surface) px-4 py-2 text-sm font-semibold text-(--text-primary) shadow-sm transition hover:bg-(--surface-dark)"
        >
          <i className="fa fa-arrow-left"></i>Go back to all venues
        </Link>
        <div className="flex flex-col gap-4 rounded-4xl border border-white/70 bg-white/75 px-6 py-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-(--text-primary)">
            <span>
              {demoData.location.city}, {demoData.location.country}
            </span>
            <span>|</span>
            <span>{demoData.rating} guest rating</span>
            <span>|</span>
            <span>Up to {demoData.maxGuests} guests</span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight text-(--text-primary) sm:text-5xl">{demoData.name}</h1>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-6">
            <section className="rounded-4xl border border-(--border) bg-white shadow-lg">
              <div className="relative aspect-16/10 w-full rounded-4xl">
                <Image src={demoData.media[0].url} alt={demoData.media[0].alt} fill className="object-cover rounded-4xl" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-(--text-primary) shadow-sm">From ${demoData.price} / night</span>
                  <span className="rounded-full bg-(--background-dark)/70 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">{demoData.rating} rating</span>
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-6 rounded-4xl border border-(--border) bg-white/85 p-6 shadow-lg sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-(--text-secondary)">What this place offers</h2>
                  <p className="max-w-3xl text-(--text-primary) sm:text-lg">{demoData.description}</p>
                </div>
                <div className="rounded-2xl bg-(--background-dark) px-4 py-3 text-sm font-medium text-white shadow-md">
                  <i className="fa fa-map-marker mr-2"></i>
                  {demoData.location.continent}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 rounded-3xl bg-(--background-soft) p-5 text-sm text-(--text-primary)">
                <div className="flex flex-col gap-3">
                  <p className="font-semibold text-(--text-primary)">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(demoData.meta).map(([key, value]) =>
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
                <div className="flex flex-col gap-3">
                  <p className="font-semibold text-(--text-primary)">Location</p>
                  <p>
                    {demoData.location.address}, {demoData.location.city}, {demoData.location.zip}, {demoData.location.country}
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
                <Image src={demoData.owner.avatar.url} alt={demoData.owner.name} width={96} height={96} className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white/10" />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-xl font-semibold">{demoData.owner.name}</h3>
                    <p className="text-sm text-(--text-light)">{demoData.owner.email}</p>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-(--text-light)">{demoData.owner.bio}</p>
                </div>
              </div>
            </section>
          </div>
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-4xl bg-white shadow-lg">
              <div className="flex flex-col gap-3 bg-(--background-dark) px-6 py-6 text-white rounded-t-4xl">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-(--text-light)">Booking</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-semibold">${demoData.price}</span>
                  <span className="pb-1 text-sm text-(--text-light)">per night</span>
                </div>
                <p className="text-sm leading-6 text-(--text-light)">Book your stay with a clean, fast checkout flow and instant reservation details.</p>
              </div>
              <BookingForm />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
