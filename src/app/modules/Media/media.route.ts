import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { mediaController } from './media.controller';
import { fileUploads } from '../../helpers/fileUploader';

const router = Router();

// Single image upload
router.post(
  '/upload-single-media',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  fileUploads.upload.single,
  mediaController.uploadSingleMediaIntoDB,
);

// Multiple images upload
router.post(
  '/upload-multiple-media',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  fileUploads.upload.multiple,
  mediaController.uploadMultipleMediaIntoDB,
);

router.get('/all-media', auth(USER_ROLE.admin), mediaController.getAllMedia);
router.get('/get-single-media/:mediaId', mediaController.getSingleMediaById);
router.delete(
  '/delete-media',
  auth(USER_ROLE.admin),
  mediaController.deleteMultipleOrSingleMediaById,
);

export const mediaRouter = router;
