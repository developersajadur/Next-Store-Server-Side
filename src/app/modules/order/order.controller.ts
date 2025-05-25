import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { tokenDecoder } from '../Auth/auth.utils';
import { TUser } from '../User/user.interface';
import { UserModel } from '../User/user.model';
import { orderService } from '../Order/order.service';
import httpStatus from 'http-status';

const createOrder = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  // console.log(userId);

  const user = (await UserModel.findById(userId)) as TUser;
  const order = await orderService.createOrder(user, req.body, req.ip!);

  const orderResponse = JSON.parse(JSON.stringify(order));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order placed successfully',
    data: orderResponse,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.orderId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order status updated successfully',
    data: order,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getOrders(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully',
    data: orders,
  });
});

const getSingleOrderById = catchAsync(async (req, res) => {
   const decoded = tokenDecoder(req);
  const { role, userId } = decoded;
  const {orderId} = req.params;
  const orders = await orderService.getSingleOrderById(orderId, role, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order retrieved successfully',
    data: orders,
  });
});



const getOrdersForMe = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  const response = await orderService.getOrdersForMe(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully',
    data: response,
  });
});

export const orderController = {
  createOrder,
  getOrders,
  getOrdersForMe,
  updateOrderStatus,
  getSingleOrderById
};
