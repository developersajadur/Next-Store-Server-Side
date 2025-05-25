import { Types } from 'mongoose';

export type TCategory = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  image: Types.ObjectId;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
