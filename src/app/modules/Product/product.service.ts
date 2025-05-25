/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { productSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { ProductModel } from './product.model';
import slugify from 'slugify';

const createProductIntoDb = async (product: TProduct) => {
  let slug = slugify(product.title, { lower: true, strict: true });
  let counter = 1;

  while (await ProductModel.findOne({ slug })) {
    slug =
      slugify(product.title, { lower: true, strict: true }) + `-${counter}`;
    counter++;
  }

  product.slug = slug;

  const result = await ProductModel.create(product);
  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    ProductModel.find({ isDeleted: false }).populate('author'),
    query,
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return { data: result, meta };
};

const getSingleProductById = async (_id: string) => {
  const product = await ProductModel.findById({
    _id,
    isDeleted: false,
  }).populate('author');
  if (!product || product.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Product Not Found');
  }
  return product;
};

const getSingleProductBySlug = async (slug: string) => {
  const product = await ProductModel.findOne({
    slug,
    isDeleted: false,
  }).populate('author');
  if (!product) {
    throw new AppError(status.NOT_FOUND, 'Product Not Found');
  }
  return product;
};

const updateSingleProductById = async (
  _id: string,
  updatedProduct: TProduct,
) => {
  try {
    const product = await ProductModel.findOne({ _id, isDeleted: false });
    if (!product || product.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Product Not Found');
    }
    if (updatedProduct.title) {
      let slug = slugify(product.title, { lower: true, strict: true });
      let counter = 1;

      while (await ProductModel.findOne({ slug })) {
        slug =
          slugify(product.title, { lower: true, strict: true }) + `-${counter}`;
        counter++;
      }

      updatedProduct.slug = slug;
    }
  } catch (error: any) {
    throw new AppError(status.BAD_REQUEST, error.message);
  }

  const result = await ProductModel.findByIdAndUpdate(
    _id,
    { ...updatedProduct, updatedAt: new Date() },
    { new: true },
  );

  return result;
};

const deleteMultipleOrSingleMediaById = async (
  productsId: string[],
): Promise<void> => {
  const products = await ProductModel.find({
    _id: { $in: productsId },
    isDeleted: false,
  }).lean();

  if (products.length !== productsId.length) {
    throw new AppError(
      status.NOT_FOUND,
      'One or more media items not found or already deleted.',
    );
  }

  await ProductModel.updateMany(
    { _id: { $in: productsId } },
    { $set: { isDeleted: true } },
  );
};
export const ProductService = {
  createProductIntoDb,
  getAllProducts,
  getSingleProductById,
  getSingleProductBySlug,
  updateSingleProductById,
  deleteMultipleOrSingleMediaById,
};
