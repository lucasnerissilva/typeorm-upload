import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import AppError from '../errors/AppError';

export const csvFileDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  storage: multer.diskStorage({
    destination: csvFileDirectory,
    filename(request: Express.Request, file: Express.Multer.File, callback) {
      const hash = crypto.randomBytes(8).toString('HEX');
      const originalname = file.originalname;

      if (!file.mimetype.includes('text/csv'))
        throw new AppError('invalid csv extension', 400);

      const fileName = `${hash} - ${originalname}`;

      return callback(null, fileName);
    },
  }),
};
