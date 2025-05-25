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
exports.mediaService = void 0;
const media_model_1 = require("./media.model");
const jwtHelper_1 = require("../../helpers/jwtHelper");
const fileUploader_1 = require("../../helpers/fileUploader");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const media_constant_1 = require("./media.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const uploadSingleMediaIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = (0, jwtHelper_1.tokenDecoder)(req);
    const media = req.file;
    if (!media)
        return;
    const uploaded = yield fileUploader_1.fileUploads.uploadToCloudinary(media);
    return yield media_model_1.MediaModel.create({
        addedBy: userId,
        fileName: media.originalname,
        url: uploaded.secure_url,
    });
});
const uploadMultipleMediaIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = (0, jwtHelper_1.tokenDecoder)(req);
    const files = req.files;
    const uploadedFiles = yield Promise.all(files.map(file => fileUploader_1.fileUploads.uploadToCloudinary(file)));
    const documents = uploadedFiles.map((file, i) => ({
        addedBy: userId,
        fileName: files[i].originalname,
        url: file.secure_url,
    }));
    return yield media_model_1.MediaModel.insertMany(documents);
});
const getAllMedia = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const mediaQuery = new QueryBuilder_1.default(media_model_1.MediaModel.find(), query)
        .search(media_constant_1.mediaSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield mediaQuery.modelQuery;
    const meta = yield mediaQuery.countTotal();
    return { data: result, meta };
});
const getSingleMediaById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const media = yield media_model_1.MediaModel.findById(id);
    if (!media || media.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Media Not Found");
    }
    return media;
});
const deleteMultipleOrSingleMediaById = (mediasId) => __awaiter(void 0, void 0, void 0, function* () {
    const medias = yield media_model_1.MediaModel.find({ _id: { $in: mediasId }, isDeleted: false }).lean();
    if (medias.length !== mediasId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or more media items not found or already deleted.');
    }
    yield media_model_1.MediaModel.updateMany({ _id: { $in: mediasId } }, { $set: { isDeleted: true } }).lean();
});
exports.mediaService = {
    uploadSingleMediaIntoDB,
    uploadMultipleMediaIntoDB,
    getAllMedia,
    getSingleMediaById,
    deleteMultipleOrSingleMediaById
};
