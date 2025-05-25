"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandModel = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const BrandSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Media',
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    websiteUrl: {
        type: String,
        trim: true,
    },
    seoTitle: {
        type: String,
        trim: true,
    },
    seoDescription: {
        type: String,
        trim: true,
    },
    seoKeywords: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});
// Middleware to exclude deleted records from find queries
BrandSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
    next();
});
// Middleware to exclude deleted records from aggregation pipelines
BrandSchema.pre('aggregate', function (next) {
    const pipeline = this.pipeline();
    const hasMatch = pipeline.some(stage => '$match' in stage);
    if (!hasMatch) {
        pipeline.unshift({ $match: { isDeleted: false } });
    }
    next();
});
exports.BrandModel = (0, mongoose_1.model)('Brand', BrandSchema);
