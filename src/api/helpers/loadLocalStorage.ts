export default function loadLocalStorage(key: string) {
  const value = localStorage.getItem(key);
  return value;
}
