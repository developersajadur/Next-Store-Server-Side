"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../User/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const loginUser = async (payload) => {
    const user = await user_model_1.UserModel.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found');
    }
    else if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User Is Blocked');
    }
    const passwordMatch = await bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!passwordMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid password!');
    }
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id.toString(),
        email: user === null || user === void 0 ? void 0 : user.email,
        profileImage: user === null || user === void 0 ? void 0 : user.profileImage,
        role: user === null || user === void 0 ? void 0 : user.role,
        loginType: user.loginType
    };
    const token = (0, jwtHelper_1.createToken)(jwtPayload, config_1.default.jwt_token_secret, config_1.default.jwt_refresh_expires_in);
    return { token };
};
exports.AuthServices = {
    loginUser,
};
