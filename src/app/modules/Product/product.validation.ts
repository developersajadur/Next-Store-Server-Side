import { z } from 'zod';

// Reusable datetime schema
// const dateTimeSchema = z.union([z.string().datetime(), z.date()]);

// Specification Item Schema
const specificationItemSchema = z.object({
  key: z.string().min(1, { message: 'Specification key is required' }),
  value: z.string().min(1, { message: 'Specification value is required' }),
});

// Variant Schema
// const variantSchema = z.object({
//   color: z.string().optional(),
//   size: z.string().optional(),
//   weight: z.number().min(0).optional(),
//   price: z.number().min(0, { message: 'Price must be a positive number' }),
//   regular_price: z.number().min(0).optional(),
//   sale_price: z.number().min(0).optional(),
//   stock_quantity: z.number().int().min(0),
//   additional: z.string().optional(),
//   image: z.string().optional()
// });

const createProductValidation = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    image: z.string().min(1, { message: 'Image is required' }),
    gallery_images: z.array(z.string()).optional(),
    category: z
      .array(z.string().min(1, { message: 'Each category must be non-empty' }))
      .min(1, { message: 'At least one category is required' }),
    brand: z.string().min(1, { message: 'Brand is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    short_description: z.string().optional(),
    price: z.number().min(0, { message: 'Price must be a positive number' }),
    regular_price: z.number().optional(),
    sale_price: z.number().optional(),
    // variants: z.array(variantSchema).optional(),
    color: z.string().min(1).optional(),
    stock_quantity: z.number().int().min(0),
    specifications: z.array(specificationItemSchema).optional(),
    warranty: z.string().min(1, { message: 'Warranty is required' }).optional(),
    weight: z.number().min(0).optional(),
    size: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.string().optional(),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    image: z.string().optional(),
    gallery_images: z.array(z.string()).optional(),
    category: z.array(z.string().min(1)).optional(),
    brand: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    short_description: z.string().optional(),
    price: z.number().min(0).optional(),
    regular_price: z.number().min(0).optional(),
    sale_price: z.number().min(0).optional(),
    // variants: z.array(variantSchema).optional(),
    color: z.string().min(1).optional(),
    stock_quantity: z.number().int().min(0).optional(),
    specifications: z.array(specificationItemSchema).optional(),
    warranty: z.string().optional(),
    weight: z.number().min(0).optional(),
    size: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.string().optional(),
  }),
});

export const ProductValidationSchema = {
  createProductValidation,
  updateProductValidation,
};
