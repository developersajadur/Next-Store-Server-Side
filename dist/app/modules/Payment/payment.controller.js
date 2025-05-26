"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const payment_service_1 = require("./payment.service");
const verifyPayment = (0, catchAsync_1.default)(async (req, res) => {
    const payment = await payment_service_1.paymentService.verifyPayment(req.query.order_id);
    const verifiedPaymentResponse = JSON.parse(JSON.stringify(payment));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Order verified successfully',
        data: verifiedPaymentResponse,
    });
});
const getAllPayment = (0, catchAsync_1.default)(async (req, res) => {
    const orders = await payment_service_1.paymentService.getAllPayment(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Orders retrieved successfully',
        data: orders,
    });
});
const getSinglePaymentById = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const role = req.user.role;
    const { paymentId } = req.params;
    const payment = await payment_service_1.paymentService.getSinglePaymentById(paymentId, role, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Payment retrieved successfully',
        data: payment,
    });
});
const getMyPayment = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const payments = await payment_service_1.paymentService.getMyPayment(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'My Payments retrieved successfully',
        data: payments,
    });
});
exports.paymentController = {
    verifyPayment,
    getAllPayment,
    getSinglePaymentById,
    getMyPayment
};
