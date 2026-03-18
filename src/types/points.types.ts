export type PointsTransactionType = 'earn' | 'redeem' | 'adjust' | 'expire';

export interface PointsTransaction {
  id: number;
  userId: number;
  type: PointsTransactionType;
  amount: number;
  balance: number;
  description: string;
  createdAt: string;
}

export interface PointsBalance {
  userId: number;
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
}

export interface AdjustPointsRequest {
  userId: number;
  amount: number;
  description: string;
}
