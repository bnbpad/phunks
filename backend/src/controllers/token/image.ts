import fs from 'fs';
import path from 'path';
import nconf from 'nconf';
import sharp from 'sharp';

import { s3 } from '../../utils/multer';
import { BadRequestError } from '../../errors';
import axios from 'axios';
import FormData from 'form-data';
const isProduction = nconf.get('NODE_ENV') === 'production';
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Upload an image to S3. The image is resized to 256x256 and saved to a new file.
 * The original file is deleted and the resized file is uploaded to S3.
 * The resized file is deleted after the upload is complete.
 *
 * @param file - The file to upload
 * @returns The URL of the uploaded image
 */
export const uploadImage = async (file: Express.Multer.File) => {
  try {
    if (!file) throw new BadRequestError('No file uploaded');

    const originalPath = file.path;

    const resizedPath = `${originalPath}-resized.png`;

    const s3Key = `${isProduction ? '' : 'staging/'}images/${Date.now()}.png`;

    // Resize and save to a new file
    await sharp(originalPath).resize(256, 256).toFormat('png').toFile(resizedPath);

    const uploadParams = {
      Bucket: nconf.get('AWS_BUCKET_NAME'),
      Key: s3Key,
      Body: fs.createReadStream(resizedPath),
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    const result = await s3.upload(uploadParams).promise();
    // Clean up both files
    fs.unlinkSync(originalPath);
    fs.unlinkSync(resizedPath);

    return `${nconf.get('AWS_CDN')}${result.Key}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new BadRequestError('Failed to upload image', error);
  }
};

export const uploadFormemeImage = async (file: Express.Multer.File, accessToken: string) => {
  try {
    if (!file) throw new BadRequestError('No file uploaded');

    const originalPath = file.path;
    const resizedPath = `${originalPath}-resized.png`;

    await sharp(originalPath).resize(256, 256).toFormat('png').toFile(resizedPath);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(resizedPath), {
      filename: 'image.png',
      contentType: 'image/png',
    });

    const response = await axios.post(
      'https://four.meme/meme-api/v1/private/token/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'meme-web-access': accessToken,
        },
      }
    );

    fs.unlinkSync(originalPath);
    fs.unlinkSync(resizedPath);

    return response.data;
  } catch (error) {
    console.error('Error uploading Formeme image:', error);
    throw new BadRequestError('Failed to upload image', error);
  }
};
