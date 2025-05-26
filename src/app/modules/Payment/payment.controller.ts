import  httpStatus from 'http-status';
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";
import { paymentService } from "./payment.service";
import { Request } from 'express';
import { TTokenUser } from '../Auth/auth.interface';


const verifyPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.verifyPayment(req.query.order_id as string);

  const verifiedPaymentResponse = JSON.parse(JSON.stringify(payment));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order verified successfully',
    data: verifiedPaymentResponse,
  });
});


const getAllPayment = catchAsync(async (req, res) => {
  const orders = await paymentService.getAllPayment(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully',
    data: orders,
  });
});


const getSinglePaymentById = catchAsync(async (req:Request &{user?: TTokenUser}, res) => {
    const userId = req.user!.userId;
    const role = req.user!.role;
  const {paymentId} = req.params;
  const payment = await paymentService.getSinglePaymentById(paymentId, role, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment retrieved successfully',
    data: payment,
  });
});


const getMyPayment = catchAsync(async (req:Request &{user?: TTokenUser}, res) => {
  const userId = req.user!.userId;
  const payments = await paymentService.getMyPayment(req.query,userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My Payments retrieved successfully',
    data: payments,
  });
})



export const paymentController = {
    verifyPayment,
    getAllPayment,
    getSinglePaymentById,
    getMyPayment
}