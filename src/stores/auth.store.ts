import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../utils/storage';
import type { UserInfo, LoginRequest, AdminUser, AdminUserListParams, AdminUserListResult } from '../types/auth.types';

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
  await new Promise((r) => setTimeout(r, 400));
  const found = MOCK_USERS[credentials.username];
  if (!found || found.password !== credentials.password) {
    throw new Error('用户名或密码错误');
  }
  const { password: _, token, ...user } = found;
  return { token, user };
}

// ---------------------------------------------------------------------------
// Store types
// ---------------------------------------------------------------------------
interface AdminPagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

interface AuthState {
  // ── Auth ──────────────────────────────────────────────────────────────
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;

  // ── Admin user management ─────────────────────────────────────────────
  adminUsers: AdminUser[];
  selectedUser: AdminUser | null;
  adminLoading: boolean;
  adminError: string | null;
  adminPagination: AdminPagination;

  fetchAdminUsers: (params?: AdminUserListParams) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateUserStatus: (id: string, status: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ── Auth ────────────────────────────────────────────────────────────
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (credentials) => {
        set({ loading: true });
        try {
          let token: string;
          let user: UserInfo;

          try {
            const { authService } = await import('../services/auth.service');
            const res = await authService.login(credentials);
            token = res.data.token;
            storage.setToken(token);
            // Decode JWT payload to extract user info (no extra network call needed)
            const payload = JSON.parse(atob(token.split('.')[1]));
            user = {
              id: payload.userId ?? payload.sub,
              username: payload.username ?? credentials.username,
              displayName: payload.username ?? credentials.username,
              role: (payload.role as string).toLowerCase() as UserInfo['role'],
            };
          } catch (apiErr: unknown) {
            const isNetworkError =
              !import.meta.env.PROD &&
              (apiErr as { code?: string }).code === 'ERR_NETWORK';

            if (!isNetworkError) throw apiErr;

            const mock = await mockLogin(credentials);
            token = mock.token;
            user = mock.user;
            storage.setToken(token);
          }

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

      // ── Admin user management ──────────────────────────────────────────
      adminUsers: [],
      selectedUser: null,
      adminLoading: false,
      adminError: null,
      adminPagination: { page: 1, size: 10, total: 0, totalPages: 0 },

      fetchAdminUsers: async (params) => {
        set({ adminLoading: true, adminError: null });
        try {
          const { authService } = await import('../services/auth.service');
          const res: AdminUserListResult = await authService.getAdminUsers(params);
          set({
            adminUsers: res.content,
            adminPagination: {
              page: res.page,
              size: res.size,
              total: res.totalElements,
              totalPages: res.totalPages,
            },
          });
        } catch (err: unknown) {
          const msg = (err as { message?: string }).message ?? 'Failed to load users';
          set({ adminError: msg });
        } finally {
          set({ adminLoading: false });
        }
      },

      fetchUserById: async (id) => {
        set({ adminLoading: true, adminError: null });
        try {
          const { authService } = await import('../services/auth.service');
          const user = await authService.getUserById(id);
          set({ selectedUser: user });
        } catch (err: unknown) {
          const msg = (err as { message?: string }).message ?? 'Failed to load user';
          set({ adminError: msg });
        } finally {
          set({ adminLoading: false });
        }
      },

      updateUserStatus: async (id, status) => {
        set({ adminLoading: true, adminError: null });
        try {
          const { authService } = await import('../services/auth.service');
          await authService.updateUserStatus(id, status);
          // Optimistically update local list
          set((state) => ({
            adminUsers: state.adminUsers.map((u) =>
              u.id === id ? { ...u, status: status as AdminUser['status'] } : u,
            ),
            selectedUser:
              state.selectedUser?.id === id
                ? { ...state.selectedUser, status: status as AdminUser['status'] }
                : state.selectedUser,
          }));
        } catch (err: unknown) {
          const msg = (err as { message?: string }).message ?? 'Failed to update status';
          set({ adminError: msg });
          throw err; // re-throw so the page can show feedback
        } finally {
          set({ adminLoading: false });
        }
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
