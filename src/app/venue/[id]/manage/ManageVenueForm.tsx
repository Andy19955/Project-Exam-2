"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { amenities } from "@/constants/amenities";
import { useAuthStore } from "@/store/authStore";
import { Venue } from "@/types/venue";
import { createVenueFormSchema, type CreateVenueData } from "@/schemas/createVenueFormSchema";
import { fetchVenue } from "@/api/venues/fetchVenue";
import { updateVenue } from "@/api/venues/updateVenue";
import { deleteVenue } from "../../../../api/venues/deleteVenue";

type FieldErrors = Partial<Record<keyof CreateVenueData, string>>;

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function getInitialFormData(venue: Venue) {
  return {
    name: venue.name ?? "",
    description: venue.description ?? "",
    imageUrl: venue.media?.[0]?.url ?? "https://placehold.co/1200x800?text=Venue",
    imageAlt: venue.media?.[0]?.alt ?? `${venue.name} image`,
    price: venue.price ?? 0,
    maxGuests: venue.maxGuests ?? 1,
    wifi: venue.meta?.wifi ?? false,
    parking: venue.meta?.parking ?? false,
    breakfast: venue.meta?.breakfast ?? false,
    pets: venue.meta?.pets ?? false,
    address: venue.location?.address ?? "",
    city: venue.location?.city ?? "",
    zip: venue.location?.zip ?? "",
    country: venue.location?.country ?? "",
    continent: venue.location?.continent ?? "",
    lat: venue.location?.lat ?? 0,
    lng: venue.location?.lng ?? 0,
  };
}

export default function ManageVenueClient({ id }: { id: string }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<CreateVenueData | null>(null);

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const result = await fetchVenue(id);
        if (!result?.data) {
          setNotFound(true);
          return;
        }

        setVenue(result.data);
        setFormData(getInitialFormData(result.data));
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [id]);

  if (loading) {
    return <div>Loading venue...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (notFound || !venue || !formData) {
    return <div>Venue not found</div>;
  }

  const isOwner = user?.name === venue.owner?.name;

  if (hydrated && !isOwner) {
    return (
      <div className="flex flex-col gap-4 rounded-4xl border border-(--border) bg-white/85 p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-(--text-primary)">Manage Venue</h1>
        <p className="max-w-2xl text-(--text-secondary)">You can only edit venues you own.</p>
        <Link href="/profile" className="w-fit rounded-full border border-(--secondary) px-4 py-2 font-semibold text-(--secondary) transition hover:bg-(--secondary) hover:text-white">
          Go to your profile
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setFieldErrors({});
    setFormError("");
    setSuccessMessage("");

    const validationResult = createVenueFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const flattenedErrors = z.flattenError(validationResult.error);
      setFieldErrors({
        name: flattenedErrors.fieldErrors.name?.[0],
        description: flattenedErrors.fieldErrors.description?.[0],
        imageUrl: flattenedErrors.fieldErrors.imageUrl?.[0],
        imageAlt: flattenedErrors.fieldErrors.imageAlt?.[0],
        price: flattenedErrors.fieldErrors.price?.[0],
        maxGuests: flattenedErrors.fieldErrors.maxGuests?.[0],
        wifi: flattenedErrors.fieldErrors.wifi?.[0],
        parking: flattenedErrors.fieldErrors.parking?.[0],
        breakfast: flattenedErrors.fieldErrors.breakfast?.[0],
        pets: flattenedErrors.fieldErrors.pets?.[0],
        address: flattenedErrors.fieldErrors.address?.[0],
        city: flattenedErrors.fieldErrors.city?.[0],
        zip: flattenedErrors.fieldErrors.zip?.[0],
        country: flattenedErrors.fieldErrors.country?.[0],
        continent: flattenedErrors.fieldErrors.continent?.[0],
        lat: flattenedErrors.fieldErrors.lat?.[0],
        lng: flattenedErrors.fieldErrors.lng?.[0],
      });

      return;
    }

    const venueData = {
      name: validationResult.data.name,
      description: validationResult.data.description,
      media: [
        {
          url: validationResult.data.imageUrl,
          alt: validationResult.data.imageAlt || "Venue image",
        },
      ],
      price: validationResult.data.price,
      maxGuests: validationResult.data.maxGuests,
      meta: {
        wifi: validationResult.data.wifi || false,
        parking: validationResult.data.parking || false,
        breakfast: validationResult.data.breakfast || false,
        pets: validationResult.data.pets || false,
      },
      location: {
        address: validationResult.data.address || "",
        city: validationResult.data.city || "",
        zip: validationResult.data.zip || "",
        country: validationResult.data.country || "",
        continent: validationResult.data.continent || "",
        lat: validationResult.data.lat || 0,
        lng: validationResult.data.lng || 0,
      },
    };

    setIsSubmitting(true);

    try {
      const result = await updateVenue(id, venueData);
      if (result?.data) {
        setVenue((currentVenue) => {
          if (!currentVenue) return result.data;

          const updatedVenue = {
            ...currentVenue,
            ...result.data,
            owner: currentVenue.owner,
            bookings: currentVenue.bookings,
          };

          setFormData(getInitialFormData(updatedVenue));
          return updatedVenue;
        });
      }
      setSuccessMessage("Venue updated successfully.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to update venue");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteVenue() {
    setIsDeleting(true);
    setFormError("");

    try {
      await deleteVenue(id);
      router.push("/profile");
      router.refresh();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to delete venue");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  }

  const locationText = venue.location.city && venue.location.country ? `${venue.location.city}, ${venue.location.country}` : venue.location.city || venue.location.country || "Location not available";
  const bookings = venue.bookings ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-4xl border border-(--border) bg-white/85 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase text-(--text-secondary)">Manage venue</p>
          <h1 className="text-3xl font-semibold text-(--text-primary) sm:text-4xl">{venue.name}</h1>
          <p className="max-w-3xl text-(--text-secondary)">{locationText}</p>
        </div>
        <Link href={`/venue/${venue.id}`} className="w-fit rounded-full border border-(--border) px-4 py-2 font-semibold text-(--text-primary) transition hover:bg-(--surface-dark)">
          View public page
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-6 w-full">
          <section className="flex flex-col gap-6 rounded-4xl border border-(--border) bg-white/85 p-6 shadow-lg sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-(--text-primary)">Edit venue</h2>
                <p className="text-(--text-secondary)">Update the venue details shown to guests.</p>
              </div>
            </div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                <span>Venue Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.name ? "border-(--error) focus:border-(--error)" : ""}`}
                />
                {fieldErrors.name ? <p className="text-sm text-(--error)">{fieldErrors.name}</p> : null}
              </label>
              <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                <span>Description</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  rows={6}
                  className={`w-full resize-y rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.description ? "border-(--error) focus:border-(--error)" : ""}`}
                />
                {fieldErrors.description ? <p className="text-sm text-(--error)">{fieldErrors.description}</p> : null}
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                  <span>Image URL</span>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })}
                    className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.imageUrl ? "border-(--error) focus:border-(--error)" : ""}`}
                  />
                  {fieldErrors.imageUrl ? <p className="text-sm text-(--error)">{fieldErrors.imageUrl}</p> : null}
                </label>
                <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                  <span>Image alt text</span>
                  <input
                    type="text"
                    name="imageAlt"
                    value={formData.imageAlt}
                    onChange={(event) => setFormData({ ...formData, imageAlt: event.target.value })}
                    className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.imageAlt ? "border-(--error) focus:border-(--error)" : ""}`}
                  />
                  {fieldErrors.imageAlt ? <p className="text-sm text-(--error)">{fieldErrors.imageAlt}</p> : null}
                </label>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                  <span>Price</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(event) => setFormData({ ...formData, price: Number(event.target.value) })}
                    className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.price ? "border-(--error) focus:border-(--error)" : ""}`}
                  />
                  {fieldErrors.price ? <p className="text-sm text-(--error)">{fieldErrors.price}</p> : null}
                </label>
                <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                  <span>Max guests</span>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={(event) => setFormData({ ...formData, maxGuests: Number(event.target.value) })}
                    className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.maxGuests ? "border-(--error) focus:border-(--error)" : ""}`}
                  />
                  {fieldErrors.maxGuests ? <p className="text-sm text-(--error)">{fieldErrors.maxGuests}</p> : null}
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-(--text-primary)">Amenities</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(Object.keys(amenities) as Array<keyof typeof amenities>).map((key) => (
                    <label key={key} className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-sm font-medium text-(--text-primary)">
                      <input type="checkbox" checked={Boolean(formData[key])} onChange={(event) => setFormData({ ...formData, [key]: event.target.checked })} className="h-4 w-4" />
                      <span>
                        <i className={`${amenities[key].icon} mr-2`} />
                        {amenities[key].label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-(--text-primary)">Location information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                    <span>Address</span>
                    <input
                      type="text"
                      value={formData.address || ""}
                      onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                      className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                    <span>City</span>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                      className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                    <span>Zip code</span>
                    <input
                      type="text"
                      value={formData.zip || ""}
                      onChange={(event) => setFormData({ ...formData, zip: event.target.value })}
                      className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                    <span>Country</span>
                    <input
                      type="text"
                      value={formData.country || ""}
                      onChange={(event) => setFormData({ ...formData, country: event.target.value })}
                      className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                    <span>Continent</span>
                    <input
                      type="text"
                      value={formData.continent || ""}
                      onChange={(event) => setFormData({ ...formData, continent: event.target.value })}
                      className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                    <span>Latitude</span>
                    <input
                      type="number"
                      value={formData.lat ?? 0}
                      onChange={(event) => setFormData({ ...formData, lat: Number(event.target.value) })}
                      className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
                    <span>Longitude</span>
                    <input
                      type="number"
                      value={formData.lng ?? 0}
                      onChange={(event) => setFormData({ ...formData, lng: Number(event.target.value) })}
                      className="w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white"
                    />
                  </label>
                </div>
              </div>
              {formError ? <div className="rounded-2xl bg-(--background-error) p-3 text-sm text-(--error)">{formError}</div> : null}
              {successMessage ? <div className="rounded-2xl bg-(--background-success) p-3 text-sm text-(--success)">{successMessage}</div> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row justify-between w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting || isDeleting}
                    className="cursor-pointer rounded-2xl border border-(--secondary) bg-(--secondary) px-5 py-3 font-semibold text-white transition hover:bg-(--secondary-hover) disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isSubmitting || isDeleting}
                    className="cursor-pointer rounded-2xl border border-(--error) bg-white px-5 py-3 font-semibold text-(--error) transition hover:bg-(--error) hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete Venue
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
        <aside className="flex flex-col gap-6 w-full lg:w-2/5">
          <section className="rounded-4xl border border-(--border) bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-(--text-primary)">Bookings</h2>
                <p className="text-(--text-secondary)">
                  {bookings.length} booking{bookings.length === 1 ? "" : "s"} for this venue
                </p>
              </div>
            </div>
            {bookings.length === 0 ? (
              <p className="text-(--text-secondary)">No bookings have been made yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map((booking) => (
                  <article key={booking.id} className="rounded-3xl border border-(--border) bg-(--surface-dark) p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-(--text-primary)">{booking.customer?.name ?? "Unknown guest"}</h3>
                        <span className="text-sm text-(--text-secondary)">
                          {booking.guests} guest{booking.guests === 1 ? "" : "s"}
                        </span>
                      </div>
                      <p className="text-sm text-(--text-secondary)">{booking.customer?.email}</p>
                      <p className="text-sm text-(--text-primary)">
                        {formatDate(booking.dateFrom)} to {formatDate(booking.dateTo)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-(--text-primary)">Delete venue</h2>
                <p className="text-sm text-(--text-secondary)">This will permanently remove the venue and its bookings.</p>
              </div>
              <button type="button" onClick={() => setShowDeleteModal(false)} className="rounded-full p-2 text-(--text-secondary) transition hover:bg-black/5 hover:text-(--text-primary)">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-2xl border border-(--border) bg-(--primary) cursor-pointer px-4 py-3 font-semibold text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteVenue}
                disabled={isDeleting}
                className="flex-1 rounded-2xl border border-(--error) bg-(--error) cursor-pointer px-4 py-3 font-semibold text-white transition hover:bg-(--error-hover) disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Venue"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
