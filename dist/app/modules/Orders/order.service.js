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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_model_1 = require("./order.model");
const bicycle_model_1 = require("../Bicycle/bicycle.model");
const createOrderDb = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield bicycle_model_1.BicycleModel.findById(order.product);
    if (!product) {
        throw new Error('Product not found');
    }
    const totalPrice = product.price * order.quantity;
    order.totalPrice = totalPrice;
    const result = yield order_model_1.OrderModel.create(order);
    return result;
});
// show all orders
const showAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.OrderModel.find({});
    return orders;
});
// Calculate total revenue from all orders
const showTotalRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalRevenue = yield order_model_1.OrderModel.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
        { $project: { _id: 0, totalRevenue: 1 } },
    ]);
    return ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
});
exports.OrderService = {
    createOrderDb,
    showTotalRevenue,
    showAllOrders,
};
