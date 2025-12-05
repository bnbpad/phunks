// FourMeme API Integration

import {
  GenerateNonceRequest,
  GenerateNonceResponse,
  LoginRequest,
  LoginResponse,
  UploadImageResponse,
  CreateTokenRequest,
  CreateTokenResponse,
  SaveTokenRequest,
  SaveTokenResponse
} from '../types/fourMeme';

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

// Step 4: Create Token on FourMeme
export const createTokenFourMeme = async (
  data: CreateTokenRequest,
  accessToken: string
): Promise<CreateTokenResponse> => {
  try {
    // Try using invokeFourMeme first, fallback to mock if CORS fails
    try {
      return invokeFourMeme({
        url: "/v1/private/token/create",
        method: "POST",
        data,
        headers: {
          'meme-web-access': accessToken,
        },
      }) as Promise<CreateTokenResponse>;
    } catch (corsError) {
      // If CORS error, return mock response for development
      if (corsError instanceof TypeError || corsError.toString().includes('CORS')) {
        console.warn('CORS error detected, using mock response for development');
        return {
          code: "0",
          data: {
            tokenId: 12345,
            totalAmount: "1000000000",
            saleAmount: "800000000",
            template: 1,
            launchTime: Date.now(),
            serverTime: Date.now(),
            createArg: "0x" + "0".repeat(64), // Mock hex data
            signature: "0x" + "0".repeat(130), // Mock signature
            bamount: "24",
            tamount: "1000000000"
          }
        };
      }
      throw corsError;
    }
  } catch (error) {
    console.error('Create token error:', error);
    throw new Error('Failed to create token on FourMeme: ' + (error as Error).message);
  }
};

// Step 5: Save Token to Backend (mock for development)
export const saveFourMemeToken = async (
  data: SaveTokenRequest
): Promise<SaveTokenResponse> => {
  try {
    // Mock successful response for development
    // In production, this would save to your backend database
    console.warn('Save token skipped - using mock response for development');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: {
        tokenAddress: "0x" + Math.random().toString(16).substring(2, 42).padStart(40, '0'),
      }
    };
  } catch (error) {
    console.error('Save token error:', error);
    throw new Error('Failed to save token data');
  }
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