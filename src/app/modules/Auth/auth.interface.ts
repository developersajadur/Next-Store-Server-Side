export type TLoginUser = {
  email: string;
  password: string;
};


export type TJwtPayload = {
  userId: string;
  email: string;
  role: string;
  loginType: string;
};
