/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export type IGatewayResponse = {
  id: string;
  transactionStatus?: string | null;
  bank_status?: string;
  date_time?: string;
  method?: string;
  sp_code?: string;
  sp_message?: string;
}

export type TPayment = {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  method:  'cash' | 'online';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  sp_order_id?: string;
  gatewayResponse?: IGatewayResponse;
  createdAt?: Date;
  updatedAt?: Date;
}
