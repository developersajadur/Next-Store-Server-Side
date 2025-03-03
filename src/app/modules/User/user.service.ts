import status from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt';
import config from '../../config';

const createUserIntoDb = async (user: TUser) => {
  const isUserExist = await UserModel.findOne({ email: user.email });

  if (isUserExist) {
    if (isUserExist.phone === user.phone) {
      throw new AppError(
        status.BAD_REQUEST,
        'User with this phone number already exists',
      );
    }
    throw new AppError(
      status.BAD_REQUEST,
      'User with this email already exists',
    );
  }

  const result = await UserModel.create(user);
  return result;
};

const getSingleUser = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  return user;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(UserModel.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return { result, meta };
};

const updateUser = async (userId: string, userInfo: Partial<TUser>) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  if (user.isBlocked) {
    throw new AppError(status.FORBIDDEN, 'User is blocked');
  }

  const updatedFields: Partial<TUser> = { ...userInfo, updatedAt: new Date() };

  const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedFields, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const changePassword = async (
  userId: string,
  newPassword: string,
  currentPassword: string,
) => {
  const user = await UserModel.findById(userId).select('+password');
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid current password!');
  }
  if (currentPassword === newPassword) {
    throw new AppError(
      status.BAD_REQUEST,
      'New password cannot be the same as the current password!',
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.salt_rounds),
  );
  user.password = hashedPassword;
  // await user.save();
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { password: hashedPassword, updatedAt: new Date() },
    { new: true, runValidators: true },
  );
  return updatedUser;
};

const blockUser = async (userId: string) => {
  const blockedUser = await UserModel.findByIdAndUpdate(userId, {
    isBlocked: true,
  });
  if (!blockedUser) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  if (blockedUser.isBlocked) {
    throw new AppError(status.CONFLICT, 'User is already blocked');
  }
  return blockedUser;
};

const unblockUser = async (userId: string) => {
  const unblockedUser = await UserModel.findByIdAndUpdate(userId, {
    isBlocked: false,
  });
  if (!unblockedUser) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  if (!unblockedUser.isBlocked) {
    throw new AppError(status.CONFLICT, 'User is already unblocked');
  }
  return unblockedUser;
};

export const userService = {
  createUserIntoDb,
  getAllUsers,
  getSingleUser,
  updateUser,
  changePassword,
  blockUser,
  unblockUser,
};
