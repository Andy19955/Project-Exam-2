export default function Hero() {
  return (
    <section className="flex justify-center py-14 text-center bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col items-center gap-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Find your perfect getaway</h1>
        <p className="text-(--text-muted)">Search for venues, check availability and book with confidence.</p>
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
