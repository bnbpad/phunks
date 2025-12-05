import axios from 'axios';

const APRO_API_BASE_URL = 'https://api-ai-oracle.apro.com/v1/ticker/currency/price';

export interface AproPriceResponse {
  name: string;
  price: number;
}

export interface CryptoPrices {
  ethereum: AproPriceResponse | null;
  bitcoin: AproPriceResponse | null;
  bnb: AproPriceResponse | null;
}

/**
 * Fetches the price for a single cryptocurrency from the Apro API
 * @param name - The cryptocurrency name (e.g., 'ethereum', 'bitcoin', 'bnb')
 * @param quotation - The currency to quote in (default: 'usd')
 * @param type - The price type (default: 'median')
 * @returns The price response or null if the request fails
 */
async function getAproPrice(
  name: string,
  quotation: string = 'usd',
  type: string = 'median'
): Promise<AproPriceResponse | null> {
  try {
    const response = await axios.get<any>(APRO_API_BASE_URL, {
      params: {
        name,
        quotation,
        type,
      },
      headers: {
        accept: 'application/json',
      },
    });

    const price: AproPriceResponse = {
      name,
      price: response.data?.data?.price || response.data?.price || 0,
    };
    return price;
  } catch (error: any) {
    console.error(`Failed to fetch price for ${name}:`, error.message);
    return null;
  }
}

/**
 * Fetches prices for Ethereum, Bitcoin, and BNB from the Apro API
 * @param quotation - The currency to quote in (default: 'usd')
 * @param type - The price type (default: 'median')
 * @returns An object containing prices for Ethereum, Bitcoin, and BNB
 */
export async function getAproPrices(
  quotation: string = 'usd',
  type: string = 'median'
): Promise<CryptoPrices> {
  const [ethereum, bitcoin, bnb] = await Promise.all([
    getAproPrice('ethereum', quotation, type),
    getAproPrice('bitcoin', quotation, type),
    getAproPrice('bnb', quotation, type),
  ]);

  return {
    ethereum,
    bitcoin,
    bnb,
  };
}

async function main() {
  const prices = await getAproPrices();
}

main();
