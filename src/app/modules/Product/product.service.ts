/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import status from 'http-status';
import {
  baseSelectFields,
  LIMIT_PER_SECTION,
  populateImage,
  productSearchableFields,
} from './product.constant';
import { TProduct } from './product.interface';
import { ProductModel } from './product.model';
import { generateUniqueSlug } from '../../helpers/generateUniqueSlug';
import { MediaModel } from '../Media/media.model';
import { BrandModel } from '../Brand/brand.model';
import { CategoryModel } from '../Category/category.model';
import { Review } from '../Review/review.model';
import { getHomeProductsUtils } from './product.utils';

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

const getAllProductsForCategories = async (
  query: Record<string, unknown>,
  categorySlug: string,
) => {
  const category = await CategoryModel.findOne({ slug: categorySlug });
  if (!category) {
    throw new AppError(status.NOT_FOUND, 'Category Not Found');
  }

  // Build product query
  const productQuery = new QueryBuilder(
    ProductModel.find({
      isDeleted: false,
      category: { $in: category._id },
    })
      .select(baseSelectFields)
      .populate(populateImage),
    query,
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = (await productQuery.modelQuery) as TProduct[];
  const meta = await productQuery.countTotal();

  return { data: result, meta };
};

const getAllProductsForProductCard = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    ProductModel.find({ isDeleted: false })
      .select(baseSelectFields)
      .populate(populateImage),
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
  });
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
    .populate(populateImage)
    .populate({
      path: 'gallery_images',
      select: 'url fileName',
    })
    .populate({
      path: 'category',
      select: 'title slug image',
      populate: populateImage,
    })
    .populate({
      path: 'brand',
      select: 'title slug image',
      populate: populateImage,
    })
    .lean();
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

    // Validate Brand
    const brand = await BrandModel.findOne({
      _id: product.brand,
      isDeleted: false,
    });
    if (!brand) {
      throw new AppError(
        status.NOT_FOUND,
        'Brand not found or has been deleted',
      );
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

const getHomeProducts = async () => {
  const result = await getHomeProductsUtils();
  return result;
};

const getRelatedProducts = async (slug: string) => {
  const product = await ProductModel.findOne({ slug });
  if (!product || product.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Product Not Found');
  }
  if (!product.category || product.category.length === 0) {
    return [];
  }

  const relatedProducts = await ProductModel.find({
    category: { $in: product.category },
    slug: { $ne: slug },
    isDeleted: false,
  })
    .select(baseSelectFields)
    .populate(populateImage)
    .limit(LIMIT_PER_SECTION)
    .exec();

  return relatedProducts;
};

export const ProductService = {
  createProductIntoDb,
  getAllProducts,
  getSingleProductById,
  getSingleProductBySlug,
  updateSingleProductById,
  deleteMultipleOrSingleMediaById,
  getAllProductsForProductCard,
  getHomeProducts,
  getRelatedProducts,
  getAllProductsForCategories,
};
