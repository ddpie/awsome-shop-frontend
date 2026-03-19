import http from './http';
import type { Product, Category, ProductListParams, PageResult, AdminProductListParams } from '../types/product.types';

export const productService = {
  // Employee-facing
  getProducts: (params?: ProductListParams): Promise<PageResult<Product>> =>
    http.get('/v1/product', { params }),

  getProductById: (id: string): Promise<Product> =>
    http.get(`/v1/product/${id}`),

  // Legacy alias used by admin pages
  getProduct: (id: number): Promise<Product> =>
    http.get(`/v1/product/${id}`),

  // Admin only (employee-facing legacy)
  createProduct: (data: Partial<Product>): Promise<Product> =>
    http.post('/v1/product', data),

  updateProduct: (id: number, data: Partial<Product>): Promise<Product> =>
    http.put(`/v1/product/${id}`, data),

  deleteProduct: (id: number): Promise<void> =>
    http.delete(`/v1/product/${id}`),

  // Admin product management
  adminGetProducts: (params?: AdminProductListParams): Promise<PageResult<Product>> =>
    http.get('/v1/product/admin/products', { params }),

  adminGetProductById: (id: string): Promise<Product> =>
    http.get(`/v1/product/admin/products/${id}`),

  adminCreateProduct: (data: Partial<Product>): Promise<Product> =>
    http.post('/v1/product/admin/products', data),

  adminUpdateProduct: (id: string, data: Partial<Product>): Promise<Product> =>
    http.put(`/v1/product/admin/products/${id}`, data),

  adminDeleteProduct: (id: string): Promise<void> =>
    http.delete(`/v1/product/admin/products/${id}`),

  uploadProductImage: (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);
    return http.post('/v1/product/file/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
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
