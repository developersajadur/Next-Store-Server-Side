"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const review_service_1 = require("./review.service");
const createReviewIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { userId } = decoded;
    payload.userId = userId;
    const review = await review_service_1.ReviewService.createReviewIntoDb(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Review created successfully',
        data: review,
    });
});
const getAllReviewsFromDb = (0, catchAsync_1.default)(async (req, res) => {
    const reviews = await review_service_1.ReviewService.getAllReviewsFromDb(req === null || req === void 0 ? void 0 : req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews,
    });
});
const updateReviewIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const { reviewId, productId } = req.params;
    const payload = req.body;
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { userId } = decoded;
    const review = await review_service_1.ReviewService.updateReviewIntoDb(payload, reviewId, userId, productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review updated successfully',
        data: review,
    });
});
const getReviewBySlugForEachProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { slug } = req.params;
    const reviews = await review_service_1.ReviewService.getReviewBySlugForEachProduct(slug, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews,
    });
});
const deleteReviewFromDb = (0, catchAsync_1.default)(async (req, res) => {
    const { reviewId } = req.params;
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { userId } = decoded;
    const review = await review_service_1.ReviewService.deleteReviewFromDb(reviewId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review deleted successfully',
        data: review,
    });
});
const getSingleReviewById = (0, catchAsync_1.default)(async (req, res) => {
    const { reviewId } = req.params;
    const review = await review_service_1.ReviewService.getSingleReviewById(reviewId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Review retrieved successfully',
        data: review,
    });
});
exports.reviewController = {
    createReviewIntoDb,
    getAllReviewsFromDb,
    updateReviewIntoDb,
    getReviewBySlugForEachProduct,
    deleteReviewFromDb,
    getSingleReviewById,
};
