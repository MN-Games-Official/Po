export function getStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const item = window.localStorage.getItem(key);
  if (!item) {
    return fallback;
  }

  try {
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function setStoredValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStoredValue(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}
