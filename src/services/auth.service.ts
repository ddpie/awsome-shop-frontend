import http from './http';
import type { LoginRequest, LoginResponse, UserResponse, AdminUser, AdminUserListParams, AdminUserListResult } from '../types/auth.types';

export const authService = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    http.post('/v1/public/auth/login', data),

  logout: (): Promise<void> =>
    http.post('/v1/auth/logout'),

  getProfile: (): Promise<UserResponse> =>
    http.get('/v1/auth/users/me'),

  // ── Admin user management ──────────────────────────────────────────────

  getAdminUsers: (params?: AdminUserListParams): Promise<AdminUserListResult> =>
    http.get('/v1/public/auth/admin/users', { params }),

  getUserById: (id: string): Promise<AdminUser> =>
    http.get(`/v1/public/auth/admin/users/${id}`),

  updateUserStatus: (id: string, status: string): Promise<void> =>
    http.put(`/v1/public/auth/admin/users/${id}/status`, { status }),
};
