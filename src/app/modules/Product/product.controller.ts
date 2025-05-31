import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import { ProductService } from './product.service';
import sendResponse from '../../helpers/sendResponse';
import { tokenDecoder } from '../../helpers/jwtHelper';
import AppError from '../../errors/AppError';

const createProduct = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  const product = req.body;
  const dataToStore = { ...product, addedBy: userId };
  const result = await ProductService.createProductIntoDb(dataToStore);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product is created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const products = await ProductService.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: products,
  });
});
const getAllProductsForProductCard = catchAsync(async (req, res) => {
  const products = await ProductService.getAllProductsForProductCard(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Products Some Data retrieved successfully',
    data: products,
  });
});

const getHomeProducts = catchAsync(async (req, res) => {
  const products = await ProductService.getHomeProducts();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Home Products retrieved successfully',
    data: products,
  });
});

const getSingleProductById = catchAsync(async (req, res) => {
  const product = await ProductService.getSingleProductById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

const getSingleProductBySlug = catchAsync(async (req, res) => {
  const product = await ProductService.getSingleProductBySlug(req.params.slug);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

const updateSingleProductById = catchAsync(async (req, res) => {
  const updatedProduct = await ProductService.updateSingleProductById(
    req?.params?.id,
    req?.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct,
  });
});

const getRelatedProducts = catchAsync(async (req, res) => {
  const products = await ProductService.getRelatedProducts(
    req?.params?.slug
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Related Product retrieved successfully',
    data: products
  });
});

const deleteMultipleOrSingleMediaById = catchAsync(async (req, res) => {
  const { productsId } = req.body;

  if (!Array.isArray(productsId) || productsId.length === 0) {
    throw new AppError(
      status.NOT_ACCEPTABLE,
      'productsId must be a non-empty array.',
    );
  }

  await ProductService.deleteMultipleOrSingleMediaById(productsId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Products deleted successfully.',
    data: null,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getSingleProductById,
  updateSingleProductById,
  deleteMultipleOrSingleMediaById,
  getSingleProductBySlug,
  getAllProductsForProductCard,
  getHomeProducts,
  getRelatedProducts
};
