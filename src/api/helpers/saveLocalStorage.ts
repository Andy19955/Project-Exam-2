/**
 * Save a string value to localStorage..
 * @param {string} key - The storage key to write.
 * @param {string} value - The string value to store.
 */
export default function saveLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}
