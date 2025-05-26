"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const category_service_1 = require("./category.service");
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createCategoryIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await category_service_1.categoryService.createCategoryIntoDb(req.body, user.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Category created successfully',
        data: result,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.categoryService.getAllCategories(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Categories fetched successfully',
        data: result,
    });
});
const getCategoryById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await category_service_1.categoryService.getCategoryById(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Category fetched successfully',
        data: result,
    });
});
const getCategoryBySlug = (0, catchAsync_1.default)(async (req, res) => {
    const { slug } = req.params;
    const result = await category_service_1.categoryService.getCategoryBySlug(slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Category fetched successfully',
        data: result,
    });
});
const updateCategoryById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await category_service_1.categoryService.updateCategoryById(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Category updated successfully',
        data: result,
    });
});
const deleteSingleOrMultipleCategories = (0, catchAsync_1.default)(async (req, res) => {
    const { categoriesId } = req.body;
    await category_service_1.categoryService.deleteSingleOrMultipleCategories(categoriesId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Category(s) deleted successfully',
        data: null
    });
});
exports.categoryController = {
    createCategoryIntoDb,
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategoryById,
    deleteSingleOrMultipleCategories,
};
