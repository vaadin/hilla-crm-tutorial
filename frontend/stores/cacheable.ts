const CACHE_NAME = "crm-cache";

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
    const cache = getCache();
    cache[key] = result;
    localStorage.setItem(CACHE_NAME, JSON.stringify(cache));
  } catch {
    // if failed to retrieve the data from backend, try localStorage.
    const cache = getCache();
    const cached = cache[key];
    // use the cached data if available, otherwise the default value.
    result = result = cached === undefined ? defaultValue : cached;
  }

  return result;
}

function getCache(): any {
  const cache = localStorage.getItem(CACHE_NAME) || "{}";
  return JSON.parse(cache);
}

export function clearCache() {
  localStorage.removeItem(CACHE_NAME);
}
