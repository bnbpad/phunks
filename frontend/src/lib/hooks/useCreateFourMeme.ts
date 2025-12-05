import { useCallback, useState } from 'react';
import { useAccount, useConnectors } from 'wagmi';
import { signMessage, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { parseEther } from 'viem';
import { bsc } from 'wagmi/chains';
import * as fourMemeApi from '../api/fourMeme';
import { ICreateToken, SuccessData, FourMemeLabel } from '../types/fourMeme';
import { config as wagmiConfig } from '../wagmi';
import appConfig from '../config';

export type createTokenApiType = {
  success: boolean;
  error?: string;
  data: {
    tokenAddress: string;
    imgUrl: string;
    chainId: number;
    message: string;
  };
};

export const useCreateFourMeme = (
  formData: ICreateToken,
  imageFile: File | undefined,
  uploadedImageUrl: string,
  label: FourMemeLabel = "Meme"
) => {
  const { address } = useAccount();
  const connectors = useConnectors();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const callback = useCallback(async (
    onInitiating: () => void,
    afterImageUpload: (link: string) => void,
    onSuccess: (data: SuccessData) => void,
    onFailure: (e: string) => void,
    onEnd: () => void
  ): Promise<void> => {
    console.log("imageFile", imageFile);
    if (!address) {
      onFailure('Please connect your wallet first');
      return;
    }

    try {
      setStatus('loading');
      onInitiating();

      // Find the current connector with proper null safety
      const connector = connectors.find(c => c.accounts && Array.isArray(c.accounts) && c.accounts.includes(address));

      // 1. Generate Nonce
      console.log('Generating nonce...');
      const nonceResponse = await fourMemeApi.generateNonce({
        accountAddress: address,
        verifyType: "LOGIN",
        networkCode: "BSC",
      });

      if (!fourMemeApi.isApiSuccess(nonceResponse)) {
        throw new Error((nonceResponse as any)?.msg || 'Failed to generate nonce');
      }

      // 2. Sign Message & Login
      console.log('Signing authentication message...');
      const messageToSign = `You are sign in Meme ${nonceResponse.data}`;

      const signature = await signMessage(wagmiConfig, {
        message: messageToSign,
        account: address,
      });

      const loginResponse = await fourMemeApi.loginFourMeme({
        region: "WEB",
        langType: "EN",
        loginIp: "",
        inviteCode: "",
        verifyInfo: {
          address: address,
          networkCode: "BSC",
          signature: signature,
          verifyType: "LOGIN",
        },
        walletName: connector?.name || "Unknown",
      });

      if (!fourMemeApi.isApiSuccess(loginResponse)) {
        throw new Error((loginResponse as any)?.msg || 'Authentication failed');
      }

      const accessToken = (loginResponse as any)?.data;
      if (!accessToken) {
        throw new Error('Failed to get access token from login response');
      }

      // 3. Upload Image
      console.log('Uploading token image...');
      let imageUrl = uploadedImageUrl;

      if (!imageUrl || imageUrl.length <= 0) {
        const uploadResponse = await fourMemeApi.uploadTokenImageFourMeme(
          imageFile,
          accessToken
        );

        if (!fourMemeApi.isApiSuccess(uploadResponse)) {
          throw new Error((uploadResponse as any)?.msg || 'Failed to upload image');
        }

        imageUrl = uploadResponse?.data?.data as string;
        console.log('Image uploaded:', imageUrl);
        afterImageUpload(imageUrl);
      }

      // 4. Create Token on FourMeme
      console.log('Creating token on FourMeme...');
      const createTokenRequest: fourMemeApi.CreateTokenRequest = {
        name: formData.basicDetails.name,
        shortName: formData.basicDetails.symbol,
        desc: formData.basicDetails.desc,
        imgUrl: imageUrl,
        launchTime: Date.now(),
        label: "Meme",
        lpTradingFee: 0.0025,
        webUrl: "https://phunks.ai/",
        twitterUrl: formData.links.twitterLink || "",
        telegramUrl: formData.links.telegramLink || "",
        preSale: formData.tokenomics.amountToBuy || "0",
        onlyMPC: false,
        totalSupply: 1000000000,
        raisedAmount: 24,
        saleRate: 0.8,
        reserveRate: 0,
        funGroup: false,
        clickFun: false,
        symbol: "BNB",
      };

      const createResponse = await fourMemeApi.createTokenFourMeme(
        createTokenRequest,
        accessToken
      );

      if (!createResponse.data?.data) {
        throw new Error("Failed to create token");
      }

      // Step 5: Call Blockchain Contract
      const { createArg, signature: apiSignature } = createResponse.data.data;

      if (!createArg || !apiSignature) {
        throw new Error("Missing createArg or signature from API response");
      }

      const trxHash = await writeContract(wagmiConfig, {
        abi: appConfig.contracts.tokenManager.abi,
        address: appConfig.contracts.tokenManager.address as `0x${string}`,
        functionName: "createToken",
        args: [createArg as `0x${string}`, apiSignature as `0x${string}`],
        value: parseEther("0.01"), // Fixed 0.01 BNB fee
        account: address,
        chain: bsc, // Explicitly use BSC chain
      });

      if (!trxHash) {
        throw new Error("Transaction hash not found");
      }

      await waitForTransactionReceipt(wagmiConfig, { hash: trxHash });

      // 6. Save to Backend
      console.log('Saving token to backend...');
      const response = await fourMemeApi.saveFourMemeToken({
        ...createTokenRequest,
        txHash: trxHash,
        chainID: 56,
        aiThesis: formData.aiThesis || undefined,
      });

      if (response && !response.success) {
        if (response.error) {
          console.log("Error creating token:", response.error);
          onFailure("Token creation failed" + response.error);
        }
        onFailure("Token creation failed without any error");
        return;
      }

      onSuccess({
        trxHash: trxHash,
        tokenAddress: response.data.tokenAddress,
        message: "Token created successfully on FourMeme",
        chainId: formData.basicDetails.chainId,
        imgUrl: imageUrl,
        symbol: formData.basicDetails.symbol,
      });
    } catch (e) {
      console.error('Token creation error:', e);
      setStatus('error');

      const errorMessage = (e as Error)?.message || "Unknown error";

      // Check for user rejection
      if (/User rejected|rejected by user|user denied/i.test(errorMessage)) {
        setError("Operation cancelled by user");
        onFailure("Operation cancelled by user");
      } else {
        const fullErrorMessage = "Creation of token failed: " + errorMessage.slice(0, 120);
        setError(fullErrorMessage);
        onFailure(fullErrorMessage);
      }
    } finally {
      onEnd();
    }
  }, [address, connectors, formData, imageFile, uploadedImageUrl, label]);

  const createToken = useCallback(async (): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> => {
    return new Promise((resolve) => {
      setError(null);
      setSuccessData(null);

      callback(
        () => {
          console.log('Token creation initiated');
        }, // onInitiating
        (link: string) => {
          console.log('Image uploaded:', link);
        }, // afterImageUpload
        (data: SuccessData) => { // onSuccess
          setSuccessData(data);
          resolve({
            success: true,
            txHash: data.trxHash,
          });
        },
        (errorMessage: string) => { // onFailure
          setError(errorMessage);
          resolve({
            success: false,
            error: errorMessage,
          });
        },
        () => {
          console.log('Token creation process ended');
        } // onEnd
      );
    });
  }, [callback]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setSuccessData(null);
  }, []);

  return {
    createToken,
    isLoading: status === 'loading',
    error,
    successData,
    reset
  };
};