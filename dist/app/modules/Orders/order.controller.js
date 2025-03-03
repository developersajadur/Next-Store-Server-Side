"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("./order.service");
const order_validation_1 = __importDefault(require("./order.validation"));
const zod_1 = require("zod");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        // data validation using zod
        const zodParsedData = order_validation_1.default.parse(orderData);
        const result = yield order_service_1.OrderService.createOrderDb(zodParsedData);
        res.status(200).json({
            success: true,
            message: 'Order created successfully',
            data: result,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Zod validation error handling
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: {
                    name: error.name,
                    errors: error.errors.reduce((acc, err) => {
                        acc[err.path[0]] = {
                            message: err.message,
                            name: 'ValidatorError',
                            properties: {
                                message: err.message,
                            },
                            path: err.path,
                            value: err.input,
                        };
                        return acc;
                    }, {}),
                },
            });
        }
        else {
            // Handle other unexpected errors
            res.status(500).json({
                success: false,
                message: 'Failed to create order. Please try again.',
                error: error.message || 'An unexpected error occurred',
            });
        }
    }
});
// show all orders
const showAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.OrderService.showAllOrders();
        res.status(200).json({
            success: true,
            message: 'Get Orders successfully',
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders. Please try again.',
            error: error.message || 'An unexpected error occurred',
        });
    }
});
// showTotalRevenue
const showTotalRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRevenue = yield order_service_1.OrderService.showTotalRevenue();
        res.status(200).json({
            success: true,
            message: 'Revenue calculated successfully',
            data: {
                totalRevenue,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch total revenue. Please try again.',
            error: error.message || 'An unexpected error occurred',
        });
    }
});
exports.OrderController = {
    createOrder,
    showTotalRevenue,
    showAllOrders,
};
