"use client";

import { useState } from "react";
import { createVenueFormSchema, type CreateVenueData } from "@/schemas/createVenueFormSchema";
import { z } from "zod";
import { createVenue } from "@/api/venues/createVenue";
import { VenueData } from "@/types/venueData";
import { useRouter } from "next/navigation";
import { amenities } from "@/constants/amenities";

type FieldErrors = Partial<Record<keyof CreateVenueData, string>>;

export default function NewVenueForm({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    imageAlt: "",
    price: 0,
    maxGuests: 1,
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
    lat: 0,
    lng: 0,
  });

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    setFieldErrors({});
    setFormError("");

    const formValues = {
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
      imageAlt: formData.imageAlt,
      price: formData.price,
      maxGuests: formData.maxGuests,
      wifi: formData.wifi,
      parking: formData.parking,
      breakfast: formData.breakfast,
      pets: formData.pets,
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      country: formData.country,
      continent: formData.continent,
      lat: formData.lat,
      lng: formData.lng,
    };

    const validationResult = createVenueFormSchema.safeParse(formValues);

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

    const venueData: VenueData = {
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
      const result = await createVenue(venueData);
      router.push("/venue/" + result.data.id);
      onCancel();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to create venue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 font-medium text-(--text-primary) col-span-2">
        <span>Venue Name</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.name ? "border-(--error) focus:border-(--error)" : ""}`}
          placeholder="Enter venue name"
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
          placeholder="Tell people a little about your venue"
        />
        {fieldErrors.description ? <p className="text-sm text-(--error)">{fieldErrors.description}</p> : null}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
          <span>Image URL</span>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })}
            className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.imageUrl ? "border-(--error) focus:border-(--error)" : ""}`}
            placeholder="https://..."
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
            placeholder="Describe the image"
          />
          {fieldErrors.imageAlt ? <p className="text-sm text-(--error)">{fieldErrors.imageAlt}</p> : null}
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
          <span>Price</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(event) => setFormData({ ...formData, price: Number(event.target.value) })}
            className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.price ? "border-(--error) focus:border-(--error)" : ""}`}
            placeholder="Enter price"
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
            placeholder="Enter max guests"
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
        <h3 className="text-xl font-bold text-(--text-primary)">Location Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
            <span>Address</span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={(event) => setFormData({ ...formData, address: event.target.value })}
              className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.address ? "border-(--error) focus:border-(--error)" : ""}`}
              placeholder="Enter address"
            />
            {fieldErrors.address ? <p className="text-sm text-(--error)">{fieldErrors.address}</p> : null}
          </label>
          <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
            <span>City</span>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={(event) => setFormData({ ...formData, city: event.target.value })}
              className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.city ? "border-(--error) focus:border-(--error)" : ""}`}
              placeholder="Enter city"
            />
            {fieldErrors.city ? <p className="text-sm text-(--error)">{fieldErrors.city}</p> : null}
          </label>
          <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
            <span>Zip Code</span>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={(event) => setFormData({ ...formData, zip: event.target.value })}
              className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.zip ? "border-(--error) focus:border-(--error)" : ""}`}
              placeholder="Enter zip code"
            />
            {fieldErrors.zip ? <p className="text-sm text-(--error)">{fieldErrors.zip}</p> : null}
          </label>
          <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
            <span>Country</span>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={(event) => setFormData({ ...formData, country: event.target.value })}
              className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.country ? "border-(--error) focus:border-(--error)" : ""}`}
              placeholder="Enter country"
            />
            {fieldErrors.country ? <p className="text-sm text-(--error)">{fieldErrors.country}</p> : null}
          </label>
          <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
            <span>Continent</span>
            <input
              type="text"
              name="continent"
              value={formData.continent}
              onChange={(event) => setFormData({ ...formData, continent: event.target.value })}
              className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.continent ? "border-(--error) focus:border-(--error)" : ""}`}
              placeholder="Enter continent"
            />
            {fieldErrors.continent ? <p className="text-sm text-(--error)">{fieldErrors.continent}</p> : null}
          </label>
          <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
            <span>Latitude</span>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={(event) => setFormData({ ...formData, lat: Number(event.target.value) })}
              className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.lat ? "border-(--error) focus:border-(--error)" : ""}`}
              placeholder="Enter latitude"
            />
            {fieldErrors.lat ? <p className="text-sm text-(--error)">{fieldErrors.lat}</p> : null}
          </label>
          <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
            <span>Longitude</span>
            <input
              type="number"
              name="lng"
              value={formData.lng}
              onChange={(event) => setFormData({ ...formData, lng: Number(event.target.value) })}
              className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.lng ? "border-(--error) focus:border-(--error)" : ""}`}
              placeholder="Enter longitude"
            />
            {fieldErrors.lng ? <p className="text-sm text-(--error)">{fieldErrors.lng}</p> : null}
          </label>
        </div>
      </div>
      {formError ? <div className="rounded-md bg-(--background-error) p-3 text-sm text-(--error)">{formError}</div> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl border border-(--secondary) bg-(--secondary) px-5 py-3 font-semibold text-white transition hover:bg-(--secondary-hover) cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create Venue"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-2xl border border-(--border) px-5 py-3 font-semibold text-white transition bg-(--primary) hover:bg-(--primary-hover) cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
