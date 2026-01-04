import multer from 'multer';
import { storageConfig } from '../config/storage.config';

// Configurar multer para usar memória (depois enviamos para S3)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: storageConfig.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (storageConfig.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  },
});
