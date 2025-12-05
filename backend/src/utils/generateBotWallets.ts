import { ethers } from 'ethers';
import mongoose from 'mongoose';
import nconf from 'nconf';
import path from 'path';
import { Users } from '../database/user';

nconf
  .argv()
  .env()
  .file({ file: path.resolve(__dirname, '../../config.json') });

async function generateBotWallets() {
  try {
    await mongoose.connect(nconf.get('DATABASE_URI'));

    const wallets = [];

    for (let i = 0; i < 100; i++) {
      const wallet = ethers.Wallet.createRandom();
      wallets.push({
        userName: `bot_${i + 1}`,
        walletAddress: wallet.address.toLowerCase(),
        jwt: '', // Empty JWT as these are bot accounts
        referralCode: `BOT${i + 1}`,
        karma: 0,
        finalScore: 0,
        isBot: true,
      });
    }

    const savedWallets = await Users.insertMany(wallets);

    await mongoose.disconnect();

    return savedWallets;
  } catch (error) {
    console.error('Error generating bot wallets:', error);
    await mongoose.disconnect();
    throw error;
  }
}

generateBotWallets()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
