// FourMeme Token Creation Typee

export interface ICreateToken {
  selectedDexId: "fourmeme";
  basicDetails: {
    name: string;
    symbol: string;
    desc: string;
    image: string;
    address: string;
    chainId: 56; // BSC only
    chainType: string;
  };
  tokenomics: {
    fundingTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Native BNB
    fundingTokenDecimals: 18;
    fundingTokenSymbol: "BNB";
    amountToBuy: string; // Pre-buy amount in BNB
    totalSupply: 1000000000; // 1 billion (fixed)
    raisedAmount: 24; // 24 BNB (fixed)
    saleRate: 0.8; // 80% (fixed)
    reserveRate: 0; // 0% (fixed)
  };
  links: {
    telegramLink?: string;
    twitterLink?: string;
    discordLink?: string;
    websiteLink?: string;
    twitchLink?: string;
  };
  aiThesis?: AIThesisConfig;
  apiKey?: string; // OpenAI API Key
  apiSecret?: string; // OpenAI API Secret
  txHash?: string;
}

export interface AIThesisConfig {
  goals: string; // Primary objectives and mission of the AI agent
  memory: string; // Past experiences, learned patterns, and historical context
  persona: string; // Personality, behavior patterns, and communication style
  experience: string; // Background knowledge, skills, and areas of expertise
}

export interface CreateTokenState {
  currentStep: number;
  totalSteps: number;
  data: ICreateToken;
  isLoading: boolean;
  error: string | null;
  imageFile?: File;
  uploadedImageUrl?: string;
}

export interface CreateTokenActions {
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (updates: Partial<ICreateToken>) => void;
  setImageFile: (file: File | undefined) => void;
  setUploadedImageUrl: (url: string) => void;
  reset: () => void;
  createToken: () => Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
    successData?: SuccessData;
  }>;
}

// FourMeme API Types

export interface GenerateNonceRequest {
  accountAddress: string;
  verifyType: "LOGIN";
  networkCode: "BSC";
}

export interface GenerateNonceResponse {
  code: string | number;
  data: string;
  msg?: string;
}

export interface LoginRequest {
  region: "WEB";
  langType: "EN";
  loginIp: "";
  inviteCode: "";
  verifyInfo: {
    address: string;
    networkCode: "BSC";
    signature: string;
    verifyType: "LOGIN";
  };
  walletName: string;
}

export interface LoginResponse {
  code: string;
  data: string; // access_token
}

// 3. Upload Token Image
export interface UploadImageResponse {
  data: {
    message: string;
    code: string;
    data: string; // uploaded image URL
  };
}


export interface CreateTokenRequest {
  name: string;
  shortName: string; // Symbol
  desc: string;
  imgUrl: string;
  launchTime: number; // Date.now()
  label: string; // Must be one of: Meme/AI/Defi/Games/Infra/De-Sci/Social/Depin/Charity/Others
  lpTradingFee: number; // Fixed as 0.0025
  webUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  preSale: string; // Pre-purchased BNB amount; "0" if not purchased
  onlyMPC?: boolean; // X Mode Token
  // Fixed Parameters (required by API even though values are fixed)
  totalSupply: number; // Fixed at 1000000000
  raisedAmount: number; // Fixed at 24
  saleRate: number; // Fixed at 0.8
  reserveRate: number; // Fixed at 0
  funGroup: boolean; // Fixed at false
  clickFun: boolean; // Fixed at false
  symbol: string; // Fixed at "BNB"
}

export interface CreateTokenResponse {
  data: {
    code: string;
    message: string;
    data: {
      tokenId: number;
      totalAmount: string;
      saleAmount: string;
      template: number;
      launchTime: number; // Unix timestamp in seconds
      serverTime: number;
      createArg: string; // Hex string starting with 0x
      signature: string; // Hex string starting with 0x (65 bytes = 130 hex chars + 0x = 132 chars)
      bamount: string;
      tamount: string;
    };
  };
}


export interface SaveTokenRequest extends CreateTokenRequest {
  txHash: string;
  chainID: 56; // BSC
  apiKey?: string; // OpenAI API Key
  apiSecret?: string; // OpenAI API Secret
  aiThesis?: AIThesisConfig;
}

export interface SaveTokenResponse {
  success: boolean;
  data: {
    tokenAddress: string;
  };
  error?: string;
}

export type SuccessData = {
  trxHash?: string;
  tokenAddress?: string;
  message?: string;
  chainId?: number;
  imgUrl?: string;
  symbol?: string;
};

export type FourMemeLabel =
  | "Meme"
  | "AI"
  | "Defi"
  | "Games"
  | "Infra"
  | "De-Sci"
  | "Social"
  | "Depin"
  | "Charity"
  | "Others";

// Step Types
export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface StepProps {
  data: ICreateToken;
  onDataChange: (updates: Partial<ICreateToken>) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onImageChange?: (file: File | undefined) => void;
  isLoading?: boolean;
  walletConnected: boolean;
  walletBalance?: string;
}