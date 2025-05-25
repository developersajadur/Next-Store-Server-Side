import { Request } from 'express';
import catchAsync from '../../helpers/catchAsync';
import { TTokenUser } from '../Auth/auth.interface';
import { brandService } from './brand.service';
import sendResponse from '../../helpers/sendResponse';
import status from 'http-status';

const createBrand = catchAsync(
  async (req: Request & { user?: TTokenUser }, res) => {
    const user = req.user!;
    const result = await brandService.createBrandIntoDb(req.body, user.userId);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: 'Brand created successfully',
      data: result,
    });
  }
);

const updateBrand = catchAsync(
  async (req, res) => {
    const brandId = req.params.id;
    const result = await brandService.updateBrandIntoDb(brandId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: 'Brand updated successfully',
      data: result,
    });
  }
);

const getAllBrands = catchAsync(async (req, res) => {
  const result = await brandService.getAllBrands(req.query);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Brands fetched successfully',
    data: result,
  });
});

const getSingleBrandById = catchAsync(async (req, res) => {
  const brandId = req.params.id;
  const result = await brandService.getSingleBrandById(brandId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Brand fetched successfully',
    data: result,
  });
});

const getSingleBrandBySlug = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const result = await brandService.getSingleBrandBySlug(slug);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Brand fetched successfully',
    data: result,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  const brandsId: string[] = req.body.brandsId;

  await brandService.deleteSingleOrMultipleBrands(brandsId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Brand(s) deleted successfully',
    data: null
  });
});

export const brandController = {
  createBrand,
  updateBrand,
  getAllBrands,
  getSingleBrandById,
  getSingleBrandBySlug,
  deleteBrand,
};
