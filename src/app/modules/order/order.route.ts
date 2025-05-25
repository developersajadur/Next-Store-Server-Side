import { Router } from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
const router = Router();

router.post('/', auth(USER_ROLE.customer), orderController.createOrder);

router.get('/get-all-orders', auth(USER_ROLE.admin), orderController.getOrders);

router.get(
  '/get-my-orders',
  auth(USER_ROLE.customer),
  orderController.getOrdersForMe,
);

router.get(
  '/get-order-by-id/:orderId',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  orderController.getSingleOrderById,
);

router.post(
  '/change-status/:orderId',
  auth(USER_ROLE.admin),
  orderController.updateOrderStatus,
);

export const orderRouter = router;
