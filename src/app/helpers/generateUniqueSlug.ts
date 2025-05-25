/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from 'slugify';
import { Model } from 'mongoose';

export const generateUniqueSlug = async (
  title: string,
  model: Model<any>,
  field: string = 'slug'
): Promise<string> => {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await model.findOne({ [field]: slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
