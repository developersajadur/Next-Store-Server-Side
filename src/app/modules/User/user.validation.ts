import { z } from 'zod';

// Define the Zod schema for user validation
const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    phone: z.union([
      z
        .string()
        .min(1, { message: 'Number is required' })
        .regex(/^\d{11}$/, {
          message: 'Phone number must be exactly 11 digits.',
        }),
      z.number().min(1, { message: 'Number is required' }), // Apply the min check for number
    ]),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .min(1, { message: 'Email is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    role: z
      .enum(['admin', 'customer'], { message: 'Invalid role' })
      .default('customer'),
    profileImage: z.string().url().optional(),
    city: z.string().optional().default('N/A'),
    address: z.string().optional().default('N/A'),
    isBlocked: z.boolean().default(false), // Make carts optional
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    // phone: z.number().min(1, { message: 'Number is required' }),
    // email: z
    //   .string()
    //   .email({ message: 'Please enter a valid email address' })
    //   .min(1, { message: 'Email is required' })
    //   .optional(),
    // password: z
    //   .string()
    //   .min(6, { message: 'Password must be at least 6 characters long' })
    //   .optional(),
    // role: z.enum(['user', 'customer'], { message: 'Invalid role' }).optional(),
    city: z.string().optional().default('N/A').optional(),
    address: z.string().optional().default('N/A').optional(),
    profileImage: z.string().url().optional(),
    // isBlocked: z.boolean().default(false).optional(),
    updatedAt: z.date().optional(),
  }),
});

export const UserValidationSchema = {
  createUserValidation,
  updateUserValidation,
};
