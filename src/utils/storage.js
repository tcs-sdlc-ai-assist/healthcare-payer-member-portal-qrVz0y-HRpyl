/**
 * Storage utility abstraction for MVP preference persistence.
 * Provides getItem, setItem, removeItem with JSON serialization/deserialization,
 * error handling, and fallback for unavailable localStorage.
 * Designed for easy migration to backend API persistence.
 *
 * @module storage
 */

/**
 * In-memory fallback store used when localStorage is unavailable.
 * @type {Map<string, string>}
 */
const memoryStore = new Map();

/**
 * Checks whether localStorage is available and functional.
 * @returns {boolean} True if localStorage is available, false otherwise
 */
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__hcp_storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Cached result of localStorage availability check.
 * Evaluated once on module load.
 * @type {boolean}
 */
const storageAvailable = isLocalStorageAvailable();

/**
 * Retrieves a value from storage by key.
 * Automatically deserializes JSON values.
 * Returns the provided defaultValue (or null) if the key does not exist or an error occurs.
 *
 * @param {string} key - The storage key to retrieve
 * @param {*} [defaultValue=null] - The default value to return if the key is not found or on error
 * @returns {*} The deserialized value, or defaultValue if not found or on error
 */
export const getItem = (key, defaultValue = null) => {
  try {
    let raw;

    if (storageAvailable) {
      raw = window.localStorage.getItem(key);
    } else {
      raw = memoryStore.has(key) ? memoryStore.get(key) : null;
    }

    if (raw === null || raw === undefined) {
      return defaultValue;
    }

    return JSON.parse(raw);
  } catch {
    console.error(`[storage] Error reading key "${key}" from storage.`);
    return defaultValue;
  }
};

/**
 * Stores a value in storage by key.
 * Automatically serializes values to JSON.
 * Returns true on success, false on failure.
 *
 * @param {string} key - The storage key to set
 * @param {*} value - The value to store (will be JSON-serialized)
 * @returns {boolean} True if the value was stored successfully, false otherwise
 */
export const setItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value);

    if (storageAvailable) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryStore.set(key, serialized);
    }

    return true;
  } catch {
    console.error(`[storage] Error writing key "${key}" to storage.`);
    return false;
  }
};

/**
 * Removes a value from storage by key.
 * Returns true on success, false on failure.
 *
 * @param {string} key - The storage key to remove
 * @returns {boolean} True if the key was removed successfully, false otherwise
 */
export const removeItem = (key) => {
  try {
    if (storageAvailable) {
      window.localStorage.removeItem(key);
    } else {
      memoryStore.delete(key);
    }

    return true;
  } catch {
    console.error(`[storage] Error removing key "${key}" from storage.`);
    return false;
  }
};

/**
 * Clears all values from storage.
 * When using localStorage, only clears keys prefixed with the application namespace.
 * When using the in-memory fallback, clears the entire memory store.
 * Returns true on success, false on failure.
 *
 * @param {string} [prefix='hcp_'] - Only keys starting with this prefix will be removed from localStorage
 * @returns {boolean} True if storage was cleared successfully, false otherwise
 */
export const clearAll = (prefix = 'hcp_') => {
  try {
    if (storageAvailable) {
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => {
        window.localStorage.removeItem(key);
      });
    } else {
      memoryStore.clear();
    }

    return true;
  } catch {
    console.error('[storage] Error clearing storage.');
    return false;
  }
};

/**
 * Checks whether a key exists in storage.
 *
 * @param {string} key - The storage key to check
 * @returns {boolean} True if the key exists, false otherwise
 */
export const hasItem = (key) => {
  try {
    if (storageAvailable) {
      return window.localStorage.getItem(key) !== null;
    }
    return memoryStore.has(key);
  } catch {
    console.error(`[storage] Error checking key "${key}" in storage.`);
    return false;
  }
};

/**
 * Returns whether the storage utility is using localStorage or the in-memory fallback.
 *
 * @returns {boolean} True if localStorage is being used, false if using in-memory fallback
 */
export const isUsingLocalStorage = () => {
  return storageAvailable;
};