/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { model, Schema } from 'mongoose';
import { TBicycle } from './bicycle.interface';

const BicycleSchema = new Schema<TBicycle>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: [String],
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    colors: {
      type: [String],
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, //* Automatically adds createdAt and updatedAt fields
  },
);

// pre middleware

// Middleware to exclude deleted records
BicycleSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  this.find({ isDeleted: false }); // Correct way to filter deleted items
  next();
});

BicycleSchema.pre(
  'aggregate',
  function (this: mongoose.Aggregate<any[]>, next) {
    const pipeline = this.pipeline() as mongoose.PipelineStage[];

    // Ensure $match isn't already added to avoid duplicates
    if (
      !pipeline.some((stage) => (stage as mongoose.PipelineStage.Match).$match)
    ) {
      this.pipeline().unshift({ $match: { isDeleted: false } });
    }
    next();
  },
);

export const BicycleModel = model<TBicycle>('Bicycle', BicycleSchema);
