import http from './http';
import type { Product, Category, ProductListParams, PageResult } from '../types/product.types';

export const productService = {
  getProducts: (params?: ProductListParams): Promise<PageResult<Product>> =>
    http.get('/v1/product/list', { params }),

  getProduct: (id: number): Promise<Product> =>
    http.get(`/v1/product/${id}`),

  // Admin only
  createProduct: (data: Partial<Product>): Promise<Product> =>
    http.post('/v1/product', data),

  updateProduct: (id: number, data: Partial<Product>): Promise<Product> =>
    http.put(`/v1/product/${id}`, data),

  deleteProduct: (id: number): Promise<void> =>
    http.delete(`/v1/product/${id}`),
};

export const categoryService = {
  getCategories: (): Promise<Category[]> =>
    http.get('/v1/product/categories'),

  createCategory: (data: { name: string; sortWeight: number; parentId?: number | null }): Promise<Category> =>
    http.post('/v1/product/categories', data),

  updateCategory: (id: number, data: { name: string; sortWeight: number }): Promise<Category> =>
    http.put(`/v1/product/categories/${id}`, data),

  deleteCategory: (id: number): Promise<void> =>
    http.delete(`/v1/product/categories/${id}`),

  toggleStatus: (id: number, status: 'active' | 'inactive'): Promise<Category> =>
    http.patch(`/v1/product/categories/${id}/status`, { status }),
};
