import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple in-memory cache for sync operations
let memoryCache: { [key: string]: string } = {};
let isInitialized = false;

// Initialize cache from AsyncStorage
const initializeCache = async () => {
  if (isInitialized) return;
  
  try {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    
    values.forEach(([key, value]) => {
      if (value !== null) {
        memoryCache[key] = value;
      }
    });
    
    isInitialized = true;
    console.log('Storage cache initialized successfully');
  } catch (error) {
    console.error('Failed to initialize storage cache:', error);
    isInitialized = true; // Continue anyway
  }
};

// Initialize on import - but don't block
initializeCache().catch(console.error);

// MMKV-compatible interface using AsyncStorage with memory cache
export const storage = {
  set: (key: string, value: string | number | boolean) => {
    const stringValue = String(value);
    memoryCache[key] = stringValue;
    
    // Async save to persistent storage
    AsyncStorage.setItem(key, stringValue).catch(error => {
      console.error('Storage set error:', error);
    });
  },

  getString: (key: string): string | undefined => {
    // Return from cache if available, otherwise try to get from AsyncStorage synchronously
    if (memoryCache[key] !== undefined) {
      return memoryCache[key];
    }
    
    // If not initialized yet, return undefined to avoid errors
    if (!isInitialized) {
      console.warn(`Storage not initialized yet, returning undefined for key: ${key}`);
      return undefined;
    }
    
    return memoryCache[key];
  },

  getNumber: (key: string): number | undefined => {
    const value = storage.getString(key);
    return value ? Number(value) : undefined;
  },

  getBoolean: (key: string): boolean | undefined => {
    const value = storage.getString(key);
    return value ? value === 'true' : undefined;
  },

  delete: (key: string) => {
    delete memoryCache[key];
    
    // Async delete from persistent storage
    AsyncStorage.removeItem(key).catch(error => {
      console.error('Storage delete error:', error);
    });
  },

  clearAll: () => {
    memoryCache = {};
    
    // Async clear persistent storage
    AsyncStorage.clear().catch(error => {
      console.error('Storage clear error:', error);
    });
  }
};

// Async versions for proper usage when you need guaranteed persistence
export const asyncStorage = {
  set: async (key: string, value: string | number | boolean) => {
    const stringValue = String(value);
    memoryCache[key] = stringValue;
    
    try {
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  },

  getString: async (key: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        memoryCache[key] = value;
      }
      return value;
    } catch (error) {
      console.error('Storage get error:', error);
      return memoryCache[key] || null;
    }
  },

  getNumber: async (key: string): Promise<number | null> => {
    const value = await asyncStorage.getString(key);
    return value ? Number(value) : null;
  },

  getBoolean: async (key: string): Promise<boolean | null> => {
    const value = await asyncStorage.getString(key);
    return value ? value === 'true' : null;
  },

  delete: async (key: string) => {
    delete memoryCache[key];
    
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  },

  clearAll: async () => {
    memoryCache = {};
    
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }
};

// Exemple d'utilisation :
// storage.set('key', 'value'); // Synchrone avec cache mémoire
// const value = storage.getString('key');
// 
// // Ou pour garantir la persistance :
// await asyncStorage.set('key', 'value');
// const value = await asyncStorage.getString('key');
