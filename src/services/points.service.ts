import http from './http';
import type {
  PointsBalance,
  PointsTransaction,
  AdjustPointsRequest,
  AdminAdjustPointsRequest,
  AdminBalanceItem,
  AdminTransactionParams,
} from '../types/points.types';
import type { PageResult } from '../types/product.types';

export const pointsService = {
  // ── Employee ───────────────────────────────────────────────────────────

  getBalance: (): Promise<PointsBalance> =>
    http.get('/v1/point/balance'),

  getTransactions: (params?: { page?: number; size?: number; type?: 'EARN' | 'SPEND' }): Promise<PageResult<PointsTransaction>> =>
    http.get('/v1/point/transactions', { params }),

  // Admin only (legacy — kept for backward compat)
  adjustPoints: (data: AdjustPointsRequest): Promise<void> =>
    http.post('/v1/point/adjust', data),

  getUserBalance: (userId: number): Promise<PointsBalance> =>
    http.get(`/v1/point/balance/${userId}`),

  // ── Admin ──────────────────────────────────────────────────────────────

  adminAdjustPoints: (userId: string, amount: number, reason: string): Promise<void> =>
    http.post('/v1/point/admin/adjust', { userId, amount, reason } as AdminAdjustPointsRequest),

  adminGetBalances: (userId?: string): Promise<AdminBalanceItem[]> =>
    http.get('/v1/point/admin/balances', { params: userId ? { userId } : undefined }),

  adminGetTransactions: (params?: AdminTransactionParams): Promise<PageResult<PointsTransaction>> =>
    http.get('/v1/point/admin/transactions', { params }),
};
