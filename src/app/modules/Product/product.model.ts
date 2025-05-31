/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { model, Schema } from 'mongoose';
import { TProduct } from './product.interface';

// Specification Schema
const SpecificationItemSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

// Variant Schema
// const VariantSchema = new Schema(
//   {
//     color: { type: String },
//     size: { type: String },
//     weight: { type: Number },
//     price: { type: Number, required: true },
//     regular_price: { type: Number },
//     sale_price: { type: Number },
//     stock_quantity: { type: Number, required: true },
//     additional: { type: String },
//     image: { type: Schema.Types.ObjectId, ref: 'Media' },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//   },
//   { _id: true },
// );

// Product Schema
const ProductSchema = new Schema<TProduct>(
  {
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true, sparse: true },
    image: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
    gallery_images: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    category: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    description: { type: String, required: true, trim: true },
    short_description: { type: String, trim: true },
    color: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    regular_price: { type: Number },
    sale_price: { type: Number },
    // variants: { type: [VariantSchema], default: [] },
    stock_quantity: { type: Number, required: true, min: 0 },
    specifications: { type: [SpecificationItemSchema], default: [] },
    warranty: { type: String },
    weight: { type: Number },
    size: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  },
);



// Pre-save hook to set default values
ProductSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('price')) {
    if (this.regular_price == null) {
      this.regular_price = this.price;
    }
    if (this.sale_price == null) {
      this.sale_price = this.price;
    }
  }
  next();
});

// Middleware to exclude soft-deleted documents
ProductSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  this.find({ isDeleted: false });
  next();
});

ProductSchema.pre('aggregate', function (this: mongoose.Aggregate<any[]>, next) {
  const pipeline = this.pipeline();
  const hasMatch = pipeline.some(stage => '$match' in stage);
  if (!hasMatch) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
  }
  next();
});

export const ProductModel = model<TProduct>('Product', ProductSchema);
