"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandController = void 0;
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const brand_service_1 = require("./brand.service");
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createBrand = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await brand_service_1.brandService.createBrandIntoDb(req.body, user.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Brand created successfully',
        data: result,
    });
});
const updateBrand = (0, catchAsync_1.default)(async (req, res) => {
    const brandId = req.params.id;
    const result = await brand_service_1.brandService.updateBrandIntoDb(brandId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand updated successfully',
        data: result,
    });
});
const getAllBrands = (0, catchAsync_1.default)(async (req, res) => {
    const result = await brand_service_1.brandService.getAllBrands(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brands fetched successfully',
        data: result,
    });
});
const getSingleBrandById = (0, catchAsync_1.default)(async (req, res) => {
    const brandId = req.params.id;
    const result = await brand_service_1.brandService.getSingleBrandById(brandId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand fetched successfully',
        data: result,
    });
});
const getSingleBrandBySlug = (0, catchAsync_1.default)(async (req, res) => {
    const slug = req.params.slug;
    const result = await brand_service_1.brandService.getSingleBrandBySlug(slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand fetched successfully',
        data: result,
    });
});
const deleteBrand = (0, catchAsync_1.default)(async (req, res) => {
    const brandsId = req.body.brandsId;
    await brand_service_1.brandService.deleteSingleOrMultipleBrands(brandsId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand(s) deleted successfully',
        data: null
    });
});
exports.brandController = {
    createBrand,
    updateBrand,
    getAllBrands,
    getSingleBrandById,
    getSingleBrandBySlug,
    deleteBrand,
};
