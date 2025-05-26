"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = __importDefault(require("../helpers/catchAsync"));
const user_model_1 = require("../modules/User/user.model");
const jwtHelper_1 = require("../helpers/jwtHelper");
const config_1 = __importDefault(require("../config"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        const verifiedUser = (0, jwtHelper_1.verifyToken)(token, config_1.default.jwt_token_secret);
        const user = user_model_1.UserModel.findById(verifiedUser.userId);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found!');
        }
        if (user.isBlocked) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is blocked!');
        }
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is Deleted!');
        }
        if (verifiedUser.exp && Date.now() >= verifiedUser.exp * 1000) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Token expired.');
        }
        if (requiredRoles && !requiredRoles.includes(verifiedUser.role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        req.user = verifiedUser;
        next();
    });
};
exports.default = auth;
