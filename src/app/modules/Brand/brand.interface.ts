import { Types } from 'mongoose';

export type TBrand = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  image: Types.ObjectId;
  description?: string;
  websiteUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
