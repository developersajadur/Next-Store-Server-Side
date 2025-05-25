import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ProductService } from './product.service';
import sendResponse from '../../utils/sendResponse';
import { tokenDecoder } from '../Auth/auth.utils';

const createProduct = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  const product = req.body;
  const dataToStore = { ...product, author: userId };
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

const deleteSingleProductById = catchAsync(async (req, res) => {
  await ProductService.deleteSingleProductById(req?.params?.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getSingleProductById,
  updateSingleProductById,
  deleteSingleProductById,
  getSingleProductBySlug,
};
