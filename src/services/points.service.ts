import http from './http';
import type { PointsBalance, PointsTransaction, AdjustPointsRequest } from '../types/points.types';
import type { PageResult } from '../types/product.types';

export const pointsService = {
  getMyBalance: (): Promise<PointsBalance> =>
    http.get('/v1/point/balance'),

  getMyTransactions: (params?: { page?: number; size?: number }): Promise<PageResult<PointsTransaction>> =>
    http.get('/v1/point/transactions', { params }),

  // Admin only
  adjustPoints: (data: AdjustPointsRequest): Promise<void> =>
    http.post('/v1/point/adjust', data),

  getUserBalance: (userId: number): Promise<PointsBalance> =>
    http.get(`/v1/point/balance/${userId}`),
};
