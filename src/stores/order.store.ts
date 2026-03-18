import { create } from 'zustand';
import { orderService } from '../services/order.service';
import type { Order, CreateOrderRequest } from '../types/order.types';
import type { PageResult } from '../types/product.types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  pagination: Omit<PageResult<unknown>, 'content'>;
  loading: boolean;
  error: string | null;

  fetchMyOrders: (params?: { page?: number; size?: number }) => Promise<void>;
  fetchOrder: (id: number) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  pagination: { totalElements: 0, totalPages: 0, page: 0, size: 20 },
  loading: false,
  error: null,

  fetchMyOrders: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await orderService.getMyOrders(params);
      const { content, ...pagination } = result;
      set({ orders: content, pagination });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const order = await orderService.getOrder(id);
      set({ currentOrder: order });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (data) => {
    set({ loading: true, error: null });
    try {
      const order = await orderService.createOrder(data);
      set({ currentOrder: order });
      return order;
    } catch (e: unknown) {
      set({ error: (e as Error).message });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
