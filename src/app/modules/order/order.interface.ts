import { Types } from 'mongoose';

export const OrderStatus = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
  Returned: 'Returned',
} as const;

export type IOrderStatus = keyof typeof OrderStatus;

export interface IOrder {
  userId: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  shippingAddress: string;
  shippingCost: number;
  couponCode?: number;
  totalPrice: number;
  method: 'online' | 'cash';
  orderPhone: string;
  orderName: string;
  orderEmail: string;
  note?: string;
  isPaid: 'pending' | 'paid' | 'failed' | 'refunded';
  status: IOrderStatus;
  paidAt?: Date;
  DeliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
