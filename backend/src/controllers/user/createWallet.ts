import axios from 'axios';
import { ethers } from 'ethers';

const ASTER_WEB3_BASE_URL = 'https://www.asterdex.com/bapi/futures/v1/private/future/web3';

const extractSigningMessage = (payload: unknown): string | undefined => {
  if (!payload) return undefined;
  if (typeof payload === 'string') return payload;
  if (typeof payload !== 'object') return undefined;

  const candidate =
    (payload as Record<string, unknown>).message ??
    (payload as Record<string, unknown>).nonce ??
    (payload as Record<string, unknown>).msg;
  if (typeof candidate === 'string' && candidate.trim().length > 0) return candidate;

  const nested = (payload as Record<string, unknown>).data;
  if (nested) {
    return extractSigningMessage(nested);
  }

  return undefined;
};

export const createWalletWithSeedPhrase = async (tokenId?: string) => {
  try {
    // Generate a 24-word mnemonic
    const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32));

    // Create wallet from mnemonic
    const wallet = ethers.Wallet.fromPhrase(mnemonic);

    // Get wallet details
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    console.log('Mnemonic:', mnemonic);
    console.log('Wallet address:', walletAddress);
    console.log('Private key:', privateKey);
    return {
      mnemonic,
      walletAddress,
      privateKey,
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

createWalletWithSeedPhrase();

export interface CreateAsterApiKeyOptions {
  walletAddress: string;
  privateKey: string;
  desc: string;
  ip?: string;
  type?: string;
  noncePayload?: unknown;
}

const getNonce = async (walletAddress: string, type = 'CREATE_API_KEY') => {
  try {
    const body = { sourceAddr: walletAddress, type };
    const response = await axios.post(
      `https://www.asterdex.com/bapi/futures/v1/public/future/web3/get-nonce`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data.data.nonce;
  } catch (error) {
    console.log('Error:', error);
    throw new Error(`Failed to fetch AsterDex nonce: ${error}`);
  }
};

const signMessage = async (nonce: string, privateKey: string) => {
  try {
    console.log('\nStep 2: Signing message with wallet...');

    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);

    // The message format Aster expects (this may need adjustment based on Aster's requirements)
    // Common formats are:
    // 1. Just the nonce
    // 2. Nonce with prefix like "Aster: {nonce}"
    // 3. Structured message

    // Try different message formats - you may need to adjust this
    const message = nonce; // Simple approach - just sign the nonce

    // Alternative formats (uncomment if needed):
    // const message = `Aster: ${nonce}`;
    // const message = `Sign this message to create API key:\n\nNonce: ${nonce}`;

    console.log('Message to sign:', message);

    // Sign the message
    const signature = await wallet.signMessage(message);

    console.log('✓ Signature created:', signature);
    return signature;
  } catch (error: any) {
    console.error('Error signing message:', error.message);
    throw error;
  }
};

const login = async (walletAddress: string, signature: string) => {
  try {
    const body = { sourceAddr: walletAddress, signature };
    const response = await axios.post(
      `https://www.asterdex.com/bapi/futures/v1/public/future/web3/ae/login`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log('Login Response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

const createAPIKey = async (
  walletAddress: string,
  signature: string,
  description: string,
  ipWhitelist = ''
) => {
  try {
    console.log('\nStep 3: Creating API key...');
    console.log('Description:', description);
    console.log('IP Whitelist:', ipWhitelist || 'No restriction');

    const payload = {
      ip: ipWhitelist,
      desc: description,
      signature: signature,
      sourceAddr: walletAddress,
      type: 'CREATE_API_KEY',
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `https://www.asterdex.com/bapi/futures/v1/private/future/web3/create-api-key`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: 'https://www.asterdex.com',
          Referer: 'https://www.asterdex.com/',
        },
      }
    );

    console.log('\n✓ API Key created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error('Error creating API key:', error.response?.data || error.message);
    throw error;
  }
};

const createAsterAPIKey = async (privateKey: string, description: string, ipWhitelist = '') => {
  try {
    console.log('='.repeat(60));
    console.log('Aster API Key Creator');
    console.log('='.repeat(60));

    // Validate private key
    if (!privateKey || privateKey === 'YOUR_PRIVATE_KEY_HERE') {
      throw new Error('Please provide your wallet private key');
    }

    // Create wallet to get address
    const wallet = new ethers.Wallet(privateKey);
    const walletAddress = wallet.address;

    console.log('Wallet Address:', walletAddress);
    console.log('');

    // Step 1: Get nonce
    const nonce = await getNonce(walletAddress);
    console.log('Nonce:', nonce);
    // Step 2: Sign message
    const signature = await signMessage(nonce, privateKey);
    console.log('Signature:', signature);

    // Step 3: Login
    const loginResult = await login(walletAddress, signature);
    console.log('Login Result:', loginResult);

    // Step 4: Create API key
    const result = await createAPIKey(walletAddress, signature, description, ipWhitelist);

    // Display results
    console.log('\n' + '='.repeat(60));
    console.log('SUCCESS! Your API keys:');
    console.log('='.repeat(60));
    console.log('Result:', result);
    if (result.data) {
      if (result.data.apiKey) {
        console.log('\n📌 API Key:', result.data.apiKey);
      }
      if (result.data.secretKey) {
        console.log('🔑 Secret Key:', result.data.secretKey);
        console.log("\n⚠️  IMPORTANT: Save your secret key now! It won't be shown again.");
      }
      if (result.data.apiKeyId) {
        console.log('🆔 API Key ID:', result.data.apiKeyId);
      }
    }

    console.log('\n' + '='.repeat(60));

    return result;
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

const main = async () => {
  const { privateKey } = await createWalletWithSeedPhrase();
  const description = 'backend-generated';
  const result = await createAsterAPIKey(privateKey, description);
  console.log(result);
};

main();
