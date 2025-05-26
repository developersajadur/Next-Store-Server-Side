import status from 'http-status';
import AppError from '../../errors/AppError';
import { MediaModel } from '../Media/media.model';
import { TCategory } from './category.interface';
import { CategoryModel } from './category.model';
import { generateUniqueSlug } from '../../helpers/generateUniqueSlug';
import QueryBuilder from '../../builders/QueryBuilder';
import { categorySearchableFields } from './category.constant';
import { populateImage } from '../Product/product.constant';

const createCategoryIntoDb = async (
  payload: Partial<TCategory>,
  userId: string,
) => {
  if (payload.image) {
    const isExistMedia = await MediaModel.findById(payload.image);
    if (!isExistMedia || isExistMedia.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Media Not Found');
    }
  }

  const slug = await generateUniqueSlug(payload.title!, CategoryModel);

  const category = await CategoryModel.create({
    ...payload,
    createdBy: userId,
    slug,
  });
  return category;
};

const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    CategoryModel.find({ isDeleted: false }),
    query,
  )
    .search(categorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();
  return { data: result, meta };
};

const getAllCategoryWithSomeData = async () => {
  const categories = CategoryModel.find({ isDeleted: false })
    .populate(populateImage)
    .select({
      title: 1,
      slug: 1,
      image: 1,
      description: 1,
    });
    return categories;
};


const getCategoryById = async (id: string) => {
  const category = await CategoryModel.findById(id).lean();
  if (!category || category.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Category Not Found');
  }
  return category;
};

const getCategoryBySlug = async (slug: string) => {
  const category = await CategoryModel.findOne({
    slug,
    isDeleted: false,
  }).lean();
  if (!category) {
    throw new AppError(status.NOT_FOUND, 'Category Not Found');
  }
  return category;
};

const updateCategoryById = async (id: string, payload: Partial<TCategory>) => {
  if (payload.image) {
    const isExistMedia = await MediaModel.findById(payload.image);
    if (!isExistMedia || isExistMedia.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Media Not Found');
    }
  }

  if (payload.title) {
    payload.slug = await generateUniqueSlug(payload.title, CategoryModel);
  }
  const isExistCategory = await CategoryModel.findById(id).lean();
  if (!isExistCategory) {
    throw new AppError(status.NOT_FOUND, 'Category Not Found or Deleted');
  }
  const updated = await CategoryModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { ...payload },
    { new: true },
  );

  return updated;
};

const deleteSingleOrMultipleCategories = async (categoryIds: string[]) => {
  const categories = await CategoryModel.find({
    _id: { $in: categoryIds },
    isDeleted: false,
  });
  if (categories.length !== categoryIds.length) {
    throw new AppError(
      status.NOT_FOUND,
      'One or more categories not found or already deleted.',
    );
  }

  await CategoryModel.updateMany(
    { _id: { $in: categoryIds } },
    { $set: { isDeleted: true } },
    { new: true },
  );
};

export const categoryService = {
  createCategoryIntoDb,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategoryById,
  deleteSingleOrMultipleCategories,
  getAllCategoryWithSomeData
};
