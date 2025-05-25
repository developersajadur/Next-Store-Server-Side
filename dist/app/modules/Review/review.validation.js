"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidationSchema = exports.createReviewValidation = void 0;
const zod_1 = require("zod");
exports.createReviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string().min(1, 'Product ID is required'),
        // userId: z.string().min(1, "User ID is required").optional(),
        rating: zod_1.z
            .number()
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5'),
        comment: zod_1.z.string().min(1, 'Comment is required'),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
const updateReviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z
            .number()
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5')
            .optional(),
        comment: zod_1.z.string().min(1, 'Comment is required').optional(),
    }),
});
exports.ReviewValidationSchema = {
    createReviewValidation: exports.createReviewValidation,
    updateReviewValidation
};
