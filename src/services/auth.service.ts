import http from './http';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

export const authService = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    http.post('/v1/public/auth/login', data),

  logout: (): Promise<void> =>
    http.post('/v1/auth/logout'),

  getProfile: (): Promise<LoginResponse['user']> =>
    http.get('/v1/auth/profile'),
};
