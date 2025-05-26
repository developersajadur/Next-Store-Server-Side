"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthServices.loginUser(req === null || req === void 0 ? void 0 : req.body);
    const { token } = result;
    res.cookie('token', token, {
        secure: config_1.default.node_env === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged in successfully!',
        data: { token },
    });
});
exports.AuthControllers = {
    loginUser,
};
