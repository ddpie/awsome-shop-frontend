export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
  | 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface DeliveryInfo {
  recipientName: string;
  phone: string;
  address: string;
  note?: string;
}

export interface Order {
  id: number;
  orderNo?: string;
  userId: number;
  userName?: string;
  productId: number;
  productName: string;
  productImage?: string;
  productImageUrl?: string | null;
  pointsCost: number;
  quantity?: number;
  status: OrderStatus;
  deliveryInfo?: DeliveryInfo;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  productId: number;
  quantity?: number;
  deliveryInfo?: DeliveryInfo;
}
