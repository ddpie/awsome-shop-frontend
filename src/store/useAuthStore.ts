import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'employee' | 'admin';

export interface UserInfo {
  username: string;
  displayName: string;
  role: UserRole;
  points?: number;
  avatar?: string;
}

// Mock users for frontend development, will be replaced by backend API
const MOCK_USERS: Record<string, UserInfo & { password: string }> = {
  admin: {
    username: 'admin',
    password: 'admin123',
    displayName: '管理员',
    role: 'admin',
  },
  employee: {
    username: 'employee',
    password: 'emp123',
    displayName: '李明',
    role: 'employee',
    points: 2580,
  },
};

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // TODO: replace with real API call
        const mockUser = MOCK_USERS[username];
        if (mockUser && mockUser.password === password) {
          const { password: _, ...userInfo } = mockUser;
          set({ user: userInfo, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
