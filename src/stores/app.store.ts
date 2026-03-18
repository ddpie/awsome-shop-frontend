import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  darkMode: boolean;
  language: string;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: false,
      language: '',
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ darkMode: state.darkMode, language: state.language }),
    },
  ),
);
