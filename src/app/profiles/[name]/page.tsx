"use client";

import { useEffect, useState } from "react";
import { Profile as ProfileType } from "@/types/profile";
import { fetchProfile } from "@/api/profiles/fetchProfile";
import ProfileHeader from "./components/ProfileHeader";
import { useAuthStore } from "@/store/authStore";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const user = useAuthStore.getState().user;
    const name = user?.name;
    const fetchProfileData = async () => {
      try {
        const result = await fetchProfile(name ?? "");
        if (!result?.data) {
          setNotFound(true);
          setProfile(null);
          return;
        }
        setNotFound(false);
        setProfile(result.data);
      } catch (error) {
        setNotFound(true);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (notFound || !profile) return <div>Profile not found</div>;

  return <ProfileHeader profile={profile} />;
}
