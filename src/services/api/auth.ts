import request from '../request';
import type { LoginRequest, LoginResponse } from '../../types/api';

const AUTH_BASE = '/auth/api/v1/public/auth';

export function login(data: LoginRequest): Promise<LoginResponse> {
  return request.post<LoginResponse>(`${AUTH_BASE}/login`, data);
}

export function logout(): Promise<void> {
  return request.post<void>(`${AUTH_BASE}/logout`);
}
