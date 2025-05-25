import express from 'express';
import { productController } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidationSchema } from './product.validation';

const router = express.Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidationSchema.createProductValidation),
  productController.createProduct,
);

router.get('/', productController.getAllProducts);

router.get('get-product-by-id/:id', productController.getSingleProductById);

router.get('/get-product-by-slug/:slug', productController.getSingleProductBySlug);

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  productController.updateSingleProductById,
);

router.delete(
  '/delete-products',
  auth(USER_ROLE.admin),
  productController.deleteMultipleOrSingleMediaById,
);

export const productRoute = router;
