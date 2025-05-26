"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const media_model_1 = require("../Media/media.model");
const category_model_1 = require("./category.model");
const generateUniqueSlug_1 = require("../../helpers/generateUniqueSlug");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const category_constant_1 = require("./category.constant");
const createCategoryIntoDb = async (payload, userId) => {
    if (payload.image) {
        const isExistMedia = await media_model_1.MediaModel.findById(payload.image);
        if (!isExistMedia || isExistMedia.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Media Not Found');
        }
    }
    const slug = await (0, generateUniqueSlug_1.generateUniqueSlug)(payload.title, category_model_1.CategoryModel);
    const category = await category_model_1.CategoryModel.create(Object.assign(Object.assign({}, payload), { createdBy: userId, slug }));
    return category;
};
const getAllCategories = async (query) => {
    const categoryQuery = new QueryBuilder_1.default(category_model_1.CategoryModel.find({ isDeleted: false }), query)
        .search(category_constant_1.categorySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await categoryQuery.modelQuery;
    const meta = await categoryQuery.countTotal();
    return { data: result, meta };
};
const getCategoryById = async (id) => {
    const category = await category_model_1.CategoryModel.findById(id).lean();
    if (!category || category.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Category Not Found');
    }
    return category;
};
const getCategoryBySlug = async (slug) => {
    const category = await category_model_1.CategoryModel.findOne({
        slug,
        isDeleted: false,
    }).lean();
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Category Not Found');
    }
    return category;
};
const updateCategoryById = async (id, payload) => {
    if (payload.image) {
        const isExistMedia = await media_model_1.MediaModel.findById(payload.image);
        if (!isExistMedia || isExistMedia.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Media Not Found');
        }
    }
    if (payload.title) {
        payload.slug = await (0, generateUniqueSlug_1.generateUniqueSlug)(payload.title, category_model_1.CategoryModel);
    }
    const isExistCategory = await category_model_1.CategoryModel.findById(id).lean();
    if (!isExistCategory) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Category Not Found or Deleted');
    }
    const updated = await category_model_1.CategoryModel.findOneAndUpdate({ _id: id, isDeleted: false }, Object.assign({}, payload), { new: true });
    return updated;
};
const deleteSingleOrMultipleCategories = async (categoryIds) => {
    const categories = await category_model_1.CategoryModel.find({
        _id: { $in: categoryIds },
        isDeleted: false,
    });
    if (categories.length !== categoryIds.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or more categories not found or already deleted.');
    }
    await category_model_1.CategoryModel.updateMany({ _id: { $in: categoryIds } }, { $set: { isDeleted: true } }, { new: true });
};
exports.categoryService = {
    createCategoryIntoDb,
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategoryById,
    deleteSingleOrMultipleCategories,
};
