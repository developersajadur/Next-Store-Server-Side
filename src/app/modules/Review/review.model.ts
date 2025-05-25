import mongoose, { Schema } from "mongoose";
import { TReview } from "./review.interface";

const ReviewSchema = new Schema<TReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review = mongoose.model<TReview>("Review", ReviewSchema);
