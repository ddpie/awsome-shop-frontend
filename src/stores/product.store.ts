import { create } from 'zustand';
import { productService, categoryService } from '../services/product.service';
import type { Product, Category, ProductListParams, AdminProductListParams, PageResult } from '../types/product.types';

// Normalize backend product to frontend shape
// Backend sends: pointsPrice, marketPrice, status (0|1), mainImage
// Frontend expects: pointsCost, originalPrice, status ('ACTIVE'|'INACTIVE'), imageUrl
function normalizeProduct(raw: Record<string, unknown>): Product {
  const p = raw as Record<string, unknown> & Product;
  // pointsPrice → pointsCost
  const pointsCost = (p.pointsCost as number) ?? (p.pointsPrice as number) ?? 0;
  // marketPrice → originalPrice
  const originalPrice = (p.originalPrice as number) ?? (p.marketPrice as number) ?? undefined;
  // status: backend 0 = active, 1 = inactive (numeric) → frontend string
  let status: Product['status'] = p.status;
  if (typeof p.status === 'number') {
    status = p.status === 0 ? 'ACTIVE' : 'INACTIVE';
  }
  // mainImage → imageUrl (backend has no imageUrl field)
  const imageUrl = p.imageUrl ?? p.mainImage ?? undefined;
  return { ...p, pointsCost, originalPrice, status, imageUrl } as Product;
}

// Unwrap API envelope: { code, data } → data
function unwrapData<T>(res: unknown): T {
  const r = res as { data?: T };
  return r?.data !== undefined ? r.data : res as T;
}

// Normalize a single backend category node to frontend shape
// Backend sends: sortOrder, no status/description/productCount/parentId
// Frontend expects: sortWeight, status, parentId, etc.
function normalizeCategoryNode(raw: Record<string, unknown>, parentId: number | null): Category {
  return {
    id: raw.id as number,
    name: raw.name as string,
    description: (raw.description as string) ?? undefined,
    productCount: (raw.productCount as number) ?? undefined,
    sortWeight: (raw.sortWeight as number) ?? (raw.sortOrder as number) ?? 0,
    status: (raw.status as Category['status']) ?? 'active',
    parentId,
    children: undefined, // flattened — children tracked via parentId
  };
}

// Flatten nested category tree from backend into a flat list with parentId
function flattenCategories(tree: Record<string, unknown>[]): Category[] {
  const result: Category[] = [];
  for (const node of tree) {
    result.push(normalizeCategoryNode(node, null));
    const children = node.children as Record<string, unknown>[] | undefined;
    if (Array.isArray(children)) {
      for (const child of children) {
        result.push(normalizeCategoryNode(child, node.id as number));
        // Support one more nesting level if needed
        const grandchildren = child.children as Record<string, unknown>[] | undefined;
        if (Array.isArray(grandchildren)) {
          for (const gc of grandchildren) {
            result.push(normalizeCategoryNode(gc, child.id as number));
          }
        }
      }
    }
  }
  return result;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  pagination: Omit<PageResult<unknown>, 'content'>;
  loading: boolean;
  categoryLoading: boolean;
  error: string | null;

  /** Global search keyword set by the header search bar */
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;

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
  pagination: { totalElements: 0, totalPages: 0, currentPage: 0, page: 0, size: 20 },
  loading: false,
  categoryLoading: false,
  error: null,

  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  adminProducts: [],
  adminCurrentProduct: null,
  adminLoading: false,
  adminError: null,
  adminPagination: { totalElements: 0, totalPages: 0, currentPage: 0, page: 0, size: 20 },

  fetchProducts: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.getProducts(params);
      // API returns { code, data: { content, currentPage, ... } }
      const result = (res as unknown as { data: PageResult<Product> }).data ?? res;
      const { content, ...pagination } = result;
      set({ products: (content as unknown as Record<string, unknown>[]).map(normalizeProduct), pagination: { totalElements: pagination.totalElements, totalPages: pagination.totalPages, currentPage: pagination.currentPage ?? 0, page: pagination.currentPage ?? 0, size: params?.size ?? 20 } });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.getProduct(id);
      set({ currentProduct: normalizeProduct(unwrapData<Record<string, unknown>>(res) as Record<string, unknown>) });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.getProductById(id);
      set({ currentProduct: normalizeProduct(unwrapData<Record<string, unknown>>(res) as Record<string, unknown>) });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchRelatedProducts: async (category, excludeId) => {
    try {
      const res = await productService.getProducts({ category, page: 0, size: 4 });
      const result = unwrapData<PageResult<Product>>(res);
      const related = result.content.filter((p) => String(p.id) !== excludeId);
      set({ relatedProducts: related.slice(0, 3).map((p) => normalizeProduct(p as unknown as Record<string, unknown>)) });
    } catch {
      set({ relatedProducts: [] });
    }
  },

  fetchCategories: async () => {
    set({ categoryLoading: true });
    try {
      const res = await categoryService.getCategories();
      const raw = unwrapData<Record<string, unknown>[]>(res);
      const categories = Array.isArray(raw) ? flattenCategories(raw) : [];
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
      const res = await productService.adminGetProducts(params);
      const result = unwrapData<PageResult<Product>>(res);
      const { content, ...pagination } = result;
      set({ adminProducts: (content as unknown as Record<string, unknown>[]).map(normalizeProduct), adminPagination: { totalElements: pagination.totalElements, totalPages: pagination.totalPages, currentPage: pagination.currentPage ?? 0, page: pagination.currentPage ?? 0, size: params?.size ?? 20 } });
    } catch (e: unknown) {
      set({ adminError: (e as Error).message });
    } finally {
      set({ adminLoading: false });
    }
  },

  fetchAdminProductById: async (id) => {
    set({ adminLoading: true, adminError: null });
    try {
      let res: unknown;
      try {
        res = await productService.adminGetProductById(id);
      } catch {
        // Admin get endpoint may not be available — fall back to public
        res = await productService.getProductById(id);
      }
      set({ adminCurrentProduct: normalizeProduct(unwrapData<Record<string, unknown>>(res) as Record<string, unknown>) });
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
