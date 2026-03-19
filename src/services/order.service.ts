import http from './http';
import type { Order, CreateOrderRequest } from '../types/order.types';
import type { PageResult } from '../types/product.types';

export const orderService = {
  // Employee: place a new order
  placeOrder: (productId: string): Promise<Order> =>
    http.post('/v1/order', { productId }),

  // Employee: list own orders
  getOrders: (params?: { page?: number; size?: number; status?: string }): Promise<PageResult<Order>> =>
    http.get('/v1/order', { params }),

  // Employee: get single order by id
  getOrderById: (id: string): Promise<Order> =>
    http.get(`/v1/order/${id}`),

  // --- kept for backward-compat (admin pages use these) ---
  createOrder: (data: CreateOrderRequest): Promise<Order> =>
    http.post('/v1/order', data),

  getMyOrders: (params?: { page?: number; size?: number }): Promise<PageResult<Order>> =>
    http.get('/v1/order', { params }),

  getOrder: (id: number): Promise<Order> =>
    http.get(`/v1/order/${id}`),

  // Admin only (legacy)
  getAllOrders: (params?: { page?: number; size?: number; status?: string }): Promise<PageResult<Order>> =>
    http.get('/v1/order/list', { params }),

  updateOrderStatus: (id: number, status: string): Promise<Order> =>
    http.put(`/v1/order/${id}/status`, { status }),

  // Admin v1 API
  adminGetOrders: (params?: { page?: number; size?: number; keyword?: string; status?: string }): Promise<PageResult<Order>> =>
    http.get('/v1/order/admin/orders', { params }),

  adminGetOrderById: (id: string): Promise<Order> =>
    http.get(`/v1/order/admin/orders/${id}`),

  adminUpdateOrderStatus: (id: string, status: string): Promise<Order> =>
    http.put(`/v1/order/admin/orders/${id}/status`, { status }),
};
