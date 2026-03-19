import { create } from 'zustand';
import { pointsService } from '../services/points.service';
import type { PointsBalance, PointsTransaction, PointsTransactionType, RawPointsTransaction } from '../types/points.types';
import type { PageResult } from '../types/product.types';

// Unwrap API envelope: { code, data } → data
function unwrapData<T>(res: unknown): T {
  const r = res as { data?: T };
  return r?.data !== undefined ? r.data : res as T;
}

// Map backend transaction type → frontend normalized type
const BACKEND_TYPE_MAP: Record<string, PointsTransactionType> = {
  REDEMPTION: 'SPEND',
  MANUAL_DEDUCT: 'SPEND',
  SYSTEM_DEDUCT: 'SPEND',
  MANUAL_ADD: 'EARN',
  MONTHLY_GRANT: 'EARN',
  SYSTEM_ADD: 'EARN',
  // Pass through if already normalized
  EARN: 'EARN',
  SPEND: 'SPEND',
  ADJUST: 'ADJUST',
  EXPIRE: 'EXPIRE',
};

// Normalize a single raw backend transaction → frontend PointsTransaction
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

interface PointsState {
  balance: PointsBalance | null;
  transactions: PointsTransaction[];
  pagination: { totalElements: number; totalPages: number; currentPage: number; size?: number };
  loading: boolean;
  error: string | null;

  fetchBalance: () => Promise<void>;
  fetchTransactions: (params?: { page?: number; size?: number; type?: 'EARN' | 'SPEND' }) => Promise<void>;
  clearError: () => void;
}

export const usePointsStore = create<PointsState>((set) => ({
  balance: null,
  transactions: [],
  pagination: { totalElements: 0, totalPages: 0, currentPage: 0 },
  loading: false,
  error: null,

  fetchBalance: async () => {
    try {
      const res = await pointsService.getBalance();
      // Check if API returned an error envelope (code !== SUCCESS/0)
      const envelope = res as { code?: number | string; data?: unknown; message?: string };
      if (envelope.data === null || envelope.data === undefined) {
        // No balance record — treat as 0
        set({ balance: { current: 0, totalEarned: 0, totalSpent: 0, redemptionCount: 0 } });
        return;
      }
      const raw = unwrapData<{ userId?: number; balance?: number; current?: number; totalEarned?: number; totalSpent?: number; redemptionCount?: number }>(res);
      // Backend returns { userId, balance } — derive missing stats from transactions if needed
      const balance: PointsBalance = {
        userId: raw.userId,
        balance: raw.balance,
        current: raw.current ?? raw.balance ?? 0,
        totalEarned: raw.totalEarned ?? 0,
        totalSpent: raw.totalSpent ?? 0,
        redemptionCount: raw.redemptionCount ?? 0,
      };
      set({ balance });

      // Backend doesn't provide totalEarned/totalSpent/redemptionCount,
      // so derive them from the full transaction history
      if (raw.totalEarned == null) {
        try {
          const txRes = await pointsService.getTransactions({ page: 0, size: 100 });
          const txResult = unwrapData<PageResult<RawPointsTransaction>>(txRes);
          const txs = txResult.content ?? [];
          let totalEarned = 0;
          let totalSpent = 0;
          let redemptionCount = 0;
          for (const tx of txs) {
            const mapped = BACKEND_TYPE_MAP[tx.type];
            if (mapped === 'EARN') {
              totalEarned += Math.abs(tx.amount);
            } else {
              totalSpent += Math.abs(tx.amount);
              redemptionCount++;
            }
          }
          set((s) => ({
            balance: s.balance ? { ...s.balance, totalEarned, totalSpent, redemptionCount } : s.balance,
          }));
        } catch {
          // Non-critical — stats stay at 0
        }
      }
    } catch (e: unknown) {
      // If balance record doesn't exist (new user), show 0 instead of error
      const axiosErr = e as { response?: { data?: { message?: string; code?: number | string } }; message?: string };
      const apiMsg = axiosErr?.response?.data?.message ?? axiosErr?.message ?? '';
      const apiCode = axiosErr?.response?.data?.code;
      const isNotFound = apiMsg.includes('不存在') || apiMsg.includes('not found') || apiCode === 500000;
      if (isNotFound) {
        set({ balance: { current: 0, totalEarned: 0, totalSpent: 0, redemptionCount: 0 } });
      } else {
        set({ error: apiMsg || 'Failed to load balance' });
      }
    }
  },

  fetchTransactions: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await pointsService.getTransactions(params);
      const result = unwrapData<PageResult<RawPointsTransaction>>(res);
      // Normalize backend fields → frontend fields
      const transactions = (result.content ?? []).map(normalizeTransaction);
      // Backend currentPage is 1-based, frontend expects 0-based
      const currentPage = (result.currentPage ?? 1) - 1;
      set({
        transactions,
        pagination: { totalElements: result.totalElements, totalPages: result.totalPages, currentPage, size: params?.size ?? 20 },
      });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
