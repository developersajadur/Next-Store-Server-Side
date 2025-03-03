import { Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone: number | string;
  password: string;
  role: 'customer' | 'admin';
  profileImage?: string;
  address?: string;
  city?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUserRole = keyof typeof USER_ROLE;

// name: string;
// email: string;
// password: string;
// role: UserRole;
// phone?: string;
// address?: string;
// city?: string;
// createdAt: Date;
// updatedAt: Date;
