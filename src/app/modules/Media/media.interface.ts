import { Types } from 'mongoose';

export type TMedia = {
  _id: Types.ObjectId;
  addedBy: Types.ObjectId;
  url: string;
  fileName?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
