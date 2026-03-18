import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../utils/storage';
import type { UserInfo, LoginRequest } from '../types/auth.types';

// ---------------------------------------------------------------------------
// Mock users — used when backend is unavailable (dev mode)
// ---------------------------------------------------------------------------
const MOCK_USERS: Record<string, UserInfo & { password: string; token: string }> = {
  admin: {
    username: 'admin',
    password: 'admin123',
    displayName: '管理员',
    role: 'admin',
    token: 'mock-token-admin',
  },
  employee: {
    username: 'employee',
    password: 'emp123',
    displayName: '李明',
    role: 'employee',
    points: 2580,
    token: 'mock-token-employee',
  },
};

async function mockLogin(credentials: LoginRequest): Promise<{ token: string; user: UserInfo }> {
  await new Promise((r) => setTimeout(r, 400)); // simulate network
  const found = MOCK_USERS[credentials.username];
  if (!found || found.password !== credentials.password) {
    throw new Error('用户名或密码错误');
  }
  const { password: _, token, ...user } = found;
  return { token, user };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (credentials) => {
        set({ loading: true });
        try {
          // Try real API first; fall back to mock on network error
          let token: string;
          let user: UserInfo;

          try {
            const { authService } = await import('../services/auth.service');
            const res = await authService.login(credentials);
            token = res.token;
            user = res.user;
          } catch (apiErr: unknown) {
            // Network error or 4xx — use mock in dev, re-throw in prod
            const isNetworkError =
              !import.meta.env.PROD &&
              (apiErr instanceof TypeError ||
                (apiErr as { code?: string }).code === 'ERR_NETWORK' ||
                (apiErr as { response?: unknown }).response === undefined);

            if (!isNetworkError) throw apiErr;

            const mock = await mockLogin(credentials);
            token = mock.token;
            user = mock.user;
          }

          storage.setToken(token);
          set({ user, isAuthenticated: true });
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        storage.clear();
        set({ user: null, isAuthenticated: false });
      },

      restoreSession: () => {
        const token = storage.getToken();
        if (!token) set({ user: null, isAuthenticated: false });
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
