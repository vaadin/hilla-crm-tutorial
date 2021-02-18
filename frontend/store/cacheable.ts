import { autorun } from "mobx";
import { appState } from "./appstate";

// keeps track of the data to be cleared
const keysToClearOnLogout: Set<string> = new Set<string>();

export async function cacheable<T>(
  fn: () => Promise<T>,
  key: string,
  defaultValue: T
) {
  let result;
  try {
    // retrive the data from backend.
    result = await fn();
    // save the data to localStorage.
    localStorage.setItem(key, JSON.stringify(result));
    // register the data to be cleaned when a user logs out
    keysToClearOnLogout.add(key);
  } catch {
    // if failed to retrieve the data from backend, try localStorage.
    const cached = localStorage.getItem(key);
    // use the cached data if available, otherwise the default value.
    result = cached ? JSON.parse(cached) : defaultValue;
  }

  return result;
}

export function clearCache() {
  keysToClearOnLogout.forEach((key) => localStorage.removeItem(key));
}
