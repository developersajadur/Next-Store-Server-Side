"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const router = (0, express_1.Router)();
router.post('/make-order', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), order_controller_1.orderController.createOrder);
router.get('/get-all-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), order_controller_1.orderController.getOrders);
router.get('/get-my-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), order_controller_1.orderController.getOrdersForMe);
router.get('/get-order-by-id/:orderId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.customer), order_controller_1.orderController.getSingleOrderById);
router.post('/change-status/:orderId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), order_controller_1.orderController.updateOrderStatus);
exports.orderRouter = router;
