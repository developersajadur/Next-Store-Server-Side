"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.get('/verify-payment', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), payment_controller_1.paymentController.verifyPayment);
router.get('/all-payments', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), payment_controller_1.paymentController.getAllPayment);
router.get('/get-payment-by-id/paymentId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.customer), payment_controller_1.paymentController.getSinglePaymentById);
exports.paymentRouter = router;
