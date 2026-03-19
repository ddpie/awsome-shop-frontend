import http from './http';
import type {
  PointsBalance,
  PointsTransaction,
  PointsTransactionType,
  RawPointsTransaction,
  AdjustPointsRequest,
  AdminBalanceItem,
  RawAdminBalanceItem,
  AdminTransactionParams,
} from '../types/points.types';
import type { PageResult } from '../types/product.types';

/** Unwrap API envelope: { code, data, message } → data */
function unwrapData<T>(res: unknown): T {
  const r = res as { data?: T };
  return r?.data !== undefined ? r.data : (res as T);
}

/** Map backend transaction type → frontend normalized type */
const BACKEND_TYPE_MAP: Record<string, PointsTransactionType> = {
  REDEMPTION: 'SPEND',
  MANUAL_DEDUCT: 'SPEND',
  SYSTEM_DEDUCT: 'SPEND',
  MANUAL_ADD: 'EARN',
  MONTHLY_GRANT: 'EARN',
  SYSTEM_ADD: 'EARN',
  EARN: 'EARN',
  SPEND: 'SPEND',
  ADJUST: 'ADJUST',
  EXPIRE: 'EXPIRE',
};

/** Normalize a single raw backend transaction → frontend PointsTransaction */
function normalizeTransaction(raw: RawPointsTransaction): PointsTransaction {
  return {
    id: raw.id,
    userId: raw.userId,
    type: BACKEND_TYPE_MAP[raw.type] ?? 'SPEND',
    amount: raw.amount,
    balance: raw.balanceAfter,
    description: raw.remark,
    createdAt: raw.createdAt,
    operator: raw.operatorId != null ? String(raw.operatorId) : undefined,
  };
}

/** Normalize raw backend balance → frontend AdminBalanceItem */
function normalizeBalance(raw: RawAdminBalanceItem): AdminBalanceItem {
  return {
    userId: String(raw.userId),
    current: raw.balance,
    totalEarned: 0,
    totalSpent: 0,
    redemptionCount: 0,
  };
}

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
    http.post('/v1/point/admin/adjust', { userId: Number(userId), amount, remark: reason }),

  adminGetBalances: async (userId?: string): Promise<AdminBalanceItem[]> => {
    const res = await http.get('/v1/point/admin/balances', { params: userId ? { userId } : undefined });
    const raw = unwrapData<{ content?: RawAdminBalanceItem[] }>(res);
    return (raw?.content ?? []).map(normalizeBalance);
  },

  adminGetTransactions: async (params?: AdminTransactionParams): Promise<PageResult<PointsTransaction>> => {
    const res = await http.get(`/v1/point/admin/transactions/${params?.userId ?? ''}`, {
      params: params ? { page: params.page, size: params.size, type: params.type } : undefined,
    });
    const raw = unwrapData<{ content?: RawPointsTransaction[]; currentPage?: number; totalElements?: number; totalPages?: number; size?: number }>(res);
    return {
      content: (raw?.content ?? []).map(normalizeTransaction),
      totalElements: raw?.totalElements ?? 0,
      totalPages: raw?.totalPages ?? 0,
      currentPage: (raw?.currentPage ?? 1) - 1, // backend 1-based → frontend 0-based
      size: raw?.size ?? params?.size ?? 10,
    };
  },
};
