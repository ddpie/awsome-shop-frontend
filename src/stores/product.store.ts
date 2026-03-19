import { create } from 'zustand';
import { productService, categoryService } from '../services/product.service';
import type { Product, Category, ProductListParams, AdminProductListParams, PageResult } from '../types/product.types';

interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  pagination: Omit<PageResult<unknown>, 'content'>;
  loading: boolean;
  categoryLoading: boolean;
  error: string | null;

  // Admin state
  adminProducts: Product[];
  adminCurrentProduct: Product | null;
  adminLoading: boolean;
  adminError: string | null;
  adminPagination: Omit<PageResult<unknown>, 'content'>;

  fetchProducts: (params?: ProductListParams) => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchRelatedProducts: (category: string, excludeId: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createCategory: (data: { name: string; sortWeight: number; parentId?: number | null }) => Promise<void>;
  updateCategory: (id: number, data: { name: string; sortWeight: number }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  toggleCategoryStatus: (id: number, status: 'active' | 'inactive') => Promise<void>;
  clearError: () => void;

  // Admin actions
  fetchAdminProducts: (params?: AdminProductListParams) => Promise<void>;
  fetchAdminProductById: (id: string) => Promise<void>;
  createAdminProduct: (data: Partial<Product>) => Promise<Product>;
  updateAdminProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteAdminProduct: (id: string) => Promise<void>;
  clearAdminError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  currentProduct: null,
  relatedProducts: [],
  pagination: { totalElements: 0, totalPages: 0, page: 0, size: 20 },
  loading: false,
  categoryLoading: false,
  error: null,

  adminProducts: [],
  adminCurrentProduct: null,
  adminLoading: false,
  adminError: null,
  adminPagination: { totalElements: 0, totalPages: 0, page: 0, size: 20 },

  fetchProducts: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await productService.getProducts(params);
      const { content, ...pagination } = result;
      set({ products: content, pagination });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const product = await productService.getProduct(id);
      set({ currentProduct: product });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const product = await productService.getProductById(id);
      set({ currentProduct: product });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchRelatedProducts: async (category, excludeId) => {
    try {
      const result = await productService.getProducts({ category, page: 0, size: 4 });
      const related = result.content.filter((p) => String(p.id) !== excludeId);
      set({ relatedProducts: related.slice(0, 3) });
    } catch {
      set({ relatedProducts: [] });
    }
  },

  fetchCategories: async () => {
    set({ categoryLoading: true });
    try {
      const categories = await categoryService.getCategories();
      set({ categories });
    } catch {
      // API not ready yet — use mock data so the page is functional
      set({
        categories: [
          { id: 1, name: '数码电子', productCount: 38, sortWeight: 100, status: 'active', parentId: null, icon: 'devices' } as Category & { icon: string },
          { id: 2, name: '礼品卡券', productCount: 24, sortWeight: 90, status: 'active', parentId: null, icon: 'redeem' } as Category & { icon: string },
          { id: 3, name: '生活家居', productCount: 52, sortWeight: 80, status: 'active', parentId: null, icon: 'home' } as Category & { icon: string },
          { id: 4, name: '办公用品', productCount: 31, sortWeight: 70, status: 'active', parentId: null, icon: 'business_center' } as Category & { icon: string },
          { id: 5, name: '运动健康', productCount: 16, sortWeight: 60, status: 'inactive', parentId: null, icon: 'fitness_center' } as Category & { icon: string },
          { id: 11, name: '耳机音响', productCount: 12, sortWeight: 100, status: 'active', parentId: 1, icon: 'headphones' } as Category & { icon: string },
          { id: 12, name: '智能手表', productCount: 8, sortWeight: 90, status: 'active', parentId: 1, icon: 'watch' } as Category & { icon: string },
          { id: 13, name: '键盘鼠标', productCount: 18, sortWeight: 80, status: 'active', parentId: 1, icon: 'keyboard' } as Category & { icon: string },
          { id: 21, name: '购物卡', productCount: 15, sortWeight: 100, status: 'active', parentId: 2, icon: 'shopping_bag' } as Category & { icon: string },
          { id: 22, name: '餐饮卡券', productCount: 9, sortWeight: 85, status: 'active', parentId: 2, icon: 'restaurant' } as Category & { icon: string },
        ],
      });
    } finally {
      set({ categoryLoading: false });
    }
  },

  createCategory: async (data) => {
    await categoryService.createCategory(data);
    await get().fetchCategories();
  },

  updateCategory: async (id, data) => {
    await categoryService.updateCategory(id, data);
    await get().fetchCategories();
  },

  deleteCategory: async (id) => {
    await categoryService.deleteCategory(id);
    await get().fetchCategories();
  },

  toggleCategoryStatus: async (id, status) => {
    await categoryService.toggleStatus(id, status);
    await get().fetchCategories();
  },

  clearError: () => set({ error: null }),

  // Admin actions
  fetchAdminProducts: async (params) => {
    set({ adminLoading: true, adminError: null });
    try {
      const result = await productService.adminGetProducts(params);
      const { content, ...pagination } = result;
      set({ adminProducts: content, adminPagination: pagination });
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
    } finally {
      set({ adminLoading: false });
    }
  },

  fetchAdminProductById: async (id) => {
    set({ adminLoading: true, adminError: null });
    try {
      const product = await productService.adminGetProductById(id);
      set({ adminCurrentProduct: product });
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
    } finally {
      set({ adminLoading: false });
    }
  },

  createAdminProduct: async (data) => {
    const product = await productService.adminCreateProduct(data);
    return product;
  },

  updateAdminProduct: async (id, data) => {
    await productService.adminUpdateProduct(id, data);
    const current = get().adminCurrentProduct;
    if (current && String(current.id) === id) {
      set({ adminCurrentProduct: { ...current, ...data } });
    }
  },

  deleteAdminProduct: async (id) => {
    await productService.adminDeleteProduct(id);
    set((state) => ({
      adminProducts: state.adminProducts.filter((p) => String(p.id) !== id),
    }));
  },

  clearAdminError: () => set({ adminError: null }),
}));
