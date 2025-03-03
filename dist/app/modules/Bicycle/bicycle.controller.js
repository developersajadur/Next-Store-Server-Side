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
exports.bicycleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const bicycle_service_1 = require("./bicycle.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_utils_1 = require("../Auth/auth.utils");
const createBicycle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, auth_utils_1.tokenDecoder)(req);
    const { userId } = decoded;
    const bicycle = req.body;
    const dataToStore = Object.assign(Object.assign({}, bicycle), { author: userId });
    const result = yield bicycle_service_1.BicycleService.createBicycleIntoDb(dataToStore);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Bicycle is created successfully',
        data: result,
    });
}));
const getAllBiCycles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bicycles = yield bicycle_service_1.BicycleService.getAllBiCycle(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Bicycles retrieved successfully',
        data: bicycles,
    });
}));
const getSingleBiCycleById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bicycle = yield bicycle_service_1.BicycleService.getSingleBiCycleById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Bicycle retrieved successfully',
        data: bicycle,
    });
}));
const getSingleBiCycleBySlug = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bicycle = yield bicycle_service_1.BicycleService.getSingleBiCycleBySlug(req.params.slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Bicycle retrieved successfully',
        data: bicycle,
    });
}));
const updateSingleBiCycleById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const updatedBicycle = yield bicycle_service_1.BicycleService.updateSingleBiCycleById((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id, req === null || req === void 0 ? void 0 : req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Bicycle updated successfully',
        data: updatedBicycle,
    });
}));
const deleteSingleBiCycleById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield bicycle_service_1.BicycleService.deleteSingleBiCycleById((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Bicycle deleted successfully',
        data: null,
    });
}));
exports.bicycleController = {
    createBicycle,
    getAllBiCycles,
    getSingleBiCycleById,
    updateSingleBiCycleById,
    deleteSingleBiCycleById,
    getSingleBiCycleBySlug,
};
