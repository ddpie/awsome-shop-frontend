export type PointsTransactionType = 'EARN' | 'SPEND' | 'ADJUST' | 'EXPIRE';

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

export interface PointsBalance {
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
