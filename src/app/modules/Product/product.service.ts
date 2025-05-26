/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { productSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { ProductModel } from './product.model';
import { generateUniqueSlug } from '../../helpers/generateUniqueSlug';
import { MediaModel } from '../Media/media.model';
import { BrandModel } from '../Brand/brand.model';
import { CategoryModel } from '../Category/category.model';

const createProductIntoDb = async (product: Partial<TProduct>) => {
  // Validate Brand
  const brand = await BrandModel.findOne({
    _id: product.brand,
    isDeleted: false,
  });
  if (!brand) {
    throw new AppError(status.NOT_FOUND, 'Brand not found or has been deleted');
  }

  // Validate Main Image
  const mainImage = await MediaModel.findOne({
    _id: product.image,
    isDeleted: false,
  });
  if (!mainImage) {
    throw new AppError(
      status.NOT_FOUND,
      'Main product image not found or has been deleted',
    );
  }

  // Validate Gallery Images (if any)
  if (product.gallery_images && product.gallery_images.length > 0) {
    const galleryImages = await MediaModel.find({
      _id: { $in: product.gallery_images },
      isDeleted: false,
    });

    if (galleryImages.length !== product.gallery_images.length) {
      throw new AppError(
        status.NOT_FOUND,
        'Some gallery images were not found or have been deleted',
      );
    }
  }

  // Validate variants Images (if any)
  if (product.variants && product.variants.length > 0) {
    const variantImageIds = product.variants
      .filter((variant) => variant.image)
      .map((variant) => variant.image);

    const variantsImages = await MediaModel.find({
      _id: { $in: variantImageIds },
      isDeleted: false,
    });

    if (variantsImages.length !== variantImageIds.length) {
      throw new AppError(
        status.NOT_FOUND,
        'Some variant images were not found or have been deleted.',
      );
    }
  }

  // Validate Categories
  const categories = await CategoryModel.find({
    _id: { $in: product.category },
    isDeleted: false,
  });

  if (categories.length !== product.category!.length) {
    throw new AppError(
      status.NOT_FOUND,
      'Some categories were not found or have been deleted',
    );
  }

  product.slug = await generateUniqueSlug(product.title!, ProductModel);

  const result = await ProductModel.create(product);
  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    ProductModel.find({ isDeleted: false }),
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
  })
  if (!product || product.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Product Not Found');
  }
  return product;
};

const getSingleProductBySlug = async (slug: string) => {
  const product = await ProductModel.findOne({
    slug,
    isDeleted: false,
  })
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
      updatedProduct.slug = await generateUniqueSlug(
        product.title,
        ProductModel,
      );
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
