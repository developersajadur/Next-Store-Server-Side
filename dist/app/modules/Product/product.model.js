"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        trim: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: [String],
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});
// Middleware to exclude deleted records from find queries
ProductSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
    next();
});
// Middleware to exclude deleted records from aggregation pipelines
ProductSchema.pre('aggregate', function (next) {
    const pipeline = this.pipeline();
    if (!pipeline.some((stage) => stage.$match)) {
        this.pipeline().unshift({ $match: { isDeleted: false } });
    }
    next();
});
exports.ProductModel = (0, mongoose_1.model)('Product', ProductSchema);
