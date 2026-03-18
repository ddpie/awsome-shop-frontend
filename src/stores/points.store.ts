import { create } from 'zustand';
import { pointsService } from '../services/points.service';
import type { PointsBalance, PointsTransaction } from '../types/points.types';
import type { PageResult } from '../types/product.types';

interface PointsState {
  balance: PointsBalance | null;
  transactions: PointsTransaction[];
  pagination: Omit<PageResult<unknown>, 'content'>;
  loading: boolean;
  error: string | null;

  fetchBalance: () => Promise<void>;
  fetchTransactions: (params?: { page?: number; size?: number }) => Promise<void>;
  clearError: () => void;
}

export const usePointsStore = create<PointsState>((set) => ({
  balance: null,
  transactions: [],
  pagination: { totalElements: 0, totalPages: 0, page: 0, size: 20 },
  loading: false,
  error: null,

  fetchBalance: async () => {
    try {
      const balance = await pointsService.getMyBalance();
      set({ balance });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    }
  },

  fetchTransactions: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await pointsService.getMyTransactions(params);
      const { content, ...pagination } = result;
      set({ transactions: content, pagination });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
