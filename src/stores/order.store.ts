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

  // Employee actions
  fetchOrders: (params?: { page?: number; size?: number; status?: string }) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  placeOrder: (productId: string) => Promise<Order>;

  // Legacy / shared actions (kept for admin pages)
  fetchMyOrders: (params?: { page?: number; size?: number }) => Promise<void>;
  fetchOrder: (id: number) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;

  // Admin actions
  adminOrders: Order[];
  adminCurrentOrder: Order | null;
  adminLoading: boolean;
  adminError: string | null;
  adminPagination: Omit<PageResult<unknown>, 'content'>;
  fetchAdminOrders: (params?: { page?: number; size?: number; keyword?: string; status?: string }) => Promise<void>;
  fetchAdminOrderById: (id: string) => Promise<void>;
  updateAdminOrderStatus: (id: string, status: string) => Promise<void>;

  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  pagination: { totalElements: 0, totalPages: 0, page: 0, size: 20 },
  loading: false,
  error: null,

  // Admin state
  adminOrders: [],
  adminCurrentOrder: null,
  adminLoading: false,
  adminError: null,
  adminPagination: { totalElements: 0, totalPages: 0, page: 0, size: 20 },

  fetchOrders: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await orderService.getOrders(params);
      const { content, ...pagination } = result;
      set({ orders: content, pagination });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null, currentOrder: null });
    try {
      const order = await orderService.getOrderById(id);
      set({ currentOrder: order });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  placeOrder: async (productId) => {
    set({ loading: true, error: null });
    try {
      const order = await orderService.placeOrder(productId);
      set({ currentOrder: order });
      return order;
    } catch (e: unknown) {
      set({ error: (e as Error).message });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  // Legacy methods kept for admin pages
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

  // Admin actions
  fetchAdminOrders: async (params) => {
    set({ adminLoading: true, adminError: null });
    try {
      const result = await orderService.adminGetOrders(params);
      const { content, ...pagination } = result;
      set({ adminOrders: content, adminPagination: pagination });
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
    } finally {
      set({ adminLoading: false });
    }
  },

  fetchAdminOrderById: async (id) => {
    set({ adminLoading: true, adminError: null, adminCurrentOrder: null });
    try {
      const order = await orderService.adminGetOrderById(id);
      set({ adminCurrentOrder: order });
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
    } finally {
      set({ adminLoading: false });
    }
  },

  updateAdminOrderStatus: async (id, status) => {
    set({ adminLoading: true, adminError: null });
    try {
      const updated = await orderService.adminUpdateOrderStatus(id, status);
      set((state) => ({
        adminOrders: state.adminOrders.map((o) => (String(o.id) === id ? updated : o)),
        adminCurrentOrder: state.adminCurrentOrder && String(state.adminCurrentOrder.id) === id ? updated : state.adminCurrentOrder,
      }));
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
      throw e;
    } finally {
      set({ adminLoading: false });
    }
  },
}));
