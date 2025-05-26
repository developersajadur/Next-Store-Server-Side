

import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { paymentController } from './payment.controller';
const router = Router();

router.get(
  '/verify-payment',
  auth(USER_ROLE.customer),
  paymentController.verifyPayment,
);

router.get('/all-payments', auth(USER_ROLE.admin), paymentController.getAllPayment)

router.get(
  '/get-my-payments',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  paymentController.getMyPayment,
);
router.get(
  '/get-payment-by-id/:paymentId',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  paymentController.getSinglePaymentById,
);


export const paymentRouter = router;
