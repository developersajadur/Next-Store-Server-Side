import mongoose, { Schema } from "mongoose";
import { TPayment } from "./payment.interface";


const PaymentSchema: Schema = new Schema<TPayment>(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required'] },
      orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: [true, 'Order is required'] },
      method: {
        type: String,
        enum: ['cash', 'card', 'online', 'shurjo-pay'],
        required: [true, 'Payment method is required'],
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        required: [true, 'Payment status is required'],
        default: 'pending',
      },
      transactionId: { type: String, unique: [true, 'This transactionId already exist'] },
      amount: { type: Number, required: [true, 'Amount is required'] },
      gatewayResponse: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
  );
  
  
 export const PaymentModel = mongoose.model<TPayment>('Payment', PaymentSchema);
  