"use strict";
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
const order_model_1 = __importDefault(require("../Order/order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const verifyPayment = async (order_id) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const verifiedPayment = await payment_utils_1.paymentUtils.verifyPaymentAsync(order_id);
        if (verifiedPayment.length) {
            const paymentStatus = verifiedPayment[0].bank_status === 'Success'
                ? 'paid'
                : verifiedPayment[0].bank_status === 'failed'
                    ? 'pending'
                    : verifiedPayment[0].bank_status === 'Cancel'
                        ? 'failed'
                        : 'failed';
            const updatedPayment = await payment_model_1.PaymentModel.findOneAndUpdate({ sp_order_id: order_id }, {
                gatewayResponse: verifiedPayment[0],
                status: paymentStatus,
            }, {
                new: true,
                session,
            }).populate('userId', 'name email phone');
            if (!updatedPayment) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment Record Not Found');
            }
            await order_model_1.default.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.orderId, {
                isPaid: paymentStatus,
                paidAt: paymentStatus === 'paid' ? new Date() : undefined,
            }, { session });
            await session.commitTransaction();
            session.endSession();
            return updatedPayment;
        }
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const getAllPayment = async (query) => {
    const paymentQuery = new QueryBuilder_1.default(payment_model_1.PaymentModel.find().populate({
        path: 'userId',
        select: 'name email profileImage',
    }), query)
        .search(payment_constant_1.paymentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await paymentQuery.modelQuery;
    const meta = await paymentQuery.countTotal();
    return { data: result, meta };
};
const getSinglePaymentById = async (paymentId, role, userId) => {
    if (role === user_constant_1.USER_ROLE.customer) {
        const payment = await payment_model_1.PaymentModel.findById(paymentId);
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
        const payment = await payment_model_1.PaymentModel.findById(paymentId).populate({
            path: 'userId',
            select: 'name email profileImage',
        });
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment Not Found');
        }
        return payment;
    }
    return null;
};
const getMyPayment = async (query, userId) => {
    const paymentQuery = new QueryBuilder_1.default(payment_model_1.PaymentModel.find({ userId }), query)
        .search(payment_constant_1.paymentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await paymentQuery.modelQuery;
    const meta = await paymentQuery.countTotal();
    return { data: result, meta };
};
exports.paymentService = {
    verifyPayment,
    getAllPayment,
    getSinglePaymentById,
    getMyPayment,
};
