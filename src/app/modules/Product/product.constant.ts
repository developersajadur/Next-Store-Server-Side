export const productSearchableFields = ['title'];


 export const LIMIT_PER_SECTION = 8;
export const baseSelectFields = [
  'title',
  'slug',
  'image',
  'price',
  'regular_price',
  'sale_price',
  'stock_quantity',
  'category',
  'brand',
];

export const populateImage = {
  path: 'image',
  select: 'url fileName',
};