import http from './http';
import type { Order, CreateOrderRequest } from '../types/order.types';
import type { PageResult } from '../types/product.types';

export const orderService = {
  // Employee: place a new order
  placeOrder: (productId: string): Promise<Order> =>
    http.post('/v1/public/order/create', { productId }),

  // Employee: list own orders
  getOrders: (params?: { page?: number; size?: number; status?: string }): Promise<PageResult<Order>> =>
    http.post('/v1/public/order/list', params ?? {}),

  // Employee: get single order by id
  getOrderById: (id: string): Promise<Order> =>
    http.post('/v1/public/order/get', { id }),

  // Legacy aliases (kept for backward-compat)
  createOrder: (data: CreateOrderRequest): Promise<Order> =>
    http.post('/v1/public/order/create', data),

  getMyOrders: (params?: { page?: number; size?: number }): Promise<PageResult<Order>> =>
    http.post('/v1/public/order/list', params ?? {}),

  getOrder: (id: number): Promise<Order> =>
    http.post('/v1/public/order/get', { id }),

  getAllOrders: (params?: { page?: number; size?: number; status?: string }): Promise<PageResult<Order>> =>
    http.post('/v1/public/order/list', params ?? {}),

  updateOrderStatus: (id: number, status: string): Promise<Order> =>
    http.post('/v1/private/order/admin/update-status', { id, status }),

  // Admin
  adminGetOrders: (params?: { page?: number; size?: number; keyword?: string; status?: string }): Promise<PageResult<Order>> =>
    http.post('/v1/private/order/admin/list', params ?? {}),

  adminGetOrderById: (id: string): Promise<Order> =>
    http.post('/v1/private/order/admin/get', { id }),

  adminUpdateOrderStatus: (id: string, status: string): Promise<Order> =>
    http.post('/v1/private/order/admin/update-status', { id, status }),
};
