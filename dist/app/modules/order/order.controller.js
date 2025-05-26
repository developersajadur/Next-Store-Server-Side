"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const catchAsync_1 = __importDefault(require("../../helpers/catchAsync"));
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const order_service_1 = require("../Order/order.service");
const http_status_1 = __importDefault(require("http-status"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { userId } = decoded;
    // console.log(userId);
    // console.log(req.body);
    const order = await order_service_1.orderService.createOrder(userId, req.body, req.ip);
    const orderResponse = JSON.parse(JSON.stringify(order));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Order placed successfully',
        data: orderResponse,
    });
});
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const order = await order_service_1.orderService.updateOrderStatus(req.params.orderId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Order status updated successfully',
        data: order,
    });
});
const getOrders = (0, catchAsync_1.default)(async (req, res) => {
    const orders = await order_service_1.orderService.getOrders(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Orders retrieved successfully',
        data: orders,
    });
});
const getSingleOrderById = (0, catchAsync_1.default)(async (req, res) => {
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { role, userId } = decoded;
    const { orderId } = req.params;
    const orders = await order_service_1.orderService.getSingleOrderById(orderId, role, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Order retrieved successfully',
        data: orders,
    });
});
const getOrdersForMe = (0, catchAsync_1.default)(async (req, res) => {
    const decoded = (0, jwtHelper_1.tokenDecoder)(req);
    const { userId } = decoded;
    const response = await order_service_1.orderService.getOrdersForMe(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Orders retrieved successfully',
        data: response,
    });
});
exports.orderController = {
    createOrder,
    getOrders,
    getOrdersForMe,
    updateOrderStatus,
    getSingleOrderById
};
