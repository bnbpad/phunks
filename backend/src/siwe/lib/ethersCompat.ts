import {
  getAddress as ethersGetAddress,
  hashMessage as ethersHashMessage,
  verifyMessage as ethersVerifyMessage,
} from 'ethers';
import * as ethers from 'ethers';

type Ethers6BigNumberish = string | number | bigint;

type Ethers6SignatureLike =
  | string
  | {
      r: string;
      s: string;
      v: Ethers6BigNumberish;
      yParity?: 0 | 1;
      yParityAndS?: string;
    }
  | {
      r: string;
      yParityAndS: string;
      yParity?: 0 | 1;
      s?: string;
      v?: number;
    }
  | {
      r: string;
      s: string;
      yParity: 0 | 1;
      v?: Ethers6BigNumberish;
      yParityAndS?: string;
    };

export const verifyMessage =
  ethers?.verifyMessage ??
  (ethersVerifyMessage as (message: Uint8Array | string, sig: Ethers6SignatureLike) => string);

export const hashMessage =
  ethers?.hashMessage ?? (ethersHashMessage as (message: Uint8Array | string) => string);

export const getAddress = ethers?.getAddress ?? (ethersGetAddress as (address: string) => string);
