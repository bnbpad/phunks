// FourMeme API Integration

import {
  GenerateNonceRequest,
  GenerateNonceResponse,
  LoginRequest,
  LoginResponse,
  UploadImageResponse,
  CreateTokenRequest,
  CreateTokenResponse, AIThesisConfig
} from '../types/fourMeme';

// Re-export types that are used by other modules
export type { CreateTokenRequest } from '../types/fourMeme';
import axios, {AxiosHeaders, AxiosRequestConfig, AxiosResponse} from "axios";
import {createTokenApiType} from "../hooks/useCreateFourMeme.ts";

const FOUR_MEME_BASE_URL = "https://four.meme/meme-api";

// Helper function to call FourMeme API directly
async function invokeFourMeme({
                                url,
                                method = "GET",
                                data,
                                headers = {},
                                isFormData = false,
                              }: {
  url: string;
  method?: string;
  data?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}): Promise<unknown> {
  try {
    const requestHeaders = isFormData
      ? {...headers} // Don't set Content-Type for FormData, let browser handle it
      : {'Content-Type': 'application/json', ...headers};

    const response = await fetch(`${FOUR_MEME_BASE_URL}${url}`, {
      method,
      headers: requestHeaders,
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log("Error invoking FourMeme API:", url, error);
    throw error;
  }
}

// Helper function to check API success
export const isApiSuccess = (response: any): boolean => {
  return response && (response.code === 0 || response.code === "0" || response.data);
};

// Step 1: Generate Nonce for Authentication
export const generateNonce = (
  data: GenerateNonceRequest
): Promise<GenerateNonceResponse> => {
  return invokeFourMeme({
    url: "/v1/private/user/nonce/generate",
    method: "POST",
    data,
  }) as Promise<GenerateNonceResponse>;
};

// Step 2: Login with Wallet Signature
export const loginFourMeme = (data: LoginRequest): Promise<LoginResponse> => {
  return invokeFourMeme({
    url: "/v1/private/user/login/dex",
    method: "POST",
    data,
  }) as Promise<LoginResponse>;
};

export async function invoke({
                               baseURL = "https://fd32c497428a.ngrok-free.app/",
                               url,
                               method = "GET",
                               data,
                               headers = {},
                             }:
                             AxiosRequestConfig): Promise<any> {
  try {
    // todo get auth code from redux store and not local storage
    const authCode =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("auth-code")
        : null;

    const mergedHeaders: AxiosHeaders = new AxiosHeaders();
    // Merge passed headers
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        mergedHeaders.set(key, value);
      });
    }
    // Add Authorization header if authCode exists
    if (authCode) mergedHeaders.Authorization = `Bearer ${authCode}`;

    const response: AxiosResponse = await axios({
      baseURL,
      url,
      method,
      data,
      headers: mergedHeaders,
    });
    return response.data;
  } catch (error) {
    console.log("Error invoking API:", url, error);
    return error as AxiosResponse;
  }
}

export const uploadTokenImageFourMeme = (
  file: File,
  accessToken: string
): Promise<UploadImageResponse> => {
  const data = new FormData();
  data.append("images", file);

  return invoke({
    url: "/token/uploadTokenImageFourMeme",
    method: "POST",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
      "meme-web-access": accessToken,
    },
  }) as Promise<UploadImageResponse>;
};

export const createTokenFourMeme = (
  data: CreateTokenRequest,
  accessToken: string
): Promise<CreateTokenResponse> => {
  return invoke({
    url: "/token/createFourMemeToken",
    method: "POST",
    data,
    headers: {
      "meme-web-access": accessToken,
    },
  }) as Promise<CreateTokenResponse>;
};

export interface SaveTokenRequest extends CreateTokenRequest {
  txHash: string;
  chainID: number;
  apiKey?: string;
  apiSecret?: string;
  aiThesis?: AIThesisConfig;
}

export const saveFourMemeToken = (
  data: SaveTokenRequest
): Promise<createTokenApiType> => {
  return invoke({
    url: "/token/saveFourMemeToken",
    method: "POST",
    data,
  });
};


// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Validate FourMeme API response
export const validateFourMemeResponse = <T>(response: T): T => {
  if (!response) {
    throw new Error('Invalid API response');
  }
  return response;
};