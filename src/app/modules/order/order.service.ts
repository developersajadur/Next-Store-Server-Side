import mongoose from 'mongoose';
import Order from '../Order/order.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser, TUserRole } from '../User/user.interface';
import QueryBuilder from '../../builders/QueryBuilder';
import { ProductModel } from '../Product/product.model';
import { PaymentModel } from '../Payment/payment.model';
import { IOrderStatus } from './order.interface';
import { generateTransactionId } from '../../helpers/transactionIdGenerator';
import { paymentUtils } from '../Payment/payment.utils';
import { orderSearchableFields } from './order.constant';
import { USER_ROLE } from '../User/user.constant';

const createOrder = async (
  user: TUser,
  payload: {
    products: { product: string; quantity: number }[];
    method: 'online' | 'cash';
  },
  client_ip: string,
) => {
  if (!payload?.products?.length) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Order is not specified');
  }

  const products = payload.products;
  let totalPrice = 0;

  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await ProductModel.findById(item.product);
      if (!product || product.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, `Product not found`);
      }
      if (!product.inStock || product.stockQuantity < item.quantity) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          `Not enough stock for ${product.title}`,
        );
      }
      product.stockQuantity -= item.quantity;

      if (product.stockQuantity === 0) {
        product.inStock = false;
      }

      await product.save();

      const subtotal = product.price * item.quantity;
      totalPrice += subtotal;

      return { product: product._id, quantity: item.quantity };
    }),
  );

  const order = await Order.create({
    userId: user._id,
    products: productDetails,
    totalPrice,
  });

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

    const payment = await paymentUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus && payment.checkout_url) {
      await PaymentModel.create({
        userId: user._id,
        orderId: order._id,
        amount: totalPrice,
        transactionId: generateTransactionId(),
        gatewayResponse: payment.transactionStatus,
        method: payload.method,
      });
    }

    return payment.checkout_url;
  }
  return;
};

const getOrders = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Order.find().populate('userId'), query)
    .search(orderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return { data: result, meta };
};

const getSingleOrderById = async (
  orderId: string,
  role: TUserRole,
  userId: string,
) => {
  if (role === USER_ROLE.customer) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order Not Found');
    }
    const orderUserId = order.userId.toString();
    if (orderUserId !== userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You Cat't Access Others Order",
      );
    }
    return order;
  }

  if (role === USER_ROLE.admin) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order Not Found');
    }
    return order;
  }
  return null;
};

const updateOrderStatus = async (orderId: string, status: IOrderStatus) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    const payment = await PaymentModel.findOne({
      orderId: orderId,
      userId: order.userId,
    }).session(session);

    if (
      !payment ||
      payment.status === 'failed' ||
      payment.status === 'pending' ||
      payment.status === 'refunded'
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Order Have No Payment Record',
      );
    }

    const allowedTransitions: Record<IOrderStatus, IOrderStatus[]> = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Shipped', 'Cancelled'],
      Shipped: ['Delivered', 'Cancelled'],
      Delivered: ['Returned'],
      Cancelled: [],
      Returned: [],
    };

    const currentStatus = order.status as IOrderStatus;
    const nextStatus = status;

    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot change status from "${currentStatus}" to "${nextStatus}"`,
      );
    }

    order.status = nextStatus;

    if (nextStatus === 'Delivered') {
      order.DeliveredAt = new Date();
    }

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getOrdersForMe = async (userId: string) => {
  const data = await Order.find({ userId }).lean();
  return data;
};

export const orderService = {
  createOrder,
  getOrders,
  getOrdersForMe,
  updateOrderStatus,
  getSingleOrderById,
};
