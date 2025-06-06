import { Request } from 'express';
import { MediaModel } from './media.model';
import { fileUploads } from '../../helpers/fileUploader';
import QueryBuilder from '../../builders/QueryBuilder';
import { mediaSearchableFields } from './media.constant';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { TTokenUser } from '../Auth/auth.interface';

const uploadSingleMediaIntoDB = async (req: Request & {user?: TTokenUser}) => {
  
  const media = req.file;
    const user = req.user;
  if (!media) return;

  const uploaded = await fileUploads.uploadToCloudinary(media);

  return await MediaModel.create({
    addedBy: user?.userId,
    fileName: media.originalname,
    url: uploaded.secure_url,
  });
};

const uploadMultipleMediaIntoDB = async (req: Request & {user?: TTokenUser}) => {
  const files = req.files as Express.Multer.File[];
    const user = req.user;

  const uploadedFiles = await Promise.all(
    files.map(file => fileUploads.uploadToCloudinary(file)),
  );

  const documents = uploadedFiles.map((file, i) => ({
    addedBy: user?.userId,
    fileName: files[i].originalname,
    url: file.secure_url,
  }));

  return await MediaModel.insertMany(documents);
};


const getAllMedia = async(query: Record<string, unknown>) => {
   const mediaQuery = new QueryBuilder(MediaModel.find(), query)
    .search(mediaSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await mediaQuery.modelQuery;
  const meta = await mediaQuery.countTotal();
  return { data: result, meta };
}

const getSingleMediaById = async (id: string) => {
  const media = await MediaModel.findById(id);
  if(!media || media.isDeleted){
    throw new AppError(status.NOT_FOUND, "Media Not Found")
  }
  return media
}


const deleteMultipleOrSingleMediaById = async (mediasId: string[]): Promise<void> => {
  const medias = await MediaModel.find({ _id: { $in: mediasId }, isDeleted: false }).lean();

  if (medias.length !== mediasId.length) {
    throw new AppError(status.NOT_FOUND, 'One or more media items not found or already deleted.');
  }

  await MediaModel.updateMany(
    { _id: { $in: mediasId } },
    { $set: { isDeleted: true } }
  ).lean();
};

export const mediaService = {
  uploadSingleMediaIntoDB,
  uploadMultipleMediaIntoDB,
  getAllMedia,
  getSingleMediaById,
  deleteMultipleOrSingleMediaById
};
