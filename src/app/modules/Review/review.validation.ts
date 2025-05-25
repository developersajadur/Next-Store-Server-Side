import { z } from 'zod';

export const createReviewValidation = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    // userId: z.string().min(1, "User ID is required").optional(),
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
    comment: z.string().min(1, 'Comment is required'),
    isDeleted: z.boolean().default(false),
  }),
});


 const updateReviewValidation = z.object({
  body: z.object({
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5')
      .optional(),
    comment: z.string().min(1, 'Comment is required').optional(),
  }),
});


export const ReviewValidationSchema = {
  createReviewValidation,
  updateReviewValidation
};
