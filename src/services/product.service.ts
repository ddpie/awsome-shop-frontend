import http from './http';
import type { Product, Category, ProductListParams, PageResult, AdminProductListParams } from '../types/product.types';

export const productService = {
  // Employee-facing
  getProducts: (params?: ProductListParams): Promise<PageResult<Product>> =>
    http.post('/v1/public/product/list', params ?? {}),

  getProductById: (id: string): Promise<Product> =>
    http.post('/v1/public/product/get', { id }),

  // Legacy alias used by admin pages
  getProduct: (id: number): Promise<Product> =>
    http.post('/v1/public/product/get', { id }),

  // Admin product management
  adminGetProducts: (params?: AdminProductListParams): Promise<PageResult<Product>> =>
    http.post('/v1/admin/product/list', params ?? {}),

  adminGetProductById: (id: string): Promise<Product> =>
    http.post('/v1/admin/product/get', { id }),

  adminCreateProduct: (data: Partial<Product>): Promise<Product> =>
    http.post('/v1/admin/product/create', data),

  adminUpdateProduct: (id: string, data: Partial<Product>): Promise<Product> =>
    http.post('/v1/admin/product/update', { id, ...data }),

  adminDeleteProduct: (id: string): Promise<void> =>
    http.post('/v1/admin/product/delete', { id }),

  uploadProductImage: (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);
    return http.post('/v1/public/file/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const categoryService = {
  getCategories: (): Promise<Category[]> =>
    http.post('/v1/public/category/list'),

  createCategory: (data: { name: string; sortWeight: number; parentId?: number | null }): Promise<Category> =>
    http.post('/v1/admin/category/create', data),

  updateCategory: (id: number, data: { name: string; sortWeight: number }): Promise<Category> =>
    http.post('/v1/admin/category/update', { id, ...data }),

  deleteCategory: (id: number): Promise<void> =>
    http.post('/v1/admin/category/delete', { id }),

  toggleStatus: (id: number, status: 'active' | 'inactive'): Promise<Category> =>
    http.post('/v1/admin/category/update', { id, status }),
};
