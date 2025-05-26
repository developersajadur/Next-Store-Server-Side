"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const brand_model_1 = require("./brand.model");
const media_model_1 = require("../Media/media.model");
const generateUniqueSlug_1 = require("../../helpers/generateUniqueSlug");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const brand_constant_1 = require("./brand.constant");
const createBrandIntoDb = async (payload, userId) => {
    // Check media existence
    const isExistMedia = await media_model_1.MediaModel.findById(payload.image);
    if (!isExistMedia || isExistMedia.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Media Not Found');
    }
    const slug = await (0, generateUniqueSlug_1.generateUniqueSlug)(payload.title, brand_model_1.BrandModel);
    const brand = await brand_model_1.BrandModel.create(Object.assign(Object.assign({}, payload), { createdBy: userId, slug }));
    return brand;
};
const updateBrandIntoDb = async (brandId, payload) => {
    const brand = await brand_model_1.BrandModel.findById(brandId);
    if (!brand || brand.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand Not Found');
    }
    if (payload.title) {
        payload.slug = await (0, generateUniqueSlug_1.generateUniqueSlug)(payload.title, brand_model_1.BrandModel);
    }
    if (payload.image) {
        const isExistMedia = await media_model_1.MediaModel.findById(payload.image);
        if (!isExistMedia || isExistMedia.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Media Not Found');
        }
    }
    const updated = await brand_model_1.BrandModel.findOneAndUpdate({ _id: brandId, isDeleted: false }, Object.assign({}, payload), { new: true });
    return updated;
};
const getAllBrands = async (query) => {
    const brandQuery = new QueryBuilder_1.default(brand_model_1.BrandModel.find({ isDeleted: false }), query)
        .search(brand_constant_1.brandSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await brandQuery.modelQuery;
    const meta = await brandQuery.countTotal();
    return { data: result, meta };
};
const getSingleBrandById = async (brandId) => {
    const brand = await brand_model_1.BrandModel.findById(brandId).lean();
    if (!brand || brand.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand Not Found');
    }
    return brand;
};
const getSingleBrandBySlug = async (slug) => {
    const brand = await brand_model_1.BrandModel.findOne({
        slug,
        isDeleted: false,
    }).lean();
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand Not Found');
    }
    return brand;
};
const deleteSingleOrMultipleBrands = async (brandsId) => {
    const brands = await brand_model_1.BrandModel.find({
        _id: { $in: brandsId },
        isDeleted: false,
    });
    if (brands.length !== brandsId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or more brands not found or already deleted');
    }
    await brand_model_1.BrandModel.updateMany({ _id: { $in: brandsId } }, { $set: { isDeleted: true } }, { new: true });
};
exports.brandService = {
    createBrandIntoDb,
    updateBrandIntoDb,
    getAllBrands,
    getSingleBrandById,
    getSingleBrandBySlug,
    deleteSingleOrMultipleBrands,
};
