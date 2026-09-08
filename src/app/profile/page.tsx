"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Profile as ProfileType } from "@/types/profile";
import { fetchProfile } from "@/api/profiles/fetchProfile";
import ProfileHeader from "./components/ProfileHeader";
import { useAuthStore } from "@/store/authStore";
import UpcomingBookings from "./components/UpcomingBookings";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";
import UpcomingBookingsSkeleton from "./components/UpcomingBookingsSkeleton";
import ProfileEditForm from "./components/ProfileEditForm";
import ProfileVenues from "./components/ProfileVenues";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const userName = user?.name || "";

  const handleProfileUpdate = (updatedProfile: ProfileType) => {
    setProfile((currentProfile) => {
      if (!currentProfile) return updatedProfile;

      return {
        ...currentProfile,
        ...updatedProfile,
        bookings: updatedProfile.bookings ?? currentProfile.bookings,
        venues: updatedProfile.venues ?? currentProfile.venues,
      };
    });
  };

  const refreshProfile = async () => {
    try {
      const result = await fetchProfile(userName);
      if (!result?.data) {
        setNotFound(true);
        return;
      }

      setProfile(result.data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hydrated || !userName) return;

    const fetchProfileData = async () => {
      try {
        const result = await fetchProfile(userName);
        if (!result?.data) {
          setNotFound(true);
          return;
        }

        setProfile(result.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [hydrated, userName]);
  if (hydrated && !user)
    return (
      <div className="flex flex-col items-center gap-4 px-6 mt-20 text-center">
        <h1 className="text-xl font-bold">You need to log in to view your profile.</h1>
        <Link href="/login" className="rounded-md bg-(--primary) px-4 py-2 text-white hover:bg-(--primary-hover)">
          Log in
        </Link>
      </div>
    );
  if (loading)
    return (
      <>
        <ProfileHeaderSkeleton />
        <UpcomingBookingsSkeleton />
      </>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (notFound || !profile) return <div>Profile not found</div>;
  return (
    <>
      <ProfileHeader profile={profile} onEditProfile={() => setIsEditingProfile(true)} />
      {isEditingProfile ? <ProfileEditForm profile={profile} onUpdate={handleProfileUpdate} onCancel={() => setIsEditingProfile(false)} /> : null}
      <UpcomingBookings bookings={profile.bookings} onBookingCancelled={refreshProfile} />
      {profile.venueManager ? <ProfileVenues venues={profile.venues} /> : null}
    </>
  );
}
