import  httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import { USER_ROLE } from '../User/user.constant';
import { TUserRole } from '../User/user.interface';
import { paymentSearchableFields } from './payment.constant';
import { PaymentModel } from './payment.model';
import { paymentUtils } from './payment.utils';
import AppError from '../../errors/AppError';


const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await paymentUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    const paymentStatus =
      verifiedPayment[0].bank_status === 'Success'
        ? 'paid'
        : verifiedPayment[0].bank_status === 'failed'
        ? 'pending'
        : verifiedPayment[0].bank_status === 'Cancel'
        ? 'failed'
        : 'failed';

    await PaymentModel.findOneAndUpdate(
      { 'gatewayResponse.id': order_id },
      {
        'gatewayResponse.bank_status': verifiedPayment[0].bank_status,
        'gatewayResponse.sp_code': verifiedPayment[0].sp_code,
        'gatewayResponse.sp_message': verifiedPayment[0].sp_message,
        'gatewayResponse.transactionStatus': verifiedPayment[0].transaction_status,
        'gatewayResponse.method': verifiedPayment[0].method,
        'gatewayResponse.date_time': verifiedPayment[0].date_time,
        status: paymentStatus,
      },
      { new: true },
    );
  }

  return verifiedPayment;
};



const getAllPayment = async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(
      PaymentModel.find().populate('userId'),
      query,
    )
      .search(paymentSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { data: result, meta };
};


const getSinglePaymentById = async (
  paymentId: string,
  role: TUserRole,
  userId: string,
) => {
  if (role === USER_ROLE.customer) {
    const payment = await PaymentModel.findById(paymentId);
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found');
    }
    const paymentUserId = payment.userId.toString();
    if (paymentUserId !== userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You Cat't Access Others Payment",
      );
    }
    return payment;
  }

  if (role === USER_ROLE.admin) {
    const payment = await PaymentModel.findById(paymentId);
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found');
    }
    return payment;
  }
  return null;
};

export const paymentService = {
  verifyPayment,
  getAllPayment,
  getSinglePaymentById
};
