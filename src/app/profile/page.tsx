"use client";

import { useEffect, useState } from "react";
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
