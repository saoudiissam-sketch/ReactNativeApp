import { create } from 'zustand';
import { storage } from '../storage/mmkv';

interface AppState {
  user: string | null;
  setUser: (user: string | null) => void;
  hydrate: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    if (user) {
      storage.set('user', user);
    } else {
      storage.delete('user');
    }
  },
  hydrate: () => {
    const user = storage.getString('user');
    set({ user: user ?? null });
  },
}));
