"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const media_controller_1 = require("./media.controller");
const fileUploader_1 = require("../../helpers/fileUploader");
const router = (0, express_1.Router)();
// Single image upload
router.post('/upload-single-media', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.customer), fileUploader_1.fileUploads.upload.single, media_controller_1.mediaController.uploadSingleMediaIntoDB);
// Multiple images upload
router.post('/upload-multiple-media', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.customer), fileUploader_1.fileUploads.upload.multiple, media_controller_1.mediaController.uploadMultipleMediaIntoDB);
router.get('/all-media', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), media_controller_1.mediaController.getAllMedia);
router.get('/get-single-media/:mediaId', media_controller_1.mediaController.getSingleMediaById);
router.delete('/delete-media', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), media_controller_1.mediaController.deleteMultipleOrSingleMediaById);
exports.mediaRouter = router;
