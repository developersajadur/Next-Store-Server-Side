"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidationSchema = void 0;
const zod_1 = require("zod");
// Reusable datetime schema
// const dateTimeSchema = z.union([z.string().datetime(), z.date()]);
// Specification Item Schema
const specificationItemSchema = zod_1.z.object({
    key: zod_1.z.string().min(1, { message: 'Specification key is required' }),
    value: zod_1.z.string().min(1, { message: 'Specification value is required' }),
});
// Variant Schema
const variantSchema = zod_1.z.object({
    color: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    weight: zod_1.z.number().min(0).optional(),
    price: zod_1.z.number().min(0, { message: 'Price must be a positive number' }),
    regular_price: zod_1.z.number().min(0).optional(),
    sale_price: zod_1.z.number().min(0).optional(),
    stock_quantity: zod_1.z.number().int().min(0),
    additional: zod_1.z.string().optional(),
    image: zod_1.z.string().optional()
});
const createProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: 'Title is required' }),
        image: zod_1.z.string().min(1, { message: 'Image is required' }),
        gallery_images: zod_1.z.array(zod_1.z.string()).optional(),
        category: zod_1.z
            .array(zod_1.z.string().min(1, { message: 'Each category must be non-empty' }))
            .min(1, { message: 'At least one category is required' }),
        brand: zod_1.z.string().min(1, { message: 'Brand is required' }),
        description: zod_1.z.string().min(1, { message: 'Description is required' }),
        short_description: zod_1.z.string().optional(),
        price: zod_1.z.number().min(0, { message: 'Price must be a positive number' }),
        regular_price: zod_1.z.number().optional(),
        sale_price: zod_1.z.number().optional(),
        variants: zod_1.z.array(variantSchema).optional(),
        stock_quantity: zod_1.z.number().int().min(0),
        specifications: zod_1.z.array(specificationItemSchema).optional(),
        warranty: zod_1.z.string().min(1, { message: 'Warranty is required' }).optional(),
        weight: zod_1.z.number().min(0).optional(),
        size: zod_1.z.string().optional(),
        seoTitle: zod_1.z.string().optional(),
        seoDescription: zod_1.z.string().optional(),
        seoKeywords: zod_1.z.string().optional(),
    }),
});
const updateProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        image: zod_1.z.string().optional(),
        gallery_images: zod_1.z.array(zod_1.z.string()).optional(),
        category: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        brand: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().min(1).optional(),
        short_description: zod_1.z.string().optional(),
        price: zod_1.z.number().min(0).optional(),
        regular_price: zod_1.z.number().min(0).optional(),
        sale_price: zod_1.z.number().min(0).optional(),
        variants: zod_1.z.array(variantSchema).optional(),
        stock_quantity: zod_1.z.number().int().min(0).optional(),
        specifications: zod_1.z.array(specificationItemSchema).optional(),
        warranty: zod_1.z.string().optional(),
        weight: zod_1.z.number().min(0).optional(),
        size: zod_1.z.string().optional(),
        seoTitle: zod_1.z.string().optional(),
        seoDescription: zod_1.z.string().optional(),
        seoKeywords: zod_1.z.string().optional()
    }),
});
exports.ProductValidationSchema = {
    createProductValidation,
    updateProductValidation,
};
