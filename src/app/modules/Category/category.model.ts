/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const CategorySchema = new Schema<TCategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
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
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically exclude deleted documents
CategorySchema.pre(/^find/, function (this: any, next) {
  this.find({ isDeleted: false });
  next();
});

CategorySchema.pre('aggregate', function (this: mongoose.Aggregate<any[]>, next) {
  const pipeline = this.pipeline();
  const hasMatch = pipeline.some(stage => '$match' in stage);
  if (!hasMatch) {
    pipeline.unshift({ $match: { isDeleted: false } });
  }
  next();
});

export const CategoryModel = model<TCategory>('Category', CategorySchema);
