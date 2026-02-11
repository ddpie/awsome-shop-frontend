import request from '../request';
import type { PageResult, PointRuleDTO, ListPointRuleRequest } from '../../types/api';

const POINT_RULE_BASE = '/point/api/v1/admin/point-rule';

export function listPointRules(data: ListPointRuleRequest): Promise<PageResult<PointRuleDTO>> {
  return request.post<PageResult<PointRuleDTO>>(`${POINT_RULE_BASE}/list`, data);
}
