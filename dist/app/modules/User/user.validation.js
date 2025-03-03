"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationSchema = void 0;
const zod_1 = require("zod");
// Define the Zod schema for user validation
const createUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        phone: zod_1.z.union([
            zod_1.z
                .string()
                .min(1, { message: 'Number is required' })
                .regex(/^\d{11}$/, {
                message: 'Phone number must be exactly 11 digits.',
            }),
            zod_1.z.number().min(1, { message: 'Number is required' }), // Apply the min check for number
        ]),
        email: zod_1.z
            .string()
            .email({ message: 'Please enter a valid email address' })
            .min(1, { message: 'Email is required' }),
        password: zod_1.z
            .string()
            .min(6, { message: 'Password must be at least 6 characters long' }),
        role: zod_1.z
            .enum(['admin', 'customer'], { message: 'Invalid role' })
            .default('customer'),
        profileImage: zod_1.z.string().url().optional(),
        city: zod_1.z.string().optional().default('N/A'),
        address: zod_1.z.string().optional().default('N/A'),
        isBlocked: zod_1.z.boolean().default(false), // Make carts optional
        createdAt: zod_1.z.date().optional(),
        updatedAt: zod_1.z.date().optional(),
    }),
});
const updateUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
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
        city: zod_1.z.string().optional().default('N/A').optional(),
        address: zod_1.z.string().optional().default('N/A').optional(),
        profileImage: zod_1.z.string().url().optional(),
        // isBlocked: z.boolean().default(false).optional(),
        updatedAt: zod_1.z.date().optional(),
    }),
});
exports.UserValidationSchema = {
    createUserValidation,
    updateUserValidation,
};
