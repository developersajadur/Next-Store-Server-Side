import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import { USER_ROLE } from '../User/user.constant';
import { TUserRole } from '../User/user.interface';
import { paymentSearchableFields } from './payment.constant';
import { PaymentModel } from './payment.model';
import { paymentUtils } from './payment.utils';
import AppError from '../../errors/AppError';

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await paymentUtils.verifyPaymentAsync(order_id);
  // console.log(verifiedPayment);

  if (verifiedPayment.length) {
    const paymentStatus =
      verifiedPayment[0].bank_status === 'Success'
        ? 'paid'
        : verifiedPayment[0].bank_status === 'failed'
          ? 'pending'
          : verifiedPayment[0].bank_status === 'Cancel'
            ? 'failed'
            : 'failed';

    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { sp_order_id: order_id },
      {
        gatewayResponse: verifiedPayment[0],
        status: paymentStatus,
      },
      { new: true },
    );
    return updatedPayment;
  }
};

const getAllPayment = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(
    PaymentModel.find().populate({
      path: 'userId',
      select: 'name email profileImage',
    }),
    query,
  )
    .search(paymentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();
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
    const stringUserId = userId.toString();
    if (paymentUserId !== stringUserId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You Cat't Access Others Payment",
      );
    }
    return payment;
  }

  if (role === USER_ROLE.admin) {
    const payment = await PaymentModel.findById(paymentId).populate({
      path: 'userId',
      select: 'name email profileImage',
    });
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found');
    }
    return payment;
  }
  return null;
};

const getMyPayment = async (query: Record<string, unknown>, userId: string) => {
  const paymentQuery = new QueryBuilder(PaymentModel.find({ userId }), query)
    .search(paymentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();
  return { data: result, meta };
};

export const paymentService = {
  verifyPayment,
  getAllPayment,
  getSinglePaymentById,
  getMyPayment,
};
