"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueSlug = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const slugify_1 = __importDefault(require("slugify"));
const generateUniqueSlug = async (title, model, field = 'slug') => {
    const baseSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await model.findOne({ [field]: slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
};
exports.generateUniqueSlug = generateUniqueSlug;
