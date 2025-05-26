import { Types } from 'mongoose';

// Specification Item Type
export type TSpecificationItem = {
  key: string;
  value: string;
};

// Variant Type
export type TVariant = {
  _id: Types.ObjectId;
  color?: Types.ObjectId;
  size?: string;
  weight?: number;
  price: number;
  regular_price?: number;
  sale_price?: number;
  stock_quantity: number;
  additional?: string;
  image: Types.ObjectId;
  createdAt: Date | string;
  updatedAt: Date | string;
};

// Product Type
export type TProduct = {
  addedBy: Types.ObjectId;
  title: string;
  slug: string;
  image: Types.ObjectId;
  gallery_images?: Types.ObjectId[];
  category: Types.ObjectId[];
  brand: Types.ObjectId;
  description: string;
  short_description?: string;
  price: number;
  regular_price?: number;
  sale_price?: number;
  variants: TVariant[];
  stock_quantity: number;
  specifications: TSpecificationItem[];
  warranty?: string;
  weight?: number;
  size?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
