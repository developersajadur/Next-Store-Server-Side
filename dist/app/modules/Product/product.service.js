"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const product_constant_1 = require("./product.constant");
const product_model_1 = require("./product.model");
const generateUniqueSlug_1 = require("../../helpers/generateUniqueSlug");
const media_model_1 = require("../Media/media.model");
const brand_model_1 = require("../Brand/brand.model");
const category_model_1 = require("../Category/category.model");
const createProductIntoDb = async (product) => {
    // Validate Brand
    const brand = await brand_model_1.BrandModel.findOne({
        _id: product.brand,
        isDeleted: false,
    });
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand not found or has been deleted');
    }
    // Validate Main Image
    const mainImage = await media_model_1.MediaModel.findOne({
        _id: product.image,
        isDeleted: false,
    });
    if (!mainImage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Main product image not found or has been deleted');
    }
    // Validate Gallery Images (if any)
    if (product.gallery_images && product.gallery_images.length > 0) {
        const galleryImages = await media_model_1.MediaModel.find({
            _id: { $in: product.gallery_images },
            isDeleted: false,
        });
        if (galleryImages.length !== product.gallery_images.length) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Some gallery images were not found or have been deleted');
        }
    }
    // Validate variants Images (if any)
    if (product.variants && product.variants.length > 0) {
        const variantImageIds = product.variants
            .filter((variant) => variant.image)
            .map((variant) => variant.image);
        const variantsImages = await media_model_1.MediaModel.find({
            _id: { $in: variantImageIds },
            isDeleted: false,
        });
        if (variantsImages.length !== variantImageIds.length) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Some variant images were not found or have been deleted.');
        }
    }
    // Validate Categories
    const categories = await category_model_1.CategoryModel.find({
        _id: { $in: product.category },
        isDeleted: false,
    });
    if (categories.length !== product.category.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Some categories were not found or have been deleted');
    }
    product.slug = await (0, generateUniqueSlug_1.generateUniqueSlug)(product.title, product_model_1.ProductModel);
    const result = await product_model_1.ProductModel.create(product);
    return result;
};
const getAllProducts = async (query) => {
    const productQuery = new QueryBuilder_1.default(product_model_1.ProductModel.find({ isDeleted: false }), query)
        .search(product_constant_1.productSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { data: result, meta };
};
const getSingleProductById = async (_id) => {
    const product = await product_model_1.ProductModel.findById({
        _id,
        isDeleted: false,
    });
    if (!product || product.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product Not Found');
    }
    return product;
};
const getSingleProductBySlug = async (slug) => {
    const product = await product_model_1.ProductModel.findOne({
        slug,
        isDeleted: false,
    });
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product Not Found');
    }
    return product;
};
const updateSingleProductById = async (_id, updatedProduct) => {
    try {
        const product = await product_model_1.ProductModel.findOne({ _id, isDeleted: false });
        if (!product || product.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product Not Found');
        }
        if (updatedProduct.title) {
            updatedProduct.slug = await (0, generateUniqueSlug_1.generateUniqueSlug)(product.title, product_model_1.ProductModel);
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message);
    }
    const result = await product_model_1.ProductModel.findByIdAndUpdate(_id, Object.assign(Object.assign({}, updatedProduct), { updatedAt: new Date() }), { new: true });
    return result;
};
const deleteMultipleOrSingleMediaById = async (productsId) => {
    const products = await product_model_1.ProductModel.find({
        _id: { $in: productsId },
        isDeleted: false,
    }).lean();
    if (products.length !== productsId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or more media items not found or already deleted.');
    }
    await product_model_1.ProductModel.updateMany({ _id: { $in: productsId } }, { $set: { isDeleted: true } });
};
exports.ProductService = {
    createProductIntoDb,
    getAllProducts,
    getSingleProductById,
    getSingleProductBySlug,
    updateSingleProductById,
    deleteMultipleOrSingleMediaById,
};
