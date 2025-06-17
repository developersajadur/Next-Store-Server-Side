import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidationSchema } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidationSchema.loginUserValidation),
  AuthControllers.loginUser,
);
router.post(
  '/admin-login',
  validateRequest(AuthValidationSchema.loginUserValidation),
  AuthControllers.loginAdmin,
);

export const authRoute = router;
