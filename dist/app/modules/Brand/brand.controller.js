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
exports.brandController = void 0;
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const brand_service_1 = require("./brand.service");
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield brand_service_1.brandService.createBrandIntoDb(req.body, user.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Brand created successfully',
        data: result,
    });
}));
const updateBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandId = req.params.id;
    const result = yield brand_service_1.brandService.updateBrandIntoDb(brandId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand updated successfully',
        data: result,
    });
}));
const getAllBrands = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_service_1.brandService.getAllBrands(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brands fetched successfully',
        data: result,
    });
}));
const getSingleBrandById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandId = req.params.id;
    const result = yield brand_service_1.brandService.getSingleBrandById(brandId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand fetched successfully',
        data: result,
    });
}));
const getSingleBrandBySlug = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield brand_service_1.brandService.getSingleBrandBySlug(slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand fetched successfully',
        data: result,
    });
}));
const deleteBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandsId = req.body.brandsId;
    yield brand_service_1.brandService.deleteSingleOrMultipleBrands(brandsId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand(s) deleted successfully',
        data: null
    });
}));
exports.brandController = {
    createBrand,
    updateBrand,
    getAllBrands,
    getSingleBrandById,
    getSingleBrandBySlug,
    deleteBrand,
};
