import http from './http';
import type { LoginRequest, LoginResponse, UserResponse, AdminUserListParams } from '../types/auth.types';

export const authService = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    http.post('/v1/public/auth/login', data),

  logout: (): Promise<void> =>
    http.post('/v1/auth/logout'),

  getProfile: (): Promise<UserResponse> =>
    http.post('/v1/private/user/current'),

  // ── Admin user management ──────────────────────────────────────────────

  getAdminUsers: (params?: AdminUserListParams): Promise<unknown> =>
    http.post('/v1/admin/user/list', params ?? {}),

  getUserById: (id: string): Promise<unknown> =>
    http.post('/v1/admin/user/get', { id: Number(id) }),

  updateUserStatus: (id: string, status: string): Promise<void> =>
    http.post('/v1/admin/user/update', { id: Number(id), status }),
};
