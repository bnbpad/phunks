import mongoose from 'mongoose';
import nconf from 'nconf';

mongoose.set('strictQuery', false);
mongoose.set('debug', false);

export const open = () => {
  return new Promise<void>(resolve => {
    console.log('opening mongodb connection...');
    mongoose.connect(nconf.get('DATABASE_URI'));
    resolve();
  });
};

export const close = () => mongoose.disconnect();
