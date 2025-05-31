"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const product_service_1 = require("./product.service");
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createProduct = (0, catchAsync_1.default)(async (req, res) => {
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { userId } = decoded;
    const product = req.body;
    const dataToStore = Object.assign(Object.assign({}, product), { addedBy: userId });
    const result = await product_service_1.ProductService.createProductIntoDb(dataToStore);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product is created successfully',
        data: result,
    });
});
const getAllProducts = (0, catchAsync_1.default)(async (req, res) => {
    const products = await product_service_1.ProductService.getAllProducts(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Products retrieved successfully',
        data: products,
    });
});
const getAllProductsForProductCard = (0, catchAsync_1.default)(async (req, res) => {
    const products = await product_service_1.ProductService.getAllProductsForProductCard(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Products Some Data retrieved successfully',
        data: products,
    });
});
const getHomeProducts = (0, catchAsync_1.default)(async (req, res) => {
    const products = await product_service_1.ProductService.getHomeProducts();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Home Products retrieved successfully',
        data: products,
    });
});
const getSingleProductById = (0, catchAsync_1.default)(async (req, res) => {
    const product = await product_service_1.ProductService.getSingleProductById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product retrieved successfully',
        data: product,
    });
});
const getSingleProductBySlug = (0, catchAsync_1.default)(async (req, res) => {
    const product = await product_service_1.ProductService.getSingleProductBySlug(req.params.slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product retrieved successfully',
        data: product,
    });
});
const updateSingleProductById = (0, catchAsync_1.default)(async (req, res) => {
    var _a;
    const updatedProduct = await product_service_1.ProductService.updateSingleProductById((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id, req === null || req === void 0 ? void 0 : req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
    });
});
const getRelatedProducts = (0, catchAsync_1.default)(async (req, res) => {
    var _a;
    const products = await product_service_1.ProductService.getRelatedProducts((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Related Product retrieved successfully',
        data: products
    });
});
const deleteMultipleOrSingleMediaById = (0, catchAsync_1.default)(async (req, res) => {
    const { productsId } = req.body;
    if (!Array.isArray(productsId) || productsId.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'productsId must be a non-empty array.');
    }
    await product_service_1.ProductService.deleteMultipleOrSingleMediaById(productsId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Products deleted successfully.',
        data: null,
    });
});
exports.productController = {
    createProduct,
    getAllProducts,
    getSingleProductById,
    updateSingleProductById,
    deleteMultipleOrSingleMediaById,
    getSingleProductBySlug,
    getAllProductsForProductCard,
    getHomeProducts,
    getRelatedProducts
};
