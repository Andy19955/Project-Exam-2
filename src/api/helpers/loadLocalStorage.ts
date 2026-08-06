/**
 * Load a string value from localStorage.
 * @param {string} key - The storage key to read.
 * @returns {string | null} The stored string value or null.
 */
export default function loadLocalStorage(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(key);
}
