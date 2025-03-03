import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
import { tokenDecoder } from '../Auth/auth.utils';

const createUserIntoDb = catchAsync(async (req, res) => {
  const user = await userService.createUserIntoDb(req?.body);
  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'WOW! Registration successful',
    data: responseData,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers(req?.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await userService.getSingleUser(req?.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const { userId } = decoded;

  const updatedUser = await userService.updateUser(userId, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req); // Assuming tokenDecoder extracts the user ID from the token
  const { newPassword, currentPassword } = req.body;
  const { userId } = decoded;

  // Call the changePassword service
  const updatedUser = await userService.changePassword(
    userId,
    newPassword,
    currentPassword,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password updated successfully',
    data: updatedUser,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.body;
  // console.log(userId);
  const blockedUser = await userService.blockUser(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User blocked successfully',
    data: blockedUser,
  });
});

const unBlockUser = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const unBlockedUser = await userService.unblockUser(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User unblocked successfully',
    data: unBlockedUser,
  });
});

export const userController = {
  createUserIntoDb,
  getAllUsers,
  getSingleUser,
  updateUser,
  changePassword,
  blockUser,
  unBlockUser,
};
