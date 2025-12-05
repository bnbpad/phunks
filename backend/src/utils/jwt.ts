import jwt from 'jsonwebtoken';
import nconf from '../config/nconf';
import { IUserModel } from '../database/user';

export const generateJWT = (user: IUserModel): string => {
  const secretKey = nconf.get('SECRET_KEY');
  return jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1d' });
};
