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

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  employeeId: string;
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

// ── Raw backend types (before normalization) ───────────────────────────────

/** Raw user object from backend admin endpoints */
export interface RawAdminUser {
  id: number;
  username: string;
  name: string;
  employeeId: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/** Raw paginated response from POST /v1/admin/user/list (inside envelope .data) */
export interface RawAdminUserListResult {
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: RawAdminUser[];
}

// ── Frontend-normalized types (used by UI components) ──────────────────────

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
