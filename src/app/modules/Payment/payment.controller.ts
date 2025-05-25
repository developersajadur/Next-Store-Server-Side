import  httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { tokenDecoder } from '../Auth/auth.utils';


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


const getSinglePaymentById = catchAsync(async (req, res) => {
   const decoded = tokenDecoder(req);
  const { role, userId } = decoded;
  const {paymentId} = req.params;
  const payment = await paymentService.getSinglePaymentById(paymentId, role, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment retrieved successfully',
    data: payment,
  });
});



export const paymentController = {
    verifyPayment,
    getAllPayment,
    getSinglePaymentById
}