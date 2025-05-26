import status from 'http-status';
import AppError from '../../errors/AppError';
import { TReview } from './review.interface';
import { Review } from './review.model';
import { ProductModel } from '../Product/product.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { reviewSearchableFields } from './review.constant';
import { UserModel } from '../User/user.model';
import { USER_ROLE } from '../User/user.constant';

const createReviewIntoDb = async (payload: TReview) => {
  const isExistProduct = await ProductModel.findById(payload.productId).lean();
  if (!isExistProduct || isExistProduct.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Product not found');
  }

  const isExistReview = await Review.findOne({
    productId: payload.productId,
    userId: payload.userId,
  }).lean();
  if (isExistReview) {
    throw new AppError(
      status.CONFLICT,
      'You have already reviewed this product',
    );
  }

  const result = await Review.create(payload);
  return result;
};

const getAllReviewsFromDb = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    Review.find({ isDeleted: false }).populate({
      path: 'userId',
      select: 'name email profileImage',
    }),
    query,
  )
    .search(reviewSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const reviews = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();
  return { reviews, meta };
};

const updateReviewIntoDb = async (
  payload: Partial<TReview>,
  reviewId: string,
  userId: string,
  productId: string,
) => {
  const isExistReview = await Review.findById(reviewId).lean();
  if (!isExistReview || isExistReview.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Review not found');
  }

  if (isExistReview.userId.toString() !== userId) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not authorized to update this review',
    );
  }

  const isExistProduct = await ProductModel.findById(productId).lean();
  if (!isExistProduct || isExistProduct.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Product not found');
  }
  const result = await Review.findByIdAndUpdate(
    reviewId,
    { $set: payload },
    { new: true },
  ).lean();
  return result;
};

const getReviewBySlugForEachProduct = async (
  slug: string,
  query: Record<string, unknown>,
) => {
  const product = await ProductModel.findOne({ slug, isDeleted: false }).lean();

  if (!product) {
    throw new Error(`Product with slug "${slug}" not found.`);
  }

  const reviewQuery = new QueryBuilder(
    Review.find({ isDeleted: false, productId: product._id })
      .populate({
        path: 'userId',
        select: 'name email profileImage',
      })
      .lean(),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const reviews = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return { reviews, meta };
};

const deleteReviewFromDb = async (reviewId: string, userId: string) => {
  const isExistReview = await Review.findById(reviewId).lean();
  if (!isExistReview || isExistReview.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Review not found');
  }
  const user = await UserModel.findById(userId).lean();
  if (!user || user.isBlocked) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  if (user.role === USER_ROLE.customer) {
    if (isExistReview.userId.toString() !== userId.toString()) {
      throw new AppError(
        status.FORBIDDEN,
        'You are not authorized to delete this review',
      );
    }
  }
  const result = await Review.findByIdAndUpdate(
    reviewId,
    { $set: { isDeleted: true } },
    { new: true },
  ).lean();
  return result;
};

const getSingleReviewById = async (reviewId: string) => {
  const review = await Review.findById(reviewId).populate({
    path: 'userId',
    select: 'name email profileImage',
  });
  if (!review || review?.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Review Not Found');
  }

  return review;
};

export const ReviewService = {
  createReviewIntoDb,
  getAllReviewsFromDb,
  updateReviewIntoDb,
  getReviewBySlugForEachProduct,
  deleteReviewFromDb,
  getSingleReviewById,
};
