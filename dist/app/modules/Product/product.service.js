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
exports.ProductService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const product_constant_1 = require("./product.constant");
const product_model_1 = require("./product.model");
const generateUniqueSlug_1 = require("../../helpers/generateUniqueSlug");
const createProductIntoDb = (product) => __awaiter(void 0, void 0, void 0, function* () {
    product.slug = yield (0, generateUniqueSlug_1.generateUniqueSlug)(product.title, product_model_1.ProductModel);
    const result = yield product_model_1.ProductModel.create(product);
    return result;
});
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.ProductModel.find({ isDeleted: false }), query)
        .search(product_constant_1.productSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return { data: result, meta };
});
const getSingleProductById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.ProductModel.findById({
        _id,
        isDeleted: false,
    }).populate('author');
    if (!product || product.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product Not Found');
    }
    return product;
});
const getSingleProductBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.ProductModel.findOne({
        slug,
        isDeleted: false,
    }).populate('author');
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product Not Found');
    }
    return product;
});
const updateSingleProductById = (_id, updatedProduct) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.ProductModel.findOne({ _id, isDeleted: false });
        if (!product || product.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product Not Found');
        }
        if (updatedProduct.title) {
            updatedProduct.slug = yield (0, generateUniqueSlug_1.generateUniqueSlug)(product.title, product_model_1.ProductModel);
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message);
    }
    const result = yield product_model_1.ProductModel.findByIdAndUpdate(_id, Object.assign(Object.assign({}, updatedProduct), { updatedAt: new Date() }), { new: true });
    return result;
});
const deleteMultipleOrSingleMediaById = (productsId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.ProductModel.find({
        _id: { $in: productsId },
        isDeleted: false,
    }).lean();
    if (products.length !== productsId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or more media items not found or already deleted.');
    }
    yield product_model_1.ProductModel.updateMany({ _id: { $in: productsId } }, { $set: { isDeleted: true } });
});
exports.ProductService = {
    createProductIntoDb,
    getAllProducts,
    getSingleProductById,
    getSingleProductBySlug,
    updateSingleProductById,
    deleteMultipleOrSingleMediaById,
};
