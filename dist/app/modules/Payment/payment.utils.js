"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentUtils = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const shurjopay_1 = __importDefault(require("shurjopay"));
const config_1 = __importDefault(require("../../config"));
const shurjopay = new shurjopay_1.default();
shurjopay.config(config_1.default.sp_endpoint, config_1.default.sp_username, config_1.default.sp_password, config_1.default.sp_prefix, config_1.default.sp_return_url);
// Make payment asynchronously
const makePaymentAsync = async (paymentPayload) => {
    try {
        return new Promise((resolve, reject) => {
            shurjopay.makePayment(paymentPayload, (response) => resolve(response), (error) => reject(error));
        });
    }
    catch (error) {
        console.error('Error making payment:', error);
        throw error;
    }
};
// Verify payment asynchronously
const verifyPaymentAsync = async (order_id) => {
    try {
        return new Promise((resolve, reject) => {
            shurjopay.verifyPayment(order_id, (response) => resolve(response), (error) => reject(error));
        });
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};
exports.paymentUtils = {
    makePaymentAsync,
    verifyPaymentAsync,
};
