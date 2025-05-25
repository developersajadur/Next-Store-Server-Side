"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidationSchema = void 0;
const zod_1 = require("zod");
const createProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        author: zod_1.z.string({ message: 'Author is required' }).optional(),
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        brand: zod_1.z.string().min(1, { message: 'Brand is required' }),
        price: zod_1.z.number().min(0, { message: 'Price must be a positive number' }),
        categories: zod_1.z
            .array(zod_1.z.string().min(1, { message: 'Each category must be a non-empty string' }))
            .min(1, { message: 'At least one category is required' }),
        description: zod_1.z.string().min(1, { message: 'Description is required' }),
        stockQuantity: zod_1.z
            .number()
            .int()
            .min(0, { message: 'Stock quantity must be a non-negative integer' }),
        inStock: zod_1.z.boolean().default(true),
        isDeleted: zod_1.z.boolean().default(false),
        images: zod_1.z
            .array(zod_1.z.string().url())
            .min(1, { message: 'At least one image is required' }),
        videoUrl: zod_1.z.string().url().optional(),
        colors: zod_1.z
            .array(zod_1.z.string().min(1))
            .min(1, { message: 'At least one color is required' }),
        weight: zod_1.z
            .number()
            .min(0, { message: 'Weight must be a non-negative number' }),
        discount: zod_1.z
            .number()
            .min(0, { message: 'Discount must be a non-negative number' })
            .default(0)
            .optional(),
        createdAt: zod_1.z.union([zod_1.z.string().datetime(), zod_1.z.date()]).optional(),
        updatedAt: zod_1.z.union([zod_1.z.string().datetime(), zod_1.z.date()]).optional(),
    }),
});
const updateProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        author: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1, { message: 'Name is required' }).optional(),
        brand: zod_1.z.string().min(1, { message: 'Brand is required' }).optional(),
        price: zod_1.z
            .number()
            .min(0, { message: 'Price must be a positive number' })
            .optional(),
        categories: zod_1.z
            .array(zod_1.z.string().min(1, { message: 'Each category must be a non-empty string' }))
            .nonempty({ message: 'At least one category is required' })
            .optional(),
        description: zod_1.z
            .string()
            .min(1, { message: 'Description is required' })
            .optional(),
        stockQuantity: zod_1.z
            .number()
            .int()
            .min(0, { message: 'Stock quantity must be a non-negative integer' })
            .optional(),
        inStock: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
        images: zod_1.z
            .array(zod_1.z.string().url())
            .nonempty({ message: 'At least one image is required' })
            .optional(),
        videoUrl: zod_1.z.string().url().optional(),
        colors: zod_1.z
            .array(zod_1.z.string().min(1, { message: 'Each color must be a non-empty string' }))
            .nonempty({ message: 'At least one color is required' })
            .optional(),
        weight: zod_1.z
            .number()
            .min(0, { message: 'Weight must be a non-negative number' })
            .optional(),
        discount: zod_1.z
            .number()
            .min(0, { message: 'Discount must be a non-negative number' })
            .optional(),
        updatedAt: zod_1.z.union([zod_1.z.string().datetime(), zod_1.z.date()]).optional(),
    }),
});
exports.ProductValidationSchema = {
    createProductValidation,
    updateProductValidation,
};
