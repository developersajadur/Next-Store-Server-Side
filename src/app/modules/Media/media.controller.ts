import catchAsync from '../../helpers/catchAsync';
import httpStatus, { status } from 'http-status';
import sendResponse from '../../helpers/sendResponse';
import { mediaService } from './media.service';
import AppError from '../../errors/AppError';

const uploadSingleMediaIntoDB = catchAsync(async (req, res) => {
  const result = await mediaService.uploadSingleMediaIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Media uploaded successfully',
    data: result,
  });
});

const uploadMultipleMediaIntoDB = catchAsync(async (req, res) => {
  const result = await mediaService.uploadMultipleMediaIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Multiple media uploaded successfully',
    data: result,
  });
});

const getAllMedia = catchAsync(async (req, res) => {
  const result = await mediaService.getAllMedia(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Medias retrieved successfully',
    data: result,
  });
});

const getSingleMediaById = catchAsync(async (req, res) => {
  
  const result = await mediaService.getSingleMediaById(req.params.mediaId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Media retrieved successfully',
    data: result,
  });
});

const deleteMultipleOrSingleMediaById = catchAsync(async (req, res) => {
  const { mediasId } = req.body;

  if (!Array.isArray(mediasId) || mediasId.length === 0) {
    throw new AppError(
      status.NOT_ACCEPTABLE,
      'mediasId must be a non-empty array.',
    );
  }

  await mediaService.deleteMultipleOrSingleMediaById(mediasId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Media item(s) deleted successfully.',
    data: null,
  });
});

export const mediaController = {
  uploadSingleMediaIntoDB,
  uploadMultipleMediaIntoDB,
  getAllMedia,
  getSingleMediaById,
  deleteMultipleOrSingleMediaById,
};
