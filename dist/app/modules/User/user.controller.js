"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const user_service_1 = require("./user.service");
const jwtHelper_1 = require("../../helpers/jwtHelper");
const createUserIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const { user, token } = await user_service_1.userService.createUserIntoDb(req === null || req === void 0 ? void 0 : req.body);
    const responseData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        loginType: user.loginType
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WOW! Registration successful',
        data: { responseData, token },
    });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const users = await user_service_1.userService.getAllUsers(req === null || req === void 0 ? void 0 : req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: users,
    });
});
const getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.userService.getSingleUser(req === null || req === void 0 ? void 0 : req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: user,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { userId } = decoded;
    const updatedUser = await user_service_1.userService.updateUser(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser,
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { newPassword, currentPassword } = req.body;
    const { userId } = decoded;
    // Call the changePassword service
    const updatedUser = await user_service_1.userService.changePassword(userId, newPassword, currentPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password updated successfully',
        data: updatedUser,
    });
});
const blockUser = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.body;
    // console.log(userId);
    const blockedUser = await user_service_1.userService.blockUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User blocked successfully',
        data: blockedUser,
    });
});
const unBlockUser = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.body;
    const unBlockedUser = await user_service_1.userService.unblockUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User unblocked successfully',
        data: unBlockedUser,
    });
});
exports.userController = {
    createUserIntoDb,
    getAllUsers,
    getSingleUser,
    updateUser,
    changePassword,
    blockUser,
    unBlockUser,
};
