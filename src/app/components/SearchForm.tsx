"use client";

import type { SubmitEvent } from "react";
import { SearchFormProps } from "@/types/searchFormProps";
import { sortOptions } from "@/constants/sortOptions";

export default function SearchForm({ query = "", sort = "created", sortOrder = "desc", onSearch, onReset }: SearchFormProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const queryValue = String(formData.get("query") ?? "").trim();
    const sortValue = String(formData.get("sort") ?? "created");
    const sortOrderValue = formData.get("sortOrder") === "asc" ? "asc" : "desc";

    onSearch({
      query: queryValue,
      sort: sortValue,
      sortOrder: sortOrderValue,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl rounded-xl border border-white/70 bg-(--surface) p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <label className="flex flex-col gap-2 text-left flex-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">Search</span>
          <input
            type="search"
            name="query"
            defaultValue={query}
            placeholder="Search by venue, city, country or description"
            className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-(--primary)"
          />
        </label>
        <label className="flex flex-col gap-2 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">Sort by</span>
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-(--primary)"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">Order</span>
          <select
            name="sortOrder"
            defaultValue={sortOrder}
            className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-(--primary)"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="w-full items-center justify-center rounded-2xl bg-(--primary) px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-(--primary-hover) cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3 border-t border-(--border) pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-(--text-primary)">Search by venue name, description or destination. Use the sort controls to prioritize names, dates, amenities or price.</p>
        <button type="button" onClick={onReset} className="text-sm font-semibold cursor-pointer text-(--primary) transition-colors hover:text-(--primary-hover)">
          Reset filters
        </button>
      </div>
    </form>
  );
}
