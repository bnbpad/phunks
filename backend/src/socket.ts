import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import nconf from 'nconf';
import { verifyToken } from './utils';
import { Users } from './database/user';
import { Tokens } from './database/token';

const socketHandler = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    console.log('connected');
    const token = socket.handshake.auth.token;
    const secretKey = nconf.get('SECRET_KEY');

    socket.on('startChat', async (daoAddress: string, walletAddress: string) => {
      try {
        const dao = await Tokens.findOne({
          'basicDetails.address': daoAddress.toLowerCase().trim(),
        });
        if (!dao) return socket.emit('error', 'Dao not found');
        await socket.join(daoAddress);
        socket.emit('chatJoined', daoAddress);
      } catch (error) {
        console.error('Error joining chat:', error);
        socket.emit('error', 'An error occurred while joining the group.');
      }
    });

    socket.on('endChat', async (daoAddress: string) => {
      const dao = await Tokens.findOne({
        'basicDetails.address': daoAddress.toLowerCase().trim(),
      });
      if (!dao) return socket.emit('error', 'Dao not found');

      await socket.leave(daoAddress);
      socket.emit('chatEnded', daoAddress);
    });

    socket.on('sendMessage', async ({ walletAddress }: { walletAddress: string }) => {
      try {
        const decoded = verifyToken(token, secretKey) as { userId: string };
        const user = await Users.findOne({
          _id: new mongoose.Types.ObjectId(`${decoded.userId}`),
        }).select('walletAddress karma lastKarmaUpdate');

        if (!user) {
          return socket.emit('error', 'User not found');
        }
        if (!decoded.userId || walletAddress.toLowerCase() !== user.walletAddress)
          return socket.emit('error', 'Unauthorized');

        console.log('new message emitted');
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message.');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

export default socketHandler;
