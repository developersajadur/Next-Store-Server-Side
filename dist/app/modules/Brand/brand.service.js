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
exports.brandService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const brand_model_1 = require("./brand.model");
const media_model_1 = require("../Media/media.model");
const generateUniqueSlug_1 = require("../../helpers/generateUniqueSlug");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const brand_constant_1 = require("./brand.constant");
const createBrandIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check media existence
    const isExistMedia = yield media_model_1.MediaModel.findById(payload.image);
    if (!isExistMedia || isExistMedia.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Media Not Found');
    }
    const slug = yield (0, generateUniqueSlug_1.generateUniqueSlug)(payload.title, brand_model_1.BrandModel);
    const brand = yield brand_model_1.BrandModel.create(Object.assign(Object.assign({}, payload), { createdBy: userId, slug }));
    return brand;
});
const updateBrandIntoDb = (brandId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield brand_model_1.BrandModel.findById(brandId);
    if (!brand || brand.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand Not Found');
    }
    if (payload.title) {
        payload.slug = yield (0, generateUniqueSlug_1.generateUniqueSlug)(payload.title, brand_model_1.BrandModel);
    }
    if (payload.image) {
        const isExistMedia = yield media_model_1.MediaModel.findById(payload.image);
        if (!isExistMedia || isExistMedia.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Media Not Found');
        }
    }
    const updated = yield brand_model_1.BrandModel.findOneAndUpdate({ _id: brandId, isDeleted: false }, Object.assign({}, payload), { new: true });
    return updated;
});
const getAllBrands = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const brandQuery = new QueryBuilder_1.default(brand_model_1.BrandModel.find({ isDeleted: false }), query)
        .search(brand_constant_1.brandSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield brandQuery.modelQuery;
    const meta = yield brandQuery.countTotal();
    return { data: result, meta };
});
const getSingleBrandById = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield brand_model_1.BrandModel.findById(brandId).lean();
    if (!brand || brand.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand Not Found');
    }
    return brand;
});
const getSingleBrandBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield brand_model_1.BrandModel.findOne({
        slug,
        isDeleted: false,
    }).lean();
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand Not Found');
    }
    return brand;
});
const deleteSingleOrMultipleBrands = (brandsId) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield brand_model_1.BrandModel.find({
        _id: { $in: brandsId },
        isDeleted: false,
    });
    if (brands.length !== brandsId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or more brands not found or already deleted');
    }
    yield brand_model_1.BrandModel.updateMany({ _id: { $in: brandsId } }, { $set: { isDeleted: true } }, { new: true });
});
exports.brandService = {
    createBrandIntoDb,
    updateBrandIntoDb,
    getAllBrands,
    getSingleBrandById,
    getSingleBrandBySlug,
    deleteSingleOrMultipleBrands,
};
