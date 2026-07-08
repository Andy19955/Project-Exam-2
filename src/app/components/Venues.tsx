import DisplayVenues from "@/components/venues/DisplayVenues";

export default function Venues() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between my-5">
        <h2 className="text-2xl font-bold">Venues</h2>
      </div>
      <DisplayVenues limit={20} enableLoadMore={true} />
    </section>
  );
}
