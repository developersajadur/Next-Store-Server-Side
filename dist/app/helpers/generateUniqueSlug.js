"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueSlug = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const slugify_1 = __importDefault(require("slugify"));
const generateUniqueSlug = (title_1, model_1, ...args_1) => __awaiter(void 0, [title_1, model_1, ...args_1], void 0, function* (title, model, field = 'slug') {
    const baseSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (yield model.findOne({ [field]: slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
});
exports.generateUniqueSlug = generateUniqueSlug;
