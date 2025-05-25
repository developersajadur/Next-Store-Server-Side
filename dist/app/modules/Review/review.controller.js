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
exports.reviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_utils_1 = require("../Auth/auth.utils");
const review_service_1 = require("./review.service");
const createReviewIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const decoded = (0, auth_utils_1.tokenDecoder)(req);
    const { userId } = decoded;
    payload.userId = userId;
    const review = yield review_service_1.ReviewService.createReviewIntoDb(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Review created successfully',
        data: review,
    });
}));
const getAllReviewsFromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_service_1.ReviewService.getAllReviewsFromDb(req === null || req === void 0 ? void 0 : req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews,
    });
}));
const updateReviewIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, productId } = req.params;
    const payload = req.body;
    const decoded = (0, auth_utils_1.tokenDecoder)(req);
    const { userId } = decoded;
    const review = yield review_service_1.ReviewService.updateReviewIntoDb(payload, reviewId, userId, productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review updated successfully',
        data: review,
    });
}));
const getReviewBySlugForEachProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const reviews = yield review_service_1.ReviewService.getReviewBySlugForEachProduct(slug, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews,
    });
}));
const deleteReviewFromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const decoded = (0, auth_utils_1.tokenDecoder)(req);
    const { userId } = decoded;
    const review = yield review_service_1.ReviewService.deleteReviewFromDb(reviewId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review deleted successfully',
        data: review,
    });
}));
exports.reviewController = {
    createReviewIntoDb,
    getAllReviewsFromDb,
    updateReviewIntoDb,
    getReviewBySlugForEachProduct,
    deleteReviewFromDb
};
