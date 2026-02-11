/**
 * Backend unified response wrapper.
 * All backend APIs return this structure through the gateway.
 */
export interface Result<T = unknown> {
  code: string;
  message: string;
  data: T;
}

/**
 * Backend paginated response.
 */
export interface PageResult<T> {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: T[];
}

// ---- Auth ----

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  nickname: string;
  role: string;
}

// ---- Product ----

export interface ProductDTO {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string;
  pointsPrice: number;
  marketPrice: number;
  stock: number;
  soldCount: number;
  status: number;
  description: string;
  imageUrl: string;
  subtitle: string;
  deliveryMethod: string;
  serviceGuarantee: string;
  promotion: string;
  colors: string;
  specs: Record<string, string>[];
  createdAt: string;
  updatedAt: string;
}

export interface ListProductRequest {
  page?: number;
  size?: number;
  name?: string;
  category?: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  category: string;
  brand?: string;
  pointsPrice: number;
  marketPrice?: number;
  stock?: number;
  status?: number;
  description?: string;
  imageUrl?: string;
  subtitle?: string;
  deliveryMethod?: string;
  serviceGuarantee?: string;
  promotion?: string;
  colors?: string;
  specs?: Record<string, string>[];
}

// ---- Category ----

export interface CategoryDTO {
  id: number;
  name: string;
  parentId: number | null;
  icon: string;
  sortOrder: number;
  status: number;
  description: string;
  productCount: number;
  children: CategoryDTO[];
}

export interface ListCategoryRequest {
  name?: string;
  status?: number;
}
