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
export type TTokenUser = {
  userId: string;
  email: string;
  role: 'admin' | 'customer';
  loginType: string;
  iat: number;
  exp: number
};
