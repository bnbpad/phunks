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
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
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
      ? { ...headers } // Don't set Content-Type for FormData, let browser handle it
      : { 'Content-Type': 'application/json', ...headers };

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

// Step 3: Upload Token Image
export const uploadTokenImageFourMeme = async (
  file: File,
  accessToken: string
): Promise<UploadImageResponse> => {
  try {
    // Try using invokeFourMeme first, fallback to mock if CORS fails
    try {
      const formData = new FormData();
      formData.append('file', file);

      return invokeFourMeme({
        url: "/v1/private/token/upload",
        method: "POST",
        data: formData,
        headers: {
          'meme-web-access': accessToken,
        },
        isFormData: true,
      }) as Promise<UploadImageResponse>;
    } catch (corsError) {
      // If CORS error, return mock response for development
      if (corsError instanceof TypeError || corsError.toString().includes('CORS')) {
        console.warn('CORS error detected for image upload, using default image');
        return {
          code: "0",
          data: 'https://public.bnbstatic.com/image/cms/blog/20190313/977e803b-c37e-4eb2-91fb-1a744a9bc7b6.png'
        };
      }
      throw corsError;
    }
  } catch (error) {
    console.error('Upload image error:', error);
    throw new Error('Failed to upload token image');
  }
};

export async function invoke({
                               baseURL = "https://fd32c497428a.ngrok-free.app/",
                               url,
                               method = "GET",
                               data,
                               headers = {},
                             }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
                             AxiosRequestConfig): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
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

// Step 4: Create Token on FourMeme (using proxy approach for CORS)
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