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
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const bicycle_model_1 = require("../Bicycle/bicycle.model");
const OrderSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
});
// pre middleware
OrderSchema.pre('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const order = this;
    order.createdAt = new Date();
    order.updatedAt = new Date();
    next();
});
// post middleware
OrderSchema.post('save', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { product: productId, quantity } = doc;
            const product = yield bicycle_model_1.BicycleModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            // check Validate stock
            if (product.quantity < quantity) {
                throw new Error('Insufficient stock for this product');
            }
            // Reduce stock
            product.quantity -= quantity;
            // Set inStock to false if quantity becomes 0
            product.inStock = product.quantity > 0;
            yield product.save();
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
exports.OrderModel = (0, mongoose_1.model)('orders', OrderSchema);
