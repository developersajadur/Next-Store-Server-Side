import { Router } from 'express';
import { biCycleRoute } from '../modules/Bicycle/bicycle.route';
import { userRoute } from '../modules/User/user.route';
import { authRoute } from '../modules/Auth/auth.route';
import orderRouter from '../modules/order/order.router';

const router = Router();

const moduleRoutes = [
  {
    path: '/bicycles',
    route: biCycleRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/',
    route: authRoute,
  },
  {
    path: '/order',
    route: orderRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
