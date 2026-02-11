import request from '../request';
import type { CategoryDTO, ListCategoryRequest } from '../../types/api';

const CATEGORY_BASE = '/product/api/v1/public/category';

export function listCategories(data: ListCategoryRequest): Promise<CategoryDTO[]> {
  return request.post<CategoryDTO[]>(`${CATEGORY_BASE}/list`, data);
}
