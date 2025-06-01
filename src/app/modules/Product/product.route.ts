import express from 'express';
import { productController } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidationSchema } from './product.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidationSchema.createProductValidation),
  productController.createProduct,
);

router.get('/get-all', productController.getAllProducts);
router.get('/get-all-category-products/:categorySlug', productController.getAllProductsForCategories);
router.get('/get-all-for-product-card', productController.getAllProductsForProductCard);
router.get('/get-all-home-products', productController.getHomeProducts);

router.get('/get-by-id/:id', productController.getSingleProductById);

router.get('/get-by-slug/:slug', productController.getSingleProductBySlug);
router.get('/get-related-product-by-slug/:slug', productController.getRelatedProducts);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin),
  productController.updateSingleProductById,
);

router.delete(
  '/delete-products',
  auth(USER_ROLE.admin),
  productController.deleteMultipleOrSingleMediaById,
);

export const productRoute = router;
