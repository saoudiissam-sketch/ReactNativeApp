import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../storage/mmkv';

interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
  };
  experience: {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  education: {
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  };
  skills: string;
  createdAt: string;
  updatedAt: string;
}

interface CV {
  id: string;
  name: string;
  data: CVData;
}

interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    notificationsEnabled: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
}

interface AppState {
  // User Management
  user: User | null;
  isAuthenticated: boolean;
  
  // CV Management
  cvs: CV[];
  currentCvId: string | null;
  
  // App State
  isLoading: boolean;
  error: string | null;
  
  // Notifications
  notificationsEnabled: boolean;
  pushToken: string | null;
  
  // Actions - User
  setUser: (user: User) => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  
  // Actions - CV
  loadCVs: () => Promise<void>;
  addCV: (cv: Omit<CV, 'id'>) => Promise<string>;
  updateCV: (id: string, data: Partial<CVData>) => Promise<void>;
  deleteCV: (id: string) => Promise<void>;
  duplicateCV: (id: string) => Promise<string>;
  setCurrentCV: (id: string) => void;
  getCurrentCV: () => CV | null;
  
  // Actions - App State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Actions - Notifications
  setPushToken: (token: string) => void;
  toggleNotifications: (enabled: boolean) => void;
}

// Custom storage adapter for Zustand with MMKV
const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      cvs: [],
      currentCvId: null,
      isLoading: false,
      error: null,
      notificationsEnabled: true,
      pushToken: null,

      // User Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        currentCvId: null 
      }),
      
      updateUserPreferences: (preferences) => set((state) => ({
        user: state.user ? {
          ...state.user,
          preferences: { ...state.user.preferences, ...preferences }
        } : null
      })),

      // CV Actions
      loadCVs: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const cvListJson = storage.getString('cv-list');
          const cvList: string[] = cvListJson ? JSON.parse(cvListJson) : [];
          
          // Migrate existing CV if no list exists
          if (cvList.length === 0) {
            const mainCv = storage.getString('user-cv-1');
            if (mainCv) {
              cvList.push('user-cv-1');
              storage.set('cv-list', JSON.stringify(cvList));
            }
          }

          const loadedCVs: CV[] = [];
          
          for (const cvId of cvList) {
            const cvData = storage.getString(cvId);
            if (cvData) {
              const parsed = JSON.parse(cvData);
              loadedCVs.push({
                id: cvId,
                name: parsed.personalInfo?.fullName || `CV ${cvId.split('-').pop()}`,
                data: {
                  ...parsed,
                  createdAt: parsed.createdAt || new Date().toISOString(),
                  updatedAt: parsed.updatedAt || new Date().toISOString(),
                }
              });
            }
          }

          // Sort by update date
          loadedCVs.sort((a, b) => 
            new Date(b.data.updatedAt).getTime() - new Date(a.data.updatedAt).getTime()
          );

          set({ cvs: loadedCVs, isLoading: false });
        } catch (error) {
          console.error('Error loading CVs:', error);
          set({ error: 'Impossible de charger les CVs', isLoading: false });
        }
      },

      addCV: async (cv) => {
        const cvId = `user-cv-${Date.now()}`;
        const cvData: CVData = {
          ...cv.data,
          createdAt: cv.data.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          // Save CV data
          storage.set(cvId, JSON.stringify(cvData));
          
          // Update CV list
          const cvListJson = storage.getString('cv-list');
          const cvList = cvListJson ? JSON.parse(cvListJson) : [];
          cvList.push(cvId);
          storage.set('cv-list', JSON.stringify(cvList));

          // Update state
          const newCV: CV = { id: cvId, name: cv.name, data: cvData };
          set((state) => ({ 
            cvs: [newCV, ...state.cvs],
            currentCvId: cvId
          }));

          return cvId;
        } catch (error) {
          console.error('Error adding CV:', error);
          set({ error: 'Impossible de créer le CV' });
          throw error;
        }
      },

      updateCV: async (id, updates) => {
        try {
          const existingData = storage.getString(id);
          if (!existingData) {
            throw new Error('CV not found');
          }

          const parsed = JSON.parse(existingData);
          const updatedData = {
            ...parsed,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          storage.set(id, JSON.stringify(updatedData));

          // Update state
          set((state) => ({
            cvs: state.cvs.map(cv => 
              cv.id === id 
                ? { 
                    ...cv, 
                    data: updatedData,
                    name: updatedData.personalInfo?.fullName || cv.name
                  }
                : cv
            )
          }));
        } catch (error) {
          console.error('Error updating CV:', error);
          set({ error: 'Impossible de mettre à jour le CV' });
          throw error;
        }
      },

      deleteCV: async (id) => {
        try {
          storage.delete(id);
          
          // Update CV list
          const cvListJson = storage.getString('cv-list');
          if (cvListJson) {
            const cvList = JSON.parse(cvListJson).filter((cvId: string) => cvId !== id);
            storage.set('cv-list', JSON.stringify(cvList));
          }

          // Update state
          set((state) => ({
            cvs: state.cvs.filter(cv => cv.id !== id),
            currentCvId: state.currentCvId === id ? null : state.currentCvId
          }));
        } catch (error) {
          console.error('Error deleting CV:', error);
          set({ error: 'Impossible de supprimer le CV' });
          throw error;
        }
      },

      duplicateCV: async (id) => {
        try {
          const originalCV = get().cvs.find(cv => cv.id === id);
          if (!originalCV) {
            throw new Error('CV not found');
          }

          const newId = `user-cv-${Date.now()}`;
          const duplicatedData = {
            ...originalCV.data,
            personalInfo: {
              ...originalCV.data.personalInfo,
              fullName: `${originalCV.data.personalInfo.fullName} (Copie)`
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          storage.set(newId, JSON.stringify(duplicatedData));
          
          // Update CV list
          const cvListJson = storage.getString('cv-list');
          const cvList = cvListJson ? JSON.parse(cvListJson) : [];
          cvList.push(newId);
          storage.set('cv-list', JSON.stringify(cvList));

          // Update state
          const newCV: CV = { 
            id: newId, 
            name: duplicatedData.personalInfo.fullName, 
            data: duplicatedData 
          };
          
          set((state) => ({ 
            cvs: [newCV, ...state.cvs] 
          }));

          return newId;
        } catch (error) {
          console.error('Error duplicating CV:', error);
          set({ error: 'Impossible de dupliquer le CV' });
          throw error;
        }
      },

      setCurrentCV: (id) => set({ currentCvId: id }),
      
      getCurrentCV: () => {
        const { cvs, currentCvId } = get();
        return currentCvId ? cvs.find(cv => cv.id === currentCvId) || null : null;
      },

      // App State Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Notification Actions
      setPushToken: (token) => set({ pushToken: token }),
      toggleNotifications: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        notificationsEnabled: state.notificationsEnabled,
        pushToken: state.pushToken,
        currentCvId: state.currentCvId,
      }),
    }
  )
);