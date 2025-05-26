"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomeProductsUtils = void 0;
const review_model_1 = require("../Review/review.model");
const product_constant_1 = require("./product.constant");
const product_model_1 = require("./product.model");
const getHomeProductsUtils = async () => {
    const featuredProducts = await product_model_1.ProductModel.find({
        isDeleted: false,
    })
        .select(product_constant_1.baseSelectFields)
        .populate(product_constant_1.populateImage)
        .sort({ createdAt: -1 }) // newest first
        .limit(12);
    const onSaleProducts = await product_model_1.ProductModel.find({
        isDeleted: false,
        sale_price: { $gt: 0 },
    })
        .select(product_constant_1.baseSelectFields)
        .populate(product_constant_1.populateImage)
        .sort({ sale_price: 1 }) // cheapest on top
        .limit(product_constant_1.LIMIT_PER_SECTION);
    const readyToOrderProducts = await product_model_1.ProductModel.find({
        isDeleted: false,
        stock_quantity: { $gt: 0 },
    })
        .select(product_constant_1.baseSelectFields)
        .populate(product_constant_1.populateImage)
        .sort({ updatedAt: -1 })
        .limit(product_constant_1.LIMIT_PER_SECTION);
    const bestSellingProducts = await product_model_1.ProductModel.find({
        isDeleted: false,
        stock_quantity: { $gt: 0 },
    })
        .select(product_constant_1.baseSelectFields)
        .populate(product_constant_1.populateImage)
        .sort({ stock_quantity: -1 })
        .limit(product_constant_1.LIMIT_PER_SECTION);
    // Aggregation to get best reviewed products
    const bestReviewedAggregation = await review_model_1.Review.aggregate([
        // 1. Filter out deleted reviews
        { $match: { isDeleted: false } },
        // 2. Group by productId to calculate average rating and count
        {
            $group: {
                _id: '$productId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
        // 3. Sort by best average rating, then by most reviews
        { $sort: { averageRating: -1, reviewCount: -1 } },
        // 4. Limit to a fixed number of top-rated products
        { $limit: product_constant_1.LIMIT_PER_SECTION },
        // 5. Join with product collection
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        // 6. Join with media collection to fetch product image
        {
            $lookup: {
                from: 'media',
                localField: 'product.image',
                foreignField: '_id',
                as: 'imageData',
            },
        },
        {
            $unwind: {
                path: '$imageData',
                preserveNullAndEmptyArrays: true,
            },
        },
        // 7. Project the required structure
        {
            $project: {
                averageRating: 1,
                reviewCount: 1,
                product: {
                    _id: '$product._id',
                    title: '$product.title',
                    slug: '$product.slug',
                    image: {
                        _id: '$imageData._id',
                        url: '$imageData.url',
                        fileName: '$imageData.fileName',
                    },
                    price: '$product.price',
                    regular_price: '$product.regular_price',
                    sale_price: '$product.sale_price',
                    stock_quantity: '$product.stock_quantity',
                    category: '$product.category',
                    brand: '$product.brand',
                },
            },
        },
    ]);
    return {
        featuredProducts,
        onSaleProducts,
        readyToOrderProducts,
        bestSellingProducts,
        bestReviewedProducts: bestReviewedAggregation,
    };
};
exports.getHomeProductsUtils = getHomeProductsUtils;
