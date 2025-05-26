"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateImage = exports.baseSelectFields = exports.LIMIT_PER_SECTION = exports.productSearchableFields = void 0;
exports.productSearchableFields = ['title'];
exports.LIMIT_PER_SECTION = 8;
exports.baseSelectFields = [
    'title',
    'slug',
    'image',
    'price',
    'regular_price',
    'sale_price',
    'stock_quantity',
    'category',
    'brand',
];
exports.populateImage = {
    path: 'image',
    select: 'url fileName',
};
