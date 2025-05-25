/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, model } from 'mongoose';
import { TBrand } from './brand.interface';

const BrandSchema = new Schema<TBrand>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    seoKeywords: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Middleware to exclude deleted records from find queries
BrandSchema.pre(/^find/, function (this: any, next) {
  this.find({ isDeleted: false });
  next();
});

// Middleware to exclude deleted records from aggregation pipelines
BrandSchema.pre('aggregate', function (this: mongoose.Aggregate<any[]>, next) {
  const pipeline = this.pipeline();
  const hasMatch = pipeline.some(stage => '$match' in stage);
  if (!hasMatch) {
    pipeline.unshift({ $match: { isDeleted: false } });
  }
  next();
});

export const BrandModel = model<TBrand>('Brand', BrandSchema);
