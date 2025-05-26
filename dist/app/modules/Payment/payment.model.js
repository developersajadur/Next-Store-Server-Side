"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PaymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: [true, 'Order is required'],
    },
    method: {
        type: String,
        enum: ['cash', 'card', 'online', 'shurjo-pay'],
        required: [true, 'Payment method is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        required: [true, 'Payment status is required'],
        default: 'pending',
    },
    transactionId: {
        type: String,
        unique: [true, 'This transactionId already exist'],
        required: [true, 'Payment status is required'],
    },
    sp_order_id: {
        type: String,
        unique: [true, 'This transactionId already exist'],
        required: [true, 'Payment status is required'],
    },
    amount: { type: Number, required: [true, 'Amount is required'] },
    gatewayResponse: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.PaymentModel = mongoose_1.default.model('Payment', PaymentSchema);
