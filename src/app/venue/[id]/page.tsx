import Link from "next/link";
import VenueDetails from "@/app/venue/[id]/components/VenueDetails";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-full w-fit border border-(--border-dark) bg-(--surface) px-4 py-2 text-sm font-semibold text-(--text-primary) shadow-sm transition hover:bg-(--surface-dark)"
      >
        <i className="fa fa-arrow-left"></i>Go back to all venues
      </Link>
      <VenueDetails id={id} />
    </div>
  );
}
