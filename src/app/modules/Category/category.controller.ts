import { Request } from 'express';
import catchAsync from '../../helpers/catchAsync';
import { TTokenUser } from '../Auth/auth.interface';
import { categoryService } from './category.service';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';

const createCategoryIntoDb = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const user = req.user!;
    const result = await categoryService.createCategoryIntoDb(req.body, user.userId);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: 'Category created successfully',
      data: result,
    });
  },
);

const getAllCategories = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategories(req.query);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Categories fetched successfully',
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.getCategoryById(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Category fetched successfully',
    data: result,
  });
});

const getCategoryBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await categoryService.getCategoryBySlug(slug);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Category fetched successfully',
    data: result,
  });
});

const updateCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.updateCategoryById(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteSingleOrMultipleCategories = catchAsync(async (req, res) => {
  const { categoriesId } = req.body;
  await categoryService.deleteSingleOrMultipleCategories(categoriesId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Category(s) deleted successfully',
    data: null
  });
});

export const categoryController = {
  createCategoryIntoDb,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategoryById,
  deleteSingleOrMultipleCategories,
};
