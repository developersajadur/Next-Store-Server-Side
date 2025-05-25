/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import config from '../config';
import { ICloudinaryResponse } from '../interface/cloudinaryResponse.interface';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.cloud_api_key,
  api_secret: config.cloudinary.cloud_api_secret,
});


const storage = multer.memoryStorage();

const multerConfig = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB per file
});


const upload = {
  single: multerConfig.single('file'),
  multiple: multerConfig.array('files', 5),
};

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<ICloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result as any);
    });

    bufferToStream(file.buffer).pipe(uploadStream);
  });
};


const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[]
): Promise<ICloudinaryResponse[]> => {
  return Promise.all(files.map(file => uploadToCloudinary(file)));
};

export const fileUploads = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
};
