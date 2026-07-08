"use client";

import { useState } from "react";
import { Profile as ProfileType } from "@/types/profile";
import { updateProfileFormSchema, type UpdateProfileData } from "@/schemas/updateProfileFormSchema";
import { z } from "zod";
import { updateProfile } from "@/api/profiles/updateProfile";
import { ProfileData } from "@/types/profileData";

type FieldErrors = Partial<Record<keyof UpdateProfileData, string>>;

export default function ProfileEditForm({ profile, onUpdate, onCancel }: { profile: ProfileType; onUpdate: (profile: ProfileType) => void; onCancel: () => void }) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bannerUrl: profile.banner.url || "",
    bannerAlt: profile.banner.alt || "",
    avatarUrl: profile.avatar.url || "",
    avatarAlt: profile.avatar.alt || "",
    bio: profile.bio || "",
    venueManager: profile.venueManager || false,
  });

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    setFieldErrors({});
    setFormError("");

    const formValues = {
      bannerUrl: formData.bannerUrl || undefined,
      bannerAlt: formData.bannerAlt,
      avatarUrl: formData.avatarUrl || undefined,
      avatarAlt: formData.avatarAlt,
      bio: formData.bio,
      venueManager: formData.venueManager,
    };

    const validationResult = updateProfileFormSchema.safeParse(formValues);

    if (!validationResult.success) {
      const flattenedErrors = z.flattenError(validationResult.error);
      setFieldErrors({
        bannerUrl: flattenedErrors.fieldErrors.bannerUrl?.[0],
        bannerAlt: flattenedErrors.fieldErrors.bannerAlt?.[0],
        avatarUrl: flattenedErrors.fieldErrors.avatarUrl?.[0],
        avatarAlt: flattenedErrors.fieldErrors.avatarAlt?.[0],
        bio: flattenedErrors.fieldErrors.bio?.[0],
        venueManager: flattenedErrors.fieldErrors.venueManager?.[0],
      });

      return;
    }

    const profileData: ProfileData = {
      bio: validationResult.data.bio || "",
      banner: {
        url: validationResult.data.bannerUrl,
        alt: validationResult.data.bannerAlt || "",
      },
      avatar: {
        url: validationResult.data.avatarUrl,
        alt: validationResult.data.avatarAlt || "",
      },
      venueManager: validationResult.data.venueManager,
    };

    setIsSubmitting(true);

    try {
      const result = await updateProfile(profile.name, profileData);
      onUpdate(result.data);
      onCancel();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-5 sm:pb-10">
      <div className="rounded-4xl border border-(--border) bg-(--surface) p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-(--text-primary)">Edit profile</h2>
          <p className="text-(--text-secondary)">Update your profile information here.</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
              <span>Banner URL</span>
              <input
                type="url"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={(event) => setFormData({ ...formData, bannerUrl: event.target.value })}
                className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.bannerUrl ? "border-(--error) focus:border-(--error)" : ""}`}
                placeholder="https://..."
              />
              {fieldErrors.bannerUrl ? <p className="text-sm text-(--error)">{fieldErrors.bannerUrl}</p> : null}
            </label>
            <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
              <span>Banner alt text</span>
              <input
                type="text"
                name="bannerAlt"
                value={formData.bannerAlt}
                onChange={(event) => setFormData({ ...formData, bannerAlt: event.target.value })}
                className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.bannerAlt ? "border-(--error) focus:border-(--error)" : ""}`}
                placeholder="Describe the banner"
              />
              {fieldErrors.bannerAlt ? <p className="text-sm text-(--error)">{fieldErrors.bannerAlt}</p> : null}
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
              <span>Avatar URL</span>
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={(event) => setFormData({ ...formData, avatarUrl: event.target.value })}
                className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.avatarUrl ? "border-(--error) focus:border-(--error)" : ""}`}
                placeholder="https://..."
              />
              {fieldErrors.avatarUrl ? <p className="text-sm text-(--error)">{fieldErrors.avatarUrl}</p> : null}
            </label>
            <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
              <span>Avatar alt text</span>
              <input
                type="text"
                name="avatarAlt"
                value={formData.avatarAlt}
                onChange={(event) => setFormData({ ...formData, avatarAlt: event.target.value })}
                className={`w-full rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.avatarAlt ? "border-(--error) focus:border-(--error)" : ""}`}
                placeholder="Describe the avatar"
              />
              {fieldErrors.avatarAlt ? <p className="text-sm text-(--error)">{fieldErrors.avatarAlt}</p> : null}
            </label>
          </div>
          <label className="flex flex-col gap-2 font-medium text-(--text-primary)">
            <span>Bio</span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
              rows={6}
              className={`w-full resize-y rounded-2xl border border-(--border) bg-(--surface-dark) px-4 py-3 text-(--text-primary) outline-none transition focus:border-(--border-dark) focus:bg-white ${fieldErrors.bio ? "border-(--error) focus:border-(--error)" : ""}`}
              placeholder="Tell people a little about yourself"
            />
            {fieldErrors.bio ? <p className="text-sm text-(--error)">{fieldErrors.bio}</p> : null}
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              id="venueManager"
              name="venueManager"
              className="w-4 h-4"
              checked={formData.venueManager}
              onChange={(event) => setFormData({ ...formData, venueManager: event.target.checked })}
            />
            <label htmlFor="venueManager" className="font-semibold">
              {formData.venueManager ? "Unregister as a venue manager" : "Register as a venue manager"}
            </label>
          </div>
          {formError ? <div className="rounded-md bg-(--background-error) p-3 text-sm text-(--error)">{formError}</div> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-2xl border border-(--border) px-5 py-3 font-semibold text-(--text-primary) transition hover:bg-(--background-soft) cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl border border-(--secondary) bg-(--secondary) px-5 py-3 font-semibold text-white transition hover:bg-(--secondary-hover) cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
