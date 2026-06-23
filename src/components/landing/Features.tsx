export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-4">
      <h2 className="text-2xl font-bold mb-4">Features</h2>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 bg-(--surface) p-4 rounded-lg min-w-40">
          <h4 className="text-lg font-semibold">Flexible Booking</h4>
          <p>Easy cancellation and secure payments.</p>
        </div>
        <div className="flex-1 bg-(--surface) p-4 rounded-lg min-w-40">
          <h4 className="text-lg font-semibold">Local Hosts</h4>
          <p>Personalized stays managed by trusted hosts.</p>
        </div>
        <div className="flex-1 bg-(--surface) p-4 rounded-lg min-w-40">
          <h4 className="text-lg font-semibold">24/7 Support</h4>
          <p>We&apos;re here to help before, during and after your stay.</p>
        </div>
      </div>
    </section>
  );
}
