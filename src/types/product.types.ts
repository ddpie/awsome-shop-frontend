export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount?: number;
  sortWeight?: number;
  status?: 'active' | 'inactive';
  parentId?: number | null;
  children?: Category[];
}

export interface Product {
  id: number;
  name: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  mainImage?: string | null;
  images?: string | null;
  pointsCost: number;
  pointsPrice?: number;
  marketPrice?: number;
  stock: number;
  categoryId: number;
  categoryName?: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  status: number | 'ACTIVE' | 'INACTIVE' | 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  // Admin-facing fields
  sku?: string;
  brand?: string;
  originalPrice?: number;
  specs?: string | null;
  colors?: string | null;
  deliveryMethod?: string | null;
  serviceGuarantee?: string | null;
  promotion?: string | null;
}

export interface ProductListParams {
  page?: number;
  size?: number;
  categoryId?: number;
  category?: string;
  keyword?: string;
  status?: string;
}

export interface AdminProductListParams {
  page?: number;
  size?: number;
  keyword?: string;
  category?: string;
  status?: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  page?: number;
  size?: number;
}
