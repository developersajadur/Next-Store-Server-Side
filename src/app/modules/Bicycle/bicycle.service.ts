/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { bicycleSearchableFields } from './bicycle.constant';
import { TBicycle } from './bicycle.interface';
import { BicycleModel } from './bicycle.model';
import slugify from 'slugify';

const createBicycleIntoDb = async (bicycle: TBicycle) => {
  let slug = slugify(bicycle.name, { lower: true, strict: true });
  let counter = 1;

  while (await BicycleModel.findOne({ slug })) {
    slug = slugify(bicycle.name, { lower: true, strict: true }) + `-${counter}`;
    counter++;
  }

  bicycle.slug = slug;

  // Create the bicycle in the database
  const result = await BicycleModel.create(bicycle);
  return result;
};

const getAllBiCycle = async (query: Record<string, unknown>) => {
  const biCycleQuery = new QueryBuilder(
    BicycleModel.find({ isDeleted: false }).populate('author'),
    query,
  )
    .search(bicycleSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await biCycleQuery.modelQuery;
  const meta = await biCycleQuery.countTotal();
  return { data: result, meta };
};

const getSingleBiCycleById = async (_id: string) => {
  const bicycle = await BicycleModel.findById({
    _id,
    isDeleted: false,
  }).populate('author');
  if (!bicycle) {
    throw new AppError(status.NOT_FOUND, 'Bicycle Not Found');
  }
  return bicycle;
};
const getSingleBiCycleBySlug = async (slug: string) => {
  const bicycle = await BicycleModel.findOne({
    slug,
    isDeleted: false,
  }).populate('author');
  if (!bicycle) {
    throw new AppError(status.NOT_FOUND, 'Bicycle Not Found');
  }
  return bicycle;
};

const updateSingleBiCycleById = async (
  _id: string,
  updatedBicycle: TBicycle,
) => {
  // console.log(updatedBicycle);
  // console.log(_id, updatedBicycle);
  try {
    const bicycle = await BicycleModel.findOne({ _id, isDeleted: false });
    if (!bicycle) {
      throw new AppError(status.NOT_FOUND, 'Bicycle Not Found');
    }
  } catch (error: any) {
    throw new AppError(status.BAD_REQUEST, error.message);
  }

  const result = await BicycleModel.findByIdAndUpdate(
    _id,
    { ...updatedBicycle, updatedAt: new Date() },
    { new: true },
  );

  return result;
};

const deleteSingleBiCycleById = async (_id: string) => {
  try {
    const bicycle = await BicycleModel.findOne({ _id, isDeleted: false });
    if (!bicycle) {
      throw new AppError(status.NOT_FOUND, 'Bicycle Not Found');
    }
  } catch (error: any) {
    throw new AppError(status.BAD_REQUEST, error.message);
  }
  const result = await BicycleModel.findByIdAndUpdate(
    _id,
    { isDeleted: true, updatedAt: new Date() },
    { new: true },
  );
  return result;
};

export const BicycleService = {
  createBicycleIntoDb,
  getAllBiCycle,
  getSingleBiCycleById,
  updateSingleBiCycleById,
  deleteSingleBiCycleById,
  getSingleBiCycleBySlug,
};
