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
exports.orderService = void 0;
const order_model_1 = __importDefault(require("./order.model"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_utils_1 = require("./order.utils");
const bicycle_model_1 = require("../Bicycle/bicycle.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const createOrder = (user, payload, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = payload === null || payload === void 0 ? void 0 : payload.products) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Order is not specified');
    }
    const products = payload.products;
    let totalPrice = 0;
    // Fetch product details & update stock
    const productDetails = yield Promise.all(products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield bicycle_model_1.BicycleModel.findById(item.product);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        if (!product.inStock || product.stockQuantity < item.quantity) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Not enough stock for ${product.name}`);
        }
        // Deduct stock
        product.stockQuantity -= item.quantity;
        // If stock reaches 0, set inStock to false
        if (product.stockQuantity === 0) {
            product.inStock = false;
        }
        // Save updated product stock
        yield product.save();
        const subtotal = (product.price || 0) * item.quantity;
        totalPrice += subtotal;
        return { product: product._id, quantity: item.quantity };
    })));
    // Create the order
    const order = yield order_model_1.default.create({
        user: user._id,
        products: productDetails,
        totalPrice,
    });
    // Payment integration
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
    const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        yield order_model_1.default.findByIdAndUpdate(order._id, {
            $set: {
                transaction: {
                    id: payment.sp_order_id,
                    transactionStatus: payment.transactionStatus,
                },
            },
        });
    }
    return payment.checkout_url;
});
const getOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find(query), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    return result;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        yield order_model_1.default.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == 'Success'
                ? 'Paid'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'Pending'
                    : verifiedPayment[0].bank_status == 'Cancel'
                        ? 'Cancelled'
                        : '',
        });
    }
    return verifiedPayment;
});
const updateOrderStatus = (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(status.status);  // Log the status correctly
    // Find the order
    const order = yield order_model_1.default.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    // Define allowed transitions
    const allowedTransitions = {
        Pending: ['Paid', 'Cancelled'],
        Paid: ['Shipped', 'Cancelled'],
        Shipped: ['Completed', 'Cancelled'],
        Completed: [],
        Cancelled: [],
    };
    // Get the current status and check if the status transition is allowed
    const currentStatus = order.status;
    if (!allowedTransitions[currentStatus].includes(status.status)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Cannot change status from "${currentStatus}" to "${status.status}"`);
    }
    // Update the order status
    const updatedOrder = yield order_model_1.default.findByIdAndUpdate(orderId, { status: status.status }, { new: true });
    if (!updatedOrder) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    return updatedOrder;
});
const getOrdersForMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield order_model_1.default.find({ user: userId }).lean();
    return data;
});
exports.orderService = {
    createOrder,
    getOrders,
    verifyPayment,
    getOrdersForMe,
    updateOrderStatus,
};
