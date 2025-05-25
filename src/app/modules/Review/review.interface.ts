
import { Types } from "mongoose";

export type TReview = {
  _id: Types.ObjectId;
  productId: Types.ObjectId;       
  userId: Types.ObjectId;         
  rating: number;               
  comment: string; 
  isDeleted: boolean;            
  createdAt: Date;
  updatedAt: Date;
};
