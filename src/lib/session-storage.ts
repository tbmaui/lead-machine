/**
 * Session Storage Utilities for Lead Generation State Persistence
 * Handles saving/loading complex state with graceful degradation
 */

// Namespaced storage keys to prevent conflicts
export const STORAGE_KEYS = {
  SEARCH_CRITERIA: 'leadgen_search_criteria',
  CURRENT_JOB: 'leadgen_current_job',
  SEARCH_RESULTS: 'leadgen_results',
  FORM_STATE: 'leadgen_form_state'
} as const;

/**
 * Check if sessionStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return false;
    }
    // Test storage functionality
    const testKey = '__storage_test__';
    window.sessionStorage.setItem(testKey, 'test');
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Save search state with error handling
 */
export function saveSearchState<T>(key: string, data: T): boolean {
  try {
    if (!isStorageAvailable()) {
      console.warn('Session storage unavailable, state not persisted');
      return false;
    }

    const serialized = JSON.stringify(data);
    window.sessionStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('Session storage quota exceeded, clearing old data');
      // Try to clear old data and retry
      clearOldData();
      try {
        const serialized = JSON.stringify(data);
        window.sessionStorage.setItem(key, serialized);
        return true;
      } catch (retryError) {
        console.error('Failed to save after cleanup:', retryError);
        return false;
      }
    }
    console.error('Error saving to session storage:', error);
    return false;
  }
}

/**
 * Load search state with graceful degradation
 */
export function loadSearchState<T>(key: string): T | null {
  try {
    if (!isStorageAvailable()) {
      return null;
    }

    const stored = window.sessionStorage.getItem(key);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as T;
  } catch (error) {
    console.warn('Error loading from session storage:', error);
    // If data is corrupted, remove it
    try {
      if (isStorageAvailable()) {
        window.sessionStorage.removeItem(key);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up corrupted data:', cleanupError);
    }
    return null;
  }
}

/**
 * Clear specific search state
 */
export function clearSearchState(key: string): void {
  try {
    if (isStorageAvailable()) {
      window.sessionStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error clearing search state:', error);
  }
}

/**
 * Clear all lead generation related storage
 */
export function clearAllSearchState(): void {
  try {
    if (!isStorageAvailable()) {
      return;
    }

    Object.values(STORAGE_KEYS).forEach(key => {
      window.sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all search state:', error);
  }
}

/**
 * Clear old data to free up space
 */
function clearOldData(): void {
  try {
    if (!isStorageAvailable()) {
      return;
    }

    // Remove items that might be taking up space
    // Start with results as they're typically largest
    window.sessionStorage.removeItem(STORAGE_KEYS.SEARCH_RESULTS);
    
    // Clear any non-leadgen items (be careful not to break other parts of app)
    const keysToKeep = Object.values(STORAGE_KEYS) as string[];
    const allKeys = Object.keys(window.sessionStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key) && !key.startsWith('leadgen_')) {
        // Only remove non-leadgen keys that look like temporary data
        if (key.includes('temp') || key.includes('cache')) {
          window.sessionStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing old data:', error);
  }
}

/**
 * Get storage usage information (for debugging)
 */
export function getStorageInfo(): { used: number; available: boolean } {
  try {
    if (!isStorageAvailable()) {
      return { used: 0, available: false };
    }

    let used = 0;
    Object.keys(window.sessionStorage).forEach(key => {
      used += (window.sessionStorage.getItem(key) || '').length;
    });

    return { used, available: true };
  } catch (error) {
    return { used: 0, available: false };
  }
}