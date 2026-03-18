export type UserRole = 'employee' | 'admin';

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
  token: string;
  user: UserInfo;
}
