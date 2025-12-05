import { IUserModel } from '../../../database/user';
import { TokenLinks } from '../../../database/token';

export type IUpdateSocialsReq = {
  loggedInUser: IUserModel;
  message: string;
  signHash: string;
  chainType?: string;
  tokenAddress: string;
  chainId: number;
  links: TokenLinks;
};
