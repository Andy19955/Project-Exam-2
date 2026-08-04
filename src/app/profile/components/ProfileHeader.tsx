import { Profile as ProfileType } from "@/types/profile";
import Image from "next/image";

export default function ProfileHeader({ profile, onEditProfile }: { profile: ProfileType; onEditProfile: () => void }) {
  const avatarImage = profile?.avatar?.url;
  const bannerImage = profile?.banner?.url;
  const bannerAlt = profile?.banner?.alt || `${profile.name}'s banner`;
  const avatarAlt = profile?.avatar?.alt || `${profile.name}'s avatar`;
  const initial = profile.name?.charAt(0).toUpperCase() || "P";

  return (
    <section className="mx-auto max-w-7xl px-6 py-5 sm:py-10">
      <div className="rounded-4xl border border-(--border) bg-(--surface) shadow-lg">
        <div className="relative h-56 bg-linear-to-br from-(--primary) to(--secondary) rounded-t-4xl sm:h-72">
          {bannerImage ? <Image src={bannerImage} alt={bannerAlt} fill className="object-cover rounded-t-4xl" /> : null}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-white/0 to-white/95" />
        </div>
        <div className="relative px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="-mt-16 flex flex-col gap-6 lg:-mt-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:items-end lg:text-left">
              <div className="relative h-32 w-32 rounded-full border-4 border-(--surface) bg-(--background-soft) shadow-lg lg:h-36 lg:w-36">
                {avatarImage ? (
                  <Image src={avatarImage} alt={avatarAlt} fill className="object-cover rounded-full" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-(--primary) to-(--accent) text-4xl rounded-full font-bold text-white">{initial}</div>
                )}
              </div>
              <div className="max-w-2xl flex flex-col gap-3 pb-1">
                <div className="flex items-center rounded-full w-fit border border-(--border) bg-(--background-soft) px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-(--text-secondary)">
                  Profile
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-semibold tracking-tight text-(--text-primary) sm:text-2xl lg:text-4xl">{profile.name}</h1>
                  <p className="text-sm font-medium text-(--text-secondary) sm:text-base">{profile.email}</p>
                </div>
                <p className="max-w-2xl text-base leading-7 text-(--text-secondary) sm:text-lg">{profile.bio}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onEditProfile}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-(--border) bg-(--background-soft) px-4 py-2 text-sm font-semibold text-(--text-primary) shadow-sm transition-colors hover:bg-(--background-soft)/50"
            >
              <i className="fa-solid fa-pen-to-square" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
