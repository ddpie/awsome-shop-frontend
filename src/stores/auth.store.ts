import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../utils/storage';
import type {
  UserInfo,
  LoginRequest,
  AdminUser,
  AdminUserListParams,
  AdminUserListResult,
  RawAdminUser,
  RawAdminUserListResult,
} from '../types/auth.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Unwrap API envelope: { code, data, message } → data */
function unwrapData<T>(res: unknown): T {
  const r = res as { data?: T };
  return r?.data !== undefined ? r.data : (res as T);
}

/** Normalize a single raw backend user → frontend AdminUser */
function normalizeAdminUser(
  raw: RawAdminUser,
  balanceMap?: Map<number, number>,
): AdminUser {
  return {
    id: String(raw.id),
    username: raw.username,
    displayName: raw.name || raw.username,
    email: '', // backend doesn't provide email
    department: undefined, // backend doesn't provide department
    role: raw.role,
    status: raw.status,
    points: balanceMap?.get(raw.id) ?? 0,
    redemptionCount: 0, // backend doesn't provide this in user list
    createdAt: raw.createdAt,
  };
}

// ---------------------------------------------------------------------------
// Mock users — used when backend is unavailable (dev mode)
// ---------------------------------------------------------------------------
const MOCK_USERS: Record<string, UserInfo & { password: string; token: string }> = {
  admin: {
    username: 'admin',
    password: 'admin123',
    displayName: '管理员',
    role: 'ADMIN',
    token: 'mock-token-admin',
  },
  employee: {
    username: 'employee',
    password: 'emp123',
    displayName: '李明',
    role: 'EMPLOYEE',
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
    (set) => ({
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
            // Fetch full user profile from backend
            try {
              const profileRes = await authService.getProfile();
              const profile = (profileRes as unknown as { data?: { id: number; username: string; name: string; role: string } }).data ?? profileRes;
              user = {
                id: (profile as { id: number }).id,
                username: (profile as { username: string }).username,
                displayName: (profile as { name?: string }).name || credentials.username,
                role: ((profile as { role: string }).role || 'EMPLOYEE').toUpperCase() as UserInfo['role'],
              };
            } catch {
              // Fallback: decode JWT payload
              const payload = JSON.parse(atob(token.split('.')[1]));
              user = {
                id: payload.userId ?? payload.sub,
                username: payload.username ?? credentials.username,
                displayName: payload.username ?? credentials.username,
                role: (payload.role as string).toUpperCase() as UserInfo['role'],
              };
            }
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
          const { pointsService } = await import('../services/points.service');

          // Fetch users and balances in parallel
          const [userRes, balanceRes] = await Promise.all([
            authService.getAdminUsers(params),
            pointsService.adminGetBalances().catch(() => [] as { userId: string; current: number }[]),
          ]);

          // Unwrap user list envelope
          const rawList = unwrapData<RawAdminUserListResult>(userRes);

          // Build userId → balance lookup (balanceRes is already normalized AdminBalanceItem[])
          const balanceMap = new Map<number, number>();
          if (Array.isArray(balanceRes)) {
            for (const b of balanceRes) {
              balanceMap.set(Number(b.userId), b.current);
            }
          }

          // Normalize users
          const content = (rawList.content ?? []).map((raw) =>
            normalizeAdminUser(raw, balanceMap),
          );

          const result: AdminUserListResult = {
            content,
            totalElements: rawList.totalElements,
            totalPages: rawList.totalPages,
            page: rawList.currentPage,
            size: rawList.size ?? params?.size ?? 10,
          };

          set({
            adminUsers: result.content,
            adminPagination: {
              page: result.page,
              size: result.size,
              total: result.totalElements,
              totalPages: result.totalPages,
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
          const res = await authService.getUserById(id);
          const raw = unwrapData<RawAdminUser>(res);
          set({ selectedUser: normalizeAdminUser(raw) });
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
          throw err;
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
