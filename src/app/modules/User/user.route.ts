import { Router } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidationSchema } from './user.validation';
import { fileUploads } from '../../helpers/fileUploader';

const router = Router();

router.post(
  '/register',
  validateRequest(UserValidationSchema.createUserValidation),
  userController.createUserIntoDb,
);
router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  userController.changePassword,
);
router.get('/', auth(USER_ROLE.admin), userController.getAllUsers);
router.get(
  '/user/:id',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  userController.getSingleUser,
);
router.get(
  '/my-profile-data',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  userController.getMyProfileData,
);
router.patch(
  '/update-user',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  // validateRequest(UserValidationSchema.updateUserValidation),
  fileUploads.upload.single,
  userController.updateUser,
);

router.post('/block-user', auth(USER_ROLE.admin), userController.blockUser);
router.post('/unblock-user', auth(USER_ROLE.admin), userController.unBlockUser);

export const userRoute = router;
