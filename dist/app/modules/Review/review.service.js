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
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const review_model_1 = require("./review.model");
const product_model_1 = require("../Product/product.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const review_constant_1 = require("./review.constant");
const user_model_1 = require("../User/user.model");
const user_constant_1 = require("../User/user.constant");
const createReviewIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistProduct = yield product_model_1.ProductModel.findById(payload.productId).lean();
    if (!isExistProduct || isExistProduct.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    const isExistReview = yield review_model_1.Review.findOne({
        productId: payload.productId,
        userId: payload.userId,
    }).lean();
    if (isExistReview) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'You have already reviewed this product');
    }
    const result = yield review_model_1.Review.create(payload);
    return result;
});
const getAllReviewsFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewQuery = new QueryBuilder_1.default(review_model_1.Review.find({ isDeleted: false }).populate({
        path: 'userId',
        select: 'name email profileImage',
    }), query)
        .search(review_constant_1.reviewSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const reviews = yield reviewQuery.modelQuery;
    const meta = yield reviewQuery.countTotal();
    return { reviews, meta };
});
const updateReviewIntoDb = (payload, reviewId, userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistReview = yield review_model_1.Review.findById(reviewId).lean();
    if (!isExistReview || isExistReview.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    if (isExistReview.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this review');
    }
    const isExistProduct = yield product_model_1.ProductModel.findById(productId).lean();
    if (!isExistProduct || isExistProduct.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    const result = yield review_model_1.Review.findByIdAndUpdate(reviewId, { $set: payload }, { new: true }).lean();
    return result;
});
const getReviewBySlugForEachProduct = (slug, query) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.ProductModel.findOne({ slug, isDeleted: false }).lean();
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
    const reviews = yield reviewQuery.modelQuery;
    const meta = yield reviewQuery.countTotal();
    return { reviews, meta };
});
const deleteReviewFromDb = (reviewId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistReview = yield review_model_1.Review.findById(reviewId).lean();
    if (!isExistReview || isExistReview.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    const user = yield user_model_1.UserModel.findById(userId).lean();
    if (!user || user.isBlocked) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role === user_constant_1.USER_ROLE.customer) {
        if (isExistReview.userId.toString() !== userId.toString()) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this review');
        }
    }
    const result = yield review_model_1.Review.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } }, { new: true }).lean();
    return result;
});
const getSingleReviewById = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(reviewId).populate({
        path: 'userId',
        select: 'name email profileImage',
    });
    if (!review || (review === null || review === void 0 ? void 0 : review.isDeleted)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review Not Found');
    }
    return review;
});
exports.ReviewService = {
    createReviewIntoDb,
    getAllReviewsFromDb,
    updateReviewIntoDb,
    getReviewBySlugForEachProduct,
    deleteReviewFromDb,
    getSingleReviewById,
};
