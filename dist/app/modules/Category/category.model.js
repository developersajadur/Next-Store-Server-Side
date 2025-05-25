"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Media',
        required: true,
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
        default: false,
        required: true,
    },
}, {
    timestamps: true,
});
// Automatically exclude deleted documents
CategorySchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
    next();
});
CategorySchema.pre('aggregate', function (next) {
    const pipeline = this.pipeline();
    const hasMatch = pipeline.some(stage => '$match' in stage);
    if (!hasMatch) {
        pipeline.unshift({ $match: { isDeleted: false } });
    }
    next();
});
exports.CategoryModel = (0, mongoose_1.model)('Category', CategorySchema);
