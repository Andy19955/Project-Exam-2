export default function Hero() {
  return (
    <section className="flex justify-center px-6 py-20 text-center bg-[url('/images/hero-image.webp')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center gap-2 bg-(--background-soft)/75 rounded-lg">
        <h1 className="text-2xl lg:text-3xl font-bold text-(--text-primary)">Find your perfect getaway</h1>
        <p className="text-(--text-secondary)">Search for venues, check availability and book with confidence.</p>
        <form className="bg-(--surface) p-2 rounded-4xl max-w-2xl flex items-center">
          <input type="search" placeholder="Search for a venue..." className="px-3 py-2 flex-1 outline-none" />
          <button type="submit" className="bg-(--primary) text-white px-4 py-2 rounded-4xl ml-2 cursor-pointer hover:bg-(--primary-hover) transition-colors duration-200">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
