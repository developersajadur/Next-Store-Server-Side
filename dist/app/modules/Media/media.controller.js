"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaController = void 0;
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const http_status_1 = __importStar(require("http-status"));
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const media_service_1 = require("./media.service");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const uploadSingleMediaIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.mediaService.uploadSingleMediaIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Media uploaded successfully',
        data: result,
    });
});
const uploadMultipleMediaIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.mediaService.uploadMultipleMediaIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Multiple media uploaded successfully',
        data: result,
    });
});
const getAllMedia = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.mediaService.getAllMedia(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Medias retrieved successfully',
        data: result,
    });
});
const getSingleMediaById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.mediaService.getSingleMediaById(req.params.mediaId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Media retrieved successfully',
        data: result,
    });
});
const deleteMultipleOrSingleMediaById = (0, catchAsync_1.default)(async (req, res) => {
    const { mediasId } = req.body;
    if (!Array.isArray(mediasId) || mediasId.length === 0) {
        throw new AppError_1.default(http_status_1.status.NOT_ACCEPTABLE, 'mediasId must be a non-empty array.');
    }
    await media_service_1.mediaService.deleteMultipleOrSingleMediaById(mediasId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.OK,
        success: true,
        message: 'Media item(s) deleted successfully.',
        data: null,
    });
});
exports.mediaController = {
    uploadSingleMediaIntoDB,
    uploadMultipleMediaIntoDB,
    getAllMedia,
    getSingleMediaById,
    deleteMultipleOrSingleMediaById,
};
