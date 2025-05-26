"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = __importDefault(require("../Order/order.model"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const product_model_1 = require("../Product/product.model");
const payment_model_1 = require("../Payment/payment.model");
const transactionIdGenerator_1 = require("../../helpers/transactionIdGenerator");
const payment_utils_1 = require("../Payment/payment.utils");
const order_constant_1 = require("./order.constant");
const user_constant_1 = require("../User/user.constant");
const user_model_1 = require("../User/user.model");
const createOrder = async (userId, payload, client_ip) => {
    var _a;
    const user = (await user_model_1.UserModel.findById(userId));
    if (!user || user.isBlocked)
        if (!((_a = payload === null || payload === void 0 ? void 0 : payload.products) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Order is not specified');
        }
    const products = payload.products;
    let totalPrice = 0;
    const productDetails = await Promise.all(products.map(async (item) => {
        const product = await product_model_1.ProductModel.findById(item.product);
        if (!product || product.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        if (product.stock_quantity < item.quantity) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Not enough stock for ${product.title}`);
        }
        product.stock_quantity -= item.quantity;
        await product.save();
        const subtotal = product.price * item.quantity;
        totalPrice += subtotal;
        return { product: product._id, quantity: item.quantity };
    }));
    // create order
    const order = await order_model_1.default.create(Object.assign(Object.assign({}, payload), { userId: user._id, products: productDetails, totalPrice }));
    if (payload.method === 'online') {
        const shurjopayPayload = {
            amount: totalPrice,
            order_id: order._id,
            currency: 'BDT',
            customer_name: user.name,
            customer_address: user.address,
            customer_email: user.email,
            customer_phone: user.phone,
            customer_city: user.city,
            client_ip,
        };
        const payment = await payment_utils_1.paymentUtils.makePaymentAsync(shurjopayPayload);
        // console.log(payment, "payment");
        if ((payment === null || payment === void 0 ? void 0 : payment.transactionStatus) && payment.checkout_url) {
            await payment_model_1.PaymentModel.create({
                userId: user._id,
                orderId: order._id,
                amount: totalPrice,
                transactionId: (0, transactionIdGenerator_1.generateTransactionId)(),
                sp_order_id: payment.sp_order_id,
                method: payload.method,
            });
        }
        return payment.checkout_url;
    }
    return;
};
const getOrders = async (query) => {
    const productQuery = new QueryBuilder_1.default(order_model_1.default.find().populate('userId'), query)
        .search(order_constant_1.orderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { data: result, meta };
};
const getSingleOrderById = async (orderId, role, userId) => {
    if (role === user_constant_1.USER_ROLE.customer) {
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order Not Found');
        }
        const orderUserId = order.userId.toString();
        if (orderUserId !== userId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You Cat't Access Others Order");
        }
        return order;
    }
    if (role === user_constant_1.USER_ROLE.admin) {
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order Not Found');
        }
        return order;
    }
    return null;
};
const updateOrderStatus = async (orderId, status) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const order = await order_model_1.default.findById(orderId).session(session);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
        }
        const payment = await payment_model_1.PaymentModel.findOne({
            orderId: orderId
        }).session(session);
        if (!payment ||
            payment.status === 'failed' ||
            payment.status === 'pending' ||
            payment.status === 'refunded') {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Order Have No Payment Record');
        }
        const allowedTransitions = {
            Pending: ['Confirmed', 'Cancelled'],
            Confirmed: ['Shipped', 'Cancelled'],
            Shipped: ['Delivered', 'Cancelled'],
            Delivered: ['Returned'],
            Cancelled: [],
            Returned: [],
        };
        const currentStatus = order.status;
        const nextStatus = status;
        if (!allowedTransitions[currentStatus].includes(nextStatus)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Cannot change status from "${currentStatus}" to "${nextStatus}"`);
        }
        order.status = nextStatus;
        if (nextStatus === 'Delivered') {
            order.DeliveredAt = new Date();
        }
        await order.save({ session });
        await session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const getOrdersForMe = async (userId) => {
    const data = await order_model_1.default.find({ userId }).lean();
    return data;
};
exports.orderService = {
    createOrder,
    getOrders,
    getOrdersForMe,
    updateOrderStatus,
    getSingleOrderById,
};
