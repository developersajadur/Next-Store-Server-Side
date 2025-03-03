import express from 'express';
import { bicycleController } from './bicycle.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { BicycleValidationSchema } from './bicycle.validation';

const router = express.Router();

router.post(
  '/create-bicycle',
  auth(USER_ROLE.admin),
  validateRequest(BicycleValidationSchema.createBicycleValidation),
  bicycleController.createBicycle,
);

router.get('/', bicycleController.getAllBiCycles);

router.get('/:id', bicycleController.getSingleBiCycleById);

router.get('/get-a-product/:slug', bicycleController.getSingleBiCycleBySlug);

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  bicycleController.updateSingleBiCycleById,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  bicycleController.deleteSingleBiCycleById,
);

export const biCycleRoute = router;
