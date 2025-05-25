import status from 'http-status';
import AppError from '../../errors/AppError';
import { BrandModel } from './brand.model';
import { MediaModel } from '../Media/media.model';
import { TBrand } from './brand.interface';
import { generateUniqueSlug } from '../../helpers/generateUniqueSlug';
import QueryBuilder from '../../builders/QueryBuilder';
import { brandSearchableFields } from './brand.constant';

const createBrandIntoDb = async (payload: Partial<TBrand>, userId: string) => {
  // Check media existence
  const isExistMedia = await MediaModel.findById(payload.image);
  if (!isExistMedia || isExistMedia.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Media Not Found');
  }

  const slug = await generateUniqueSlug(payload.title!, BrandModel);

  const brand = await BrandModel.create({
    ...payload,
    createdBy: userId,
    slug,
  });

  return brand;
};

const updateBrandIntoDb = async (brandId: string, payload: Partial<TBrand>) => {
  const brand = await BrandModel.findById(brandId);
  if (!brand || brand.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Brand Not Found');
  }

  if (payload.title) {
    payload.slug = await generateUniqueSlug(payload.title, BrandModel);
  }

  if (payload.image) {
    const isExistMedia = await MediaModel.findById(payload.image);
    if (!isExistMedia || isExistMedia.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Media Not Found');
    }
  }

  const updated = await BrandModel.findOneAndUpdate(
    { _id: brandId, isDeleted: false },
    { ...payload },
    { new: true },
  );

  return updated;
};

const getAllBrands = async (query: Record<string, unknown>) => {
    const brandQuery = new QueryBuilder(
    BrandModel.find({ isDeleted: false }),
    query,
  )
    .search(brandSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await brandQuery.modelQuery;
  const meta = await brandQuery.countTotal();
  return { data: result, meta };
};

const getSingleBrandById = async (brandId: string): Promise<TBrand | null> => {
  const brand = await BrandModel.findById(brandId).lean();
  if (!brand || brand.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Brand Not Found');
  }
  return brand;
};

const getSingleBrandBySlug = async (slug: string): Promise<TBrand | null> => {
  const brand = await BrandModel.findOne({
    slug,
    isDeleted: false,
  }).lean();
  if (!brand) {
    throw new AppError(status.NOT_FOUND, 'Brand Not Found');
  }
  return brand;
};

const deleteSingleOrMultipleBrands = async (brandsId: string[]) => {
  const brands = await BrandModel.find({
    _id: { $in: brandsId },
    isDeleted: false,
  });

  if (brands.length !== brandsId.length) {
    throw new AppError(
      status.NOT_FOUND,
      'One or more brands not found or already deleted',
    );
  }

  await BrandModel.updateMany(
    { _id: { $in: brandsId } },
    { $set: { isDeleted: true } },
    { new: true },
  );
};

export const brandService = {
  createBrandIntoDb,
  updateBrandIntoDb,
  getAllBrands,
  getSingleBrandById,
  getSingleBrandBySlug,
  deleteSingleOrMultipleBrands,
};
