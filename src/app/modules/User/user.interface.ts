import { Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export const LOGIN_TYPE = {
  PASSWORD: 'PASSWORD',
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
} as const;

export type TLoginType = keyof typeof LOGIN_TYPE;


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
  loginType: TLoginType;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUserRole = keyof typeof USER_ROLE;

