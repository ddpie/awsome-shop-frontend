export type UserRole = 'EMPLOYEE' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface UserInfo {
  id?: number;
  username: string;
  displayName: string;
  role: UserRole;
  points?: number;
  avatar?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  code: string;
  message: string;
  data: {
    token: string;
    expiresIn: number;
  };
}

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  employeeId: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// ── Admin user management ──────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  department?: string;
  role: UserRole;
  status: UserStatus;
  points: number;
  redemptionCount: number;
  createdAt?: string;
}

export interface AdminUserListParams {
  page?: number;
  size?: number;
  keyword?: string;
  role?: string;
}

export interface AdminUserListResult {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
