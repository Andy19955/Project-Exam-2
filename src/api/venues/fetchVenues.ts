import { venuesUrl } from "@/constants/apiUrls";
import { SearchState } from "@/types/searchState";

/**
 * Fetch a list of venues from the API.
 * @param {SearchState} [params] - Optional search, sort and sortOrder parameters.
 * @returns {Promise<any>} Resolves with the parsed API response (expects a `data` array of venues).
 * @throws {Error} When the network request fails or the API responds with an error.
 */
export async function fetchVenues({ query = "", sort = "created", sortOrder = "desc" }: SearchState = {}) {
  const trimmedQuery = query.trim();
  const baseUrl = trimmedQuery ? `${venuesUrl}/search` : venuesUrl;
  const url = new URL(baseUrl);

  url.searchParams.set("_owner", "true");
  url.searchParams.set("sort", sort);
  url.searchParams.set("sortOrder", sortOrder);

  if (trimmedQuery) {
    url.searchParams.set("q", trimmedQuery);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message ?? result.message ?? "Failed to fetch venues");
  }
  return result;
}
