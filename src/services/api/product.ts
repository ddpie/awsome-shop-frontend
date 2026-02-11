import request from '../request';
import type {
  PageResult,
  ProductDTO,
  ListProductRequest,
  CreateProductRequest,
} from '../../types/api';

const PRODUCT_BASE = '/product/api/v1/public/product';

export function listProducts(data: ListProductRequest): Promise<PageResult<ProductDTO>> {
  return request.post<PageResult<ProductDTO>>(`${PRODUCT_BASE}/list`, data);
}

export function createProduct(data: CreateProductRequest): Promise<ProductDTO> {
  return request.post<ProductDTO>(`${PRODUCT_BASE}/create`, data);
}
