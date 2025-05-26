import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { tokenDecoder } from '../../helpers/jwtHelper';
import { ReviewService } from './review.service';

const createReviewIntoDb = catchAsync(async (req, res) => {
  const payload = req?.body;
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  payload.userId = userId;

  const review = await ReviewService.createReviewIntoDb(payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Review created successfully',
    data: review,
  });
});

const getAllReviewsFromDb = catchAsync(async (req, res) => {
  const reviews = await ReviewService.getAllReviewsFromDb(req?.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: reviews,
  });
});

const updateReviewIntoDb = catchAsync(async (req, res) => {
  const { reviewId, productId } = req.params;
  const payload = req.body;
  const decoded = tokenDecoder(req);
  const { userId } = decoded;

  const review = await ReviewService.updateReviewIntoDb(
    payload,
    reviewId,
    userId,
    productId,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

const getReviewBySlugForEachProduct = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const reviews = await ReviewService.getReviewBySlugForEachProduct(
    slug,
    req.query,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: reviews,
  });
});

const deleteReviewFromDb = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const decoded = tokenDecoder(req);
  const { userId } = decoded;

  const review = await ReviewService.deleteReviewFromDb(reviewId, userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Review deleted successfully',
    data: review,
  });
});

const getSingleReviewById = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const review = await ReviewService.getSingleReviewById(reviewId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Review retrieved successfully',
    data: review,
  });
});

export const reviewController = {
  createReviewIntoDb,
  getAllReviewsFromDb,
  updateReviewIntoDb,
  getReviewBySlugForEachProduct,
  deleteReviewFromDb,
  getSingleReviewById,
};
