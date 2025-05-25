import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    shippingCost: {
      type: Number,
      required: true,
      min: [0, 'Shipping cost must be a non-negative number'],
    },
    couponCode: {
      type: Number,
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price must be a non-negative number'],
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Returned',
      ],
      default: 'Pending',
    },
    DeliveredAt: {
      type: Date
    },
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>('Order', OrderSchema);

export default Order;
