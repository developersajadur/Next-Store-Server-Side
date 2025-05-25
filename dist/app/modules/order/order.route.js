"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const orderRouter = (0, express_1.Router)();
orderRouter.get('/verify', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), order_controller_1.orderController.verifyPayment);
orderRouter.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), order_controller_1.orderController.createOrder);
orderRouter.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), order_controller_1.orderController.getOrders);
orderRouter.get('/get-my-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), order_controller_1.orderController.getOrdersForMe);
orderRouter.post('/change-status/:orderId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), order_controller_1.orderController.updateOrderStatus);
exports.default = orderRouter;
