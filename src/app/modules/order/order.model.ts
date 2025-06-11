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
    orderEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    orderPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{11}$/, 'Invalid phone number format'],
    },
    orderName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
    },
    method: {
      type: String,
      enum: ['online', 'cash'],
      required: [true, 'Payment method is required'],
    },
    shippingCost: {
      type: Number,
      required: true,
      min: [0, 'Shipping cost must be a non-negative number'],
      default: 0,
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
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder>('Order', OrderSchema);

export default Order;
