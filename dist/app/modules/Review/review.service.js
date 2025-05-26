"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const review_model_1 = require("./review.model");
const product_model_1 = require("../Product/product.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const review_constant_1 = require("./review.constant");
const user_model_1 = require("../User/user.model");
const user_constant_1 = require("../User/user.constant");
const createReviewIntoDb = async (payload) => {
    const isExistProduct = await product_model_1.ProductModel.findById(payload.productId).lean();
    if (!isExistProduct || isExistProduct.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    const isExistReview = await review_model_1.Review.findOne({
        productId: payload.productId,
        userId: payload.userId,
    }).lean();
    if (isExistReview) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'You have already reviewed this product');
    }
    const result = await review_model_1.Review.create(payload);
    return result;
};
const getAllReviewsFromDb = async (query) => {
    const reviewQuery = new QueryBuilder_1.default(review_model_1.Review.find({ isDeleted: false }).populate({
        path: 'userId',
        select: 'name email profileImage',
    }), query)
        .search(review_constant_1.reviewSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const reviews = await reviewQuery.modelQuery;
    const meta = await reviewQuery.countTotal();
    return { reviews, meta };
};
const updateReviewIntoDb = async (payload, reviewId, userId, productId) => {
    const isExistReview = await review_model_1.Review.findById(reviewId).lean();
    if (!isExistReview || isExistReview.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    if (isExistReview.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this review');
    }
    const isExistProduct = await product_model_1.ProductModel.findById(productId).lean();
    if (!isExistProduct || isExistProduct.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    const result = await review_model_1.Review.findByIdAndUpdate(reviewId, { $set: payload }, { new: true }).lean();
    return result;
};
const getReviewBySlugForEachProduct = async (slug, query) => {
    const product = await product_model_1.ProductModel.findOne({ slug, isDeleted: false }).lean();
    if (!product) {
        throw new Error(`Product with slug "${slug}" not found.`);
    }
    const reviewQuery = new QueryBuilder_1.default(review_model_1.Review.find({ isDeleted: false, productId: product._id })
        .populate({
        path: 'userId',
        select: 'name email profileImage',
    })
        .lean(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const reviews = await reviewQuery.modelQuery;
    const meta = await reviewQuery.countTotal();
    return { reviews, meta };
};
const deleteReviewFromDb = async (reviewId, userId) => {
    const isExistReview = await review_model_1.Review.findById(reviewId).lean();
    if (!isExistReview || isExistReview.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    const user = await user_model_1.UserModel.findById(userId).lean();
    if (!user || user.isBlocked) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role === user_constant_1.USER_ROLE.customer) {
        if (isExistReview.userId.toString() !== userId.toString()) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this review');
        }
    }
    const result = await review_model_1.Review.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } }, { new: true }).lean();
    return result;
};
const getSingleReviewById = async (reviewId) => {
    const review = await review_model_1.Review.findById(reviewId).populate({
        path: 'userId',
        select: 'name email profileImage',
    });
    if (!review || (review === null || review === void 0 ? void 0 : review.isDeleted)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review Not Found');
    }
    return review;
};
exports.ReviewService = {
    createReviewIntoDb,
    getAllReviewsFromDb,
    updateReviewIntoDb,
    getReviewBySlugForEachProduct,
    deleteReviewFromDb,
    getSingleReviewById,
};
