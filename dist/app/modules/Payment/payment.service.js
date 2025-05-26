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
exports.paymentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const user_constant_1 = require("../User/user.constant");
const payment_constant_1 = require("./payment.constant");
const payment_model_1 = require("./payment.model");
const payment_utils_1 = require("./payment.utils");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield payment_utils_1.paymentUtils.verifyPaymentAsync(order_id);
    // console.log(verifiedPayment);
    if (verifiedPayment.length) {
        const paymentStatus = verifiedPayment[0].bank_status === 'Success'
            ? 'paid'
            : verifiedPayment[0].bank_status === 'failed'
                ? 'pending'
                : verifiedPayment[0].bank_status === 'Cancel'
                    ? 'failed'
                    : 'failed';
        const updatedPayment = yield payment_model_1.PaymentModel.findOneAndUpdate({ sp_order_id: order_id }, {
            gatewayResponse: verifiedPayment[0],
            status: paymentStatus,
        }, { new: true });
        return updatedPayment;
    }
});
const getAllPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQuery = new QueryBuilder_1.default(payment_model_1.PaymentModel.find().populate({
        path: 'userId',
        select: 'name email profileImage',
    }), query)
        .search(payment_constant_1.paymentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield paymentQuery.modelQuery;
    const meta = yield paymentQuery.countTotal();
    return { data: result, meta };
});
const getSinglePaymentById = (paymentId, role, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === user_constant_1.USER_ROLE.customer) {
        const payment = yield payment_model_1.PaymentModel.findById(paymentId);
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment Not Found');
        }
        const paymentUserId = payment.userId.toString();
        const stringUserId = userId.toString();
        if (paymentUserId !== stringUserId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You Cat't Access Others Payment");
        }
        return payment;
    }
    if (role === user_constant_1.USER_ROLE.admin) {
        const payment = yield payment_model_1.PaymentModel.findById(paymentId).populate({
            path: 'userId',
            select: 'name email profileImage',
        });
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment Not Found');
        }
        return payment;
    }
    return null;
});
const getMyPayment = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQuery = new QueryBuilder_1.default(payment_model_1.PaymentModel.find({ userId }), query)
        .search(payment_constant_1.paymentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield paymentQuery.modelQuery;
    const meta = yield paymentQuery.countTotal();
    return { data: result, meta };
});
exports.paymentService = {
    verifyPayment,
    getAllPayment,
    getSinglePaymentById,
    getMyPayment,
};
