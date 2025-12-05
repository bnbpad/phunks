import '../config/nconf';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export let mockMongod: MongoMemoryServer;

import nconf from 'nconf';
nconf.set('NODE_ENV', 'test');
nconf.set('AWS_BUCKET_NAME', 'test');
nconf.set('AWS_ACCESS_KEY_ID', 'test');
nconf.set('AWS_SECRET_ACCESS_KEY', 'test');
nconf.set('AWS_REGION', 'test');
nconf.set('OPENSEA_API_KEY', 'test');

beforeAll(async () => {
  mockMongod = await MongoMemoryServer.create();
  const uri = mockMongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mockMongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
