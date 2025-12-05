import request from 'supertest';
import { app } from '../../app';
import { verifyChainSignature } from '../../utils/verifySign';

// Mock the verifyChainSignature function
jest.mock('../../utils/verifySign', () => ({
  verifyChainSignature: jest.fn(),
}));

describe('User Endpoints', () => {
  const testWalletAddress = '0x1234567890123456789012345678901234567890';
  const testMessage = 'Test message for signing';
  const testSignature =
    '0x12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678';

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe.only('POST /user/login', () => {
    it('should login with valid signature', async () => {
      // Mock the signature verification
      (verifyChainSignature as jest.Mock).mockResolvedValueOnce({
        verified: true,
        address: testWalletAddress,
      });

      const response = await request(app)
        .post('/user/login')
        .send({
          message: testMessage,
          signature: testSignature,
          walletAddress: testWalletAddress,
          chainType: 'evm',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.walletAddress).toBe(testWalletAddress);
      expect(response.body.data.jwt).toBeDefined();
    });

    it('should handle invalid signature', async () => {
      (verifyChainSignature as jest.Mock).mockResolvedValueOnce({
        verified: false,
        address: testWalletAddress,
      });

      const response = await request(app)
        .post('/user/login')
        .send({
          message: testMessage,
          signature: testSignature,
          walletAddress: testWalletAddress,
          chainType: 'evm',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Signature verification failed');
    });
  });
});
