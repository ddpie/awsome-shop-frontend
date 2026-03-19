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
    http.post('/v1/public/order/update-status', { id, status }),

  // Admin — backend has no admin-specific order endpoints yet;
  // fall back to the public order endpoints which return all orders for admin role.
  adminGetOrders: (params?: { page?: number; size?: number; keyword?: string; status?: string }): Promise<PageResult<Order>> =>
    http.post('/v1/public/order/list', params ?? {}),

  adminGetOrderById: (id: string): Promise<Order> =>
    http.post('/v1/public/order/get', { id }),

  adminUpdateOrderStatus: (id: string, status: string): Promise<Order> =>
    http.post('/v1/public/order/update-status', { id, status }),
};
