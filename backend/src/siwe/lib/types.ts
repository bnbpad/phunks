import { JsonRpcProvider } from 'ethers';

import { SiweMessage } from './client';

export interface VerifyParams {
  signature: string;

  domain?: string;

  nonce?: string;

  time?: string;
}

export const VerifyParamsKeys: Array<keyof VerifyParams> = ['signature', 'domain', 'nonce', 'time'];

export interface VerifyOpts {
  provider?: JsonRpcProvider;

  suppressExceptions?: boolean;

  verificationFallback?: (
    params: VerifyParams,
    opts: VerifyOpts,
    message: SiweMessage,
    EIP1271Promise: Promise<SiweResponse>
  ) => Promise<SiweResponse>;
}

export const VerifyOptsKeys: Array<keyof VerifyOpts> = [
  'provider',
  'suppressExceptions',
  'verificationFallback',
];

export interface SiweResponse {
  success: boolean;

  error?: SiweError;

  data: SiweMessage;
}

export class SiweError {
  constructor(type: SiweErrorType | string, expected?: string, received?: string) {
    this.type = type;
    this.expected = expected;
    this.received = received;
  }

  type: SiweErrorType | string;

  expected?: string;

  received?: string;
}

export enum SiweErrorType {
  EXPIRED_MESSAGE = 'Expired message.',

  INVALID_DOMAIN = 'Invalid domain.',

  DOMAIN_MISMATCH = 'Domain does not match provided domain for verification.',

  NONCE_MISMATCH = 'Nonce does not match provided nonce for verification.',

  INVALID_ADDRESS = 'Invalid address.',

  INVALID_URI = 'URI does not conform to RFC 3986.',

  INVALID_NONCE = 'Nonce size smaller then 8 characters or is not alphanumeric.',

  NOT_YET_VALID_MESSAGE = 'Message is not valid yet.',

  INVALID_SIGNATURE = 'Signature does not match address of the message.',

  INVALID_TIME_FORMAT = 'Invalid time format.',

  INVALID_MESSAGE_VERSION = 'Invalid message version.',

  UNABLE_TO_PARSE = 'Unable to parse the message.',
}
