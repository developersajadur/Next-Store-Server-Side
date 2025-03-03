import { Types } from 'mongoose';

export type TBicycle = {
  author?: Types.ObjectId;
  name: string;
  slug?: string;
  brand: string;
  price: number;
  category: string[];
  description: string;
  stockQuantity: number;
  inStock: boolean;
  isDeleted: boolean;
  images: string[];
  videoUrl?: string;
  colors: string[];
  weight: number;
  discount: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
