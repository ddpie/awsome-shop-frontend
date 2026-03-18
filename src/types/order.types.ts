export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface DeliveryInfo {
  recipientName: string;
  phone: string;
  address: string;
  note?: string;
}

export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  userName?: string;
  productId: number;
  productName: string;
  productImage?: string;
  pointsCost: number;
  quantity: number;
  status: OrderStatus;
  deliveryInfo?: DeliveryInfo;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  productId: number;
  quantity: number;
  deliveryInfo: DeliveryInfo;
}
