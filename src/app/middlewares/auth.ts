/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../helpers/catchAsync';
import { UserModel } from '../modules/User/user.model';
import { TUserRole } from '../modules/User/user.interface';
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/jwtHelper';
import config from '../config';
import { TTokenUser } from '../modules/Auth/auth.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (    req: Request & { user?:TTokenUser }, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
    }
    
    const verifiedUser = verifyToken(
      token as string,
      config.jwt_token_secret as string,
    ) as TTokenUser;
    const user: any = UserModel.findById(verifiedUser.userId);
    if (!user) {
      throw new AppError(status.UNAUTHORIZED, 'User not found!');
    }
    if (user.isBlocked) {
      throw new AppError(status.FORBIDDEN, 'User is blocked!');
    }
    if (user.isDeleted) {
      throw new AppError(status.FORBIDDEN, 'User is Deleted!');
    }

    if (verifiedUser.exp && Date.now() >= verifiedUser.exp * 1000) {
      throw new AppError(status.UNAUTHORIZED, 'Token expired.');
    }

    if (requiredRoles && !requiredRoles.includes(verifiedUser.role)) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
    }

    req.user = verifiedUser
    next();
  });
};

export default auth;
