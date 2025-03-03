import { Router } from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
const orderRouter = Router();

orderRouter.get(
  '/verify',
  auth(USER_ROLE.customer),
  orderController.verifyPayment,
);

orderRouter.post('/', auth(USER_ROLE.customer), orderController.createOrder);

orderRouter.get('/', auth(USER_ROLE.admin), orderController.getOrders);

orderRouter.get(
  '/get-my-orders',
  auth(USER_ROLE.customer),
  orderController.getOrdersForMe,
);

orderRouter.post(
  '/change-status/:orderId',
  auth(USER_ROLE.admin),
  orderController.updateOrderStatus,
);

export default orderRouter;
