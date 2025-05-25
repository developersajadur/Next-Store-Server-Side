import { Router } from 'express';
import { userRoute } from '../modules/User/user.route';
import { authRoute } from '../modules/Auth/auth.route';
import { reviewRoute } from '../modules/Review/review.route';
import { productRoute } from '../modules/Product/product.route';
import { paymentRouter } from '../modules/Payment/payment.route';
import { orderRouter } from '../modules/Order/order.route';
import { mediaRouter } from '../modules/Media/media.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/orders',
    route: orderRouter,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/payments',
    route: paymentRouter,
  },
  {
    path: '/medias',
    route: mediaRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
