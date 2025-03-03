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
exports.BicycleService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const bicycle_constant_1 = require("./bicycle.constant");
const bicycle_model_1 = require("./bicycle.model");
const slugify_1 = __importDefault(require("slugify"));
const createBicycleIntoDb = (bicycle) => __awaiter(void 0, void 0, void 0, function* () {
    let slug = (0, slugify_1.default)(bicycle.name, { lower: true, strict: true });
    let counter = 1;
    while (yield bicycle_model_1.BicycleModel.findOne({ slug })) {
        slug = (0, slugify_1.default)(bicycle.name, { lower: true, strict: true }) + `-${counter}`;
        counter++;
    }
    bicycle.slug = slug;
    // Create the bicycle in the database
    const result = yield bicycle_model_1.BicycleModel.create(bicycle);
    return result;
});
const getAllBiCycle = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const biCycleQuery = new QueryBuilder_1.default(bicycle_model_1.BicycleModel.find({ isDeleted: false }).populate('author'), query)
        .search(bicycle_constant_1.bicycleSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield biCycleQuery.modelQuery;
    const meta = yield biCycleQuery.countTotal();
    return { data: result, meta };
});
const getSingleBiCycleById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const bicycle = yield bicycle_model_1.BicycleModel.findById({
        _id,
        isDeleted: false,
    }).populate('author');
    if (!bicycle) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bicycle Not Found');
    }
    return bicycle;
});
const getSingleBiCycleBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const bicycle = yield bicycle_model_1.BicycleModel.findOne({
        slug,
        isDeleted: false,
    }).populate('author');
    if (!bicycle) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bicycle Not Found');
    }
    return bicycle;
});
const updateSingleBiCycleById = (_id, updatedBicycle) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(updatedBicycle);
    // console.log(_id, updatedBicycle);
    try {
        const bicycle = yield bicycle_model_1.BicycleModel.findOne({ _id, isDeleted: false });
        if (!bicycle) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bicycle Not Found');
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message);
    }
    const result = yield bicycle_model_1.BicycleModel.findByIdAndUpdate(_id, Object.assign(Object.assign({}, updatedBicycle), { updatedAt: new Date() }), { new: true });
    return result;
});
const deleteSingleBiCycleById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bicycle = yield bicycle_model_1.BicycleModel.findOne({ _id, isDeleted: false });
        if (!bicycle) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bicycle Not Found');
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message);
    }
    const result = yield bicycle_model_1.BicycleModel.findByIdAndUpdate(_id, { isDeleted: true, updatedAt: new Date() }, { new: true });
    return result;
});
exports.BicycleService = {
    createBicycleIntoDb,
    getAllBiCycle,
    getSingleBiCycleById,
    updateSingleBiCycleById,
    deleteSingleBiCycleById,
    getSingleBiCycleBySlug,
};
