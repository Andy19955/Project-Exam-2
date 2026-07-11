"use client";

import SearchForm from "./SearchForm";
import { SearchFormProps } from "@/types/searchFormProps";

export default function Hero({ query, sort, sortOrder, onSearch, onReset }: SearchFormProps) {
  return (
    <section className="flex justify-center px-6 py-20 text-center bg-[url('/images/hero-image.webp')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center gap-2 bg-(--background-soft)/85 rounded-lg">
        <h1 className="text-2xl lg:text-3xl font-bold text-(--text-primary)">Find your perfect getaway</h1>
        <p className="font-semibold text-(--text-secondary)">Search for venues, check availability and book with confidence.</p>
        <SearchForm key={`${query}-${sort}-${sortOrder}`} query={query} sort={sort} sortOrder={sortOrder} onSearch={onSearch} onReset={onReset} />
      </div>
    </section>
  );
}
