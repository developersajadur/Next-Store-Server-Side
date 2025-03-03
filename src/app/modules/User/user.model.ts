import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser } from './user.interface';

// User schema definition
const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Number is required'],
      match: [/^\d{11}$/, 'Invalid phone number format'], // Optional: Validate 11-digit numbers
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      select: 0,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    profileImage: {
      type: String,
    },
    city: {
      type: String,
      default: 'N/A',
    },
    address: {
      type: String,
      default: 'N/A',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this as TUser;
  const password = user.password;
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.salt_rounds),
  );
  user.password = hashedPassword;
  next();
});

// Create the Mongoose model
export const UserModel = model<TUser>('User', userSchema);
