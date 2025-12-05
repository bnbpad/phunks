import { SiweMessage } from '../siwe/lib/client';

export type VerificationResult = {
  verified: boolean;
  address: string | null;
};

export const verifyChainSignature = async (
  chainType: string,
  walletAddress: string,
  message: string,
  signature: string
): Promise<VerificationResult> => {
  try {
    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature });
    const extractedAddress = result.data.address.toLowerCase().trim();
    const providedAddress = walletAddress.toLowerCase().trim();
    return {
      verified: extractedAddress === providedAddress,
      address: extractedAddress,
    };
  } catch (error) {
    console.error('Signature verification failed:', error);
    return { verified: false, address: null };
  }
};
