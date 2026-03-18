import http from './http';
import type { Order, CreateOrderRequest } from '../types/order.types';
import type { PageResult } from '../types/product.types';

export const orderService = {
  createOrder: (data: CreateOrderRequest): Promise<Order> =>
    http.post('/v1/order', data),

  getMyOrders: (params?: { page?: number; size?: number }): Promise<PageResult<Order>> =>
    http.get('/v1/order/my', { params }),

  getOrder: (id: number): Promise<Order> =>
    http.get(`/v1/order/${id}`),

  // Admin only
  getAllOrders: (params?: { page?: number; size?: number; status?: string }): Promise<PageResult<Order>> =>
    http.get('/v1/order/list', { params }),

  updateOrderStatus: (id: number, status: string): Promise<Order> =>
    http.put(`/v1/order/${id}/status`, { status }),
};
