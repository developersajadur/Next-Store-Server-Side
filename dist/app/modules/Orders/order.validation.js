"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const OrderValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email format' }),
    product: zod_1.z.string().min(1, { message: 'Product ID is required' }),
    quantity: zod_1.z
        .number()
        .int()
        .min(1, { message: 'Quantity must be a positive integer' }),
    totalPrice: zod_1.z
        .number()
        .min(0, { message: 'Total price must be a non-negative number' }),
});
exports.default = OrderValidationSchema;
