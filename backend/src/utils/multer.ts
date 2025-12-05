import fs from 'fs';
import path from 'path';

import * as AWS from 'aws-sdk';
import multer from 'multer';
import s3Storage from 'multer-sharp-s3';
import nconf from 'nconf';

if (nconf.get('AWS_ACCESS_KEY_ID')) {
  AWS.config.update({
    accessKeyId: nconf.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: nconf.get('AWS_SECRET_ACCESS_KEY'),
    region: nconf.get('AWS_REGION'),
  });
} else {
  console.warn('AWS_ACCESS_KEY_ID is not set');
}

const isProduction = nconf.get('NODE_ENV') === 'production';
export const s3 = new AWS.S3();

export const upload = multer({
  storage: s3Storage({
    s3,
    Bucket: nconf.get('AWS_BUCKET_NAME'),
    ACL: 'public-read',
    Key: (_req: any, file: any, cb: any) => {
      let folder = 'others'; // Default folder
      if (file.fieldname === 'icon') {
        folder = 'icons';
      } else if (file.fieldname === 'images') {
        folder = 'images';
      } else if (file.fieldname === 'video') {
        folder = 'videos';
      }
      cb(null, `${isProduction ? '' : 'staging/'}${folder}/${Date.now()}.png`);
    },
    resize: { width: 256, height: 256 },
  }),
});

export const localUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, '../../uploads/');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    },
  }),
});
