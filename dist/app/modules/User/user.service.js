"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const user_constant_1 = require("./user.constant");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const createUserIntoDb = async (payload) => {
    const isUserExist = await user_model_1.UserModel.findOne({ email: payload.email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User with this email already exists');
    }
    const user = await user_model_1.UserModel.create(payload);
    const jwtPayload = {
        userId: user._id.toString(),
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        loginType: user.loginType
    };
    const token = (0, jwtHelper_1.createToken)(jwtPayload, config_1.default.jwt_token_secret, config_1.default.jwt_refresh_expires_in);
    return { user, token };
};
const getSingleUser = async (userId) => {
    const user = await user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
};
const getAllUsers = async (query) => {
    const userQuery = new QueryBuilder_1.default(user_model_1.UserModel.find(), query)
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return { result, meta };
};
const updateUser = async (userId, userInfo) => {
    const user = await user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.isBlocked) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is blocked');
    }
    const updatedFields = Object.assign(Object.assign({}, userInfo), { updatedAt: new Date() });
    const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(userId, updatedFields, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
};
const changePassword = async (userId, newPassword, currentPassword) => {
    const user = await user_model_1.UserModel.findById(userId).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.loginType !== user_interface_1.LOGIN_TYPE.PASSWORD) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not registered by password');
    }
    const passwordMatch = await bcrypt_1.default.compare(currentPassword, user.password);
    if (!passwordMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid current password!');
    }
    if (currentPassword === newPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'New password cannot be the same as the current password!');
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, Number(config_1.default.salt_rounds));
    user.password = hashedPassword;
    // await user.save();
    const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(userId, { password: hashedPassword, updatedAt: new Date() }, { new: true, runValidators: true });
    return updatedUser;
};
const blockUser = async (userId) => {
    const blockedUser = await user_model_1.UserModel.findByIdAndUpdate(userId, {
        isBlocked: true,
    });
    if (!blockedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (blockedUser.isBlocked) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'User is already blocked');
    }
    return blockedUser;
};
const unblockUser = async (userId) => {
    const unblockedUser = await user_model_1.UserModel.findByIdAndUpdate(userId, {
        isBlocked: false,
    });
    if (!unblockedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!unblockedUser.isBlocked) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'User is already unblocked');
    }
    return unblockedUser;
};
exports.userService = {
    createUserIntoDb,
    getAllUsers,
    getSingleUser,
    updateUser,
    changePassword,
    blockUser,
    unblockUser,
};
