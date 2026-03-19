// Frontend-normalized type (used by UI components)
export type PointsTransactionType = 'EARN' | 'SPEND' | 'ADJUST' | 'EXPIRE';

// Backend raw type values
export type BackendTransactionType = 'REDEMPTION' | 'MANUAL_ADD' | 'MANUAL_DEDUCT' | 'MONTHLY_GRANT' | 'SYSTEM_ADD' | 'SYSTEM_DEDUCT';

export interface PointsTransaction {
  id: number;
  userId: number;
  type: PointsTransactionType;
  amount: number;
  balance: number;
  description: string;
  createdAt: string;
  operator?: string;
}

// Raw shape from backend before normalization
export interface RawPointsTransaction {
  id: number;
  userId: number;
  type: BackendTransactionType;
  amount: number;
  balanceAfter: number;
  referenceId?: number | null;
  operatorId?: number | null;
  remark: string;
  createdAt: string;
}

export interface PointsBalance {
  userId?: number;
  balance?: number;
  current: number;
  totalEarned: number;
  totalSpent: number;
  redemptionCount: number;
}

export interface AdjustPointsRequest {
  userId: number;
  amount: number;
  description: string;
}

// ── Admin points ───────────────────────────────────────────────────────────

export interface AdminAdjustPointsRequest {
  userId: string;
  amount: number;
  reason: string;
}

/** Raw balance item from backend GET /v1/point/admin/balances */
export interface RawAdminBalanceItem {
  userId: number;
  balance: number;
}

/** Frontend-normalized balance item (used by UI components) */
export interface AdminBalanceItem {
  userId: string;
  displayName?: string;
  current: number;
  totalEarned: number;
  totalSpent: number;
  redemptionCount: number;
}

export interface AdminTransactionParams {
  userId?: string;
  type?: string;
  page?: number;
  size?: number;
}
