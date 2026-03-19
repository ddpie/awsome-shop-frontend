import { create } from 'zustand';
import { orderService } from '../services/order.service';
import type { Order, CreateOrderRequest } from '../types/order.types';
import type { PageResult } from '../types/product.types';

// Unwrap API envelope: { code, data } → data
function unwrapData<T>(res: unknown): T {
  const r = res as { data?: T };
  return r?.data !== undefined ? r.data : res as T;
}

// Normalize backend order to frontend shape
// Backend sends: productImageUrl, no orderNo/userName/quantity
// Frontend expects: productImage, orderNo, userName, quantity
function normalizeOrder(raw: Record<string, unknown>): Order {
  const o = raw as Record<string, unknown> & Order;
  return {
    ...o,
    orderNo: o.orderNo ?? `ORD${String(o.id).padStart(8, '0')}`,
    userName: o.userName ?? undefined,
    productImage: o.productImage ?? (o.productImageUrl as string | undefined) ?? undefined,
    quantity: o.quantity ?? 1,
  } as Order;
}

// Normalize a page result of orders
function normalizePageResult(raw: PageResult<Order>): PageResult<Order> {
  return {
    ...raw,
    content: Array.isArray(raw.content)
      ? raw.content.map((o) => normalizeOrder(o as unknown as Record<string, unknown>))
      : [],
  };
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  pagination: { totalElements: number; totalPages: number; currentPage: number; page?: number; size?: number };
  loading: boolean;
  error: string | null;

  fetchOrders: (params?: { page?: number; size?: number; status?: string }) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  placeOrder: (productId: string) => Promise<Order>;

  fetchMyOrders: (params?: { page?: number; size?: number }) => Promise<void>;
  fetchOrder: (id: number) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;

  adminOrders: Order[];
  adminCurrentOrder: Order | null;
  adminLoading: boolean;
  adminError: string | null;
  adminPagination: { totalElements: number; totalPages: number; currentPage: number; page?: number; size?: number };
  fetchAdminOrders: (params?: { page?: number; size?: number; keyword?: string; status?: string }) => Promise<void>;
  fetchAdminOrderById: (id: string) => Promise<void>;
  updateAdminOrderStatus: (id: string, status: string) => Promise<void>;

  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  pagination: { totalElements: 0, totalPages: 0, currentPage: 0 },
  loading: false,
  error: null,

  adminOrders: [],
  adminCurrentOrder: null,
  adminLoading: false,
  adminError: null,
  adminPagination: { totalElements: 0, totalPages: 0, currentPage: 0 },

  fetchOrders: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getOrders(params);
      const result = normalizePageResult(unwrapData<PageResult<Order>>(res));
      set({
        orders: result.content,
        pagination: { totalElements: result.totalElements, totalPages: result.totalPages, currentPage: result.currentPage ?? 0, size: params?.size ?? 20 },
      });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null, currentOrder: null });
    try {
      const res = await orderService.getOrderById(id);
      set({ currentOrder: normalizeOrder(unwrapData<Record<string, unknown>>(res) as Record<string, unknown>) });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  placeOrder: async (productId) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.placeOrder(productId);
      const order = normalizeOrder(unwrapData<Record<string, unknown>>(res) as Record<string, unknown>);
      set({ currentOrder: order });
      return order;
    } catch (e: unknown) {
      set({ error: (e as Error).message });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  fetchMyOrders: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getMyOrders(params);
      const result = normalizePageResult(unwrapData<PageResult<Order>>(res));
      set({
        orders: result.content,
        pagination: { totalElements: result.totalElements, totalPages: result.totalPages, currentPage: result.currentPage ?? 0 },
      });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getOrder(id);
      set({ currentOrder: normalizeOrder(unwrapData<Record<string, unknown>>(res) as Record<string, unknown>) });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.createOrder(data);
      const order = normalizeOrder(unwrapData<Record<string, unknown>>(res) as Record<string, unknown>);
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

  fetchAdminOrders: async (params) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await orderService.adminGetOrders(params);
      const result = normalizePageResult(unwrapData<PageResult<Order>>(res));
      set({
        adminOrders: result.content,
        adminPagination: { totalElements: result.totalElements, totalPages: result.totalPages, currentPage: result.currentPage ?? 0, size: params?.size ?? 20 },
      });
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
    } finally {
      set({ adminLoading: false });
    }
  },

  fetchAdminOrderById: async (id) => {
    // Try to find the order from the already-loaded admin list first
    const existing = useOrderStore.getState().adminOrders.find((o) => String(o.id) === id);
    if (existing) {
      set({ adminCurrentOrder: existing, adminLoading: false, adminError: null });
      return;
    }
    set({ adminLoading: true, adminError: null, adminCurrentOrder: null });
    try {
      // Fallback: use public/order/get (works if current user is the order owner)
      const res = await orderService.getOrderById(id);
      set({ adminCurrentOrder: normalizeOrder(unwrapData<Record<string, unknown>>(res) as Record<string, unknown>) });
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
    } finally {
      set({ adminLoading: false });
    }
  },

  updateAdminOrderStatus: async (id, status) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await orderService.adminUpdateOrderStatus(id, status);
      const raw = unwrapData<Record<string, unknown>>(res);
      const updated = raw ? normalizeOrder(raw as Record<string, unknown>) : null;
      set((state) => ({
        adminOrders: state.adminOrders.map((o) => (String(o.id) === id ? { ...o, status: (updated?.status ?? status) as Order['status'] } : o)),
        adminCurrentOrder: state.adminCurrentOrder && String(state.adminCurrentOrder.id) === id
          ? { ...state.adminCurrentOrder, status: (updated?.status ?? status) as Order['status'] }
          : state.adminCurrentOrder,
      }));
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
      throw e;
    } finally {
      set({ adminLoading: false });
    }
  },
}));
