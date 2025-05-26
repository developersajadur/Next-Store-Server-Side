"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploads = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const stream_1 = require("stream");
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.cloud_api_key,
    api_secret: config_1.default.cloudinary.cloud_api_secret,
});
const storage = multer_1.default.memoryStorage();
const multerConfig = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB per file
});
const upload = {
    single: multerConfig.single('file'),
    multiple: multerConfig.array('files', 5),
};
const bufferToStream = (buffer) => {
    const readable = new stream_1.Readable();
    readable._read = () => { };
    readable.push(buffer);
    readable.push(null);
    return readable;
};
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        bufferToStream(file.buffer).pipe(uploadStream);
    });
};
const uploadMultipleToCloudinary = async (files) => {
    return Promise.all(files.map(file => uploadToCloudinary(file)));
};
exports.fileUploads = {
    upload,
    uploadToCloudinary,
    uploadMultipleToCloudinary,
};
