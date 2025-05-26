"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = void 0;
const media_model_1 = require("./media.model");
const fileUploader_1 = require("../../helpers/fileUploader");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const media_constant_1 = require("./media.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const uploadSingleMediaIntoDB = async (req) => {
    const media = req.file;
    const user = req.user;
    if (!media)
        return;
    const uploaded = await fileUploader_1.fileUploads.uploadToCloudinary(media);
    return await media_model_1.MediaModel.create({
        addedBy: user === null || user === void 0 ? void 0 : user.userId,
        fileName: media.originalname,
        url: uploaded.secure_url,
    });
};
const uploadMultipleMediaIntoDB = async (req) => {
    const files = req.files;
    const user = req.user;
    const uploadedFiles = await Promise.all(files.map(file => fileUploader_1.fileUploads.uploadToCloudinary(file)));
    const documents = uploadedFiles.map((file, i) => ({
        addedBy: user === null || user === void 0 ? void 0 : user.userId,
        fileName: files[i].originalname,
        url: file.secure_url,
    }));
    return await media_model_1.MediaModel.insertMany(documents);
};
const getAllMedia = async (query) => {
    const mediaQuery = new QueryBuilder_1.default(media_model_1.MediaModel.find(), query)
        .search(media_constant_1.mediaSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await mediaQuery.modelQuery;
    const meta = await mediaQuery.countTotal();
    return { data: result, meta };
};
const getSingleMediaById = async (id) => {
    const media = await media_model_1.MediaModel.findById(id);
    if (!media || media.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Media Not Found");
    }
    return media;
};
const deleteMultipleOrSingleMediaById = async (mediasId) => {
    const medias = await media_model_1.MediaModel.find({ _id: { $in: mediasId }, isDeleted: false }).lean();
    if (medias.length !== mediasId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or more media items not found or already deleted.');
    }
    await media_model_1.MediaModel.updateMany({ _id: { $in: mediasId } }, { $set: { isDeleted: true } }).lean();
};
exports.mediaService = {
    uploadSingleMediaIntoDB,
    uploadMultipleMediaIntoDB,
    getAllMedia,
    getSingleMediaById,
    deleteMultipleOrSingleMediaById
};
