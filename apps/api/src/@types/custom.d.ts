import { Express } from 'express';
import { Multer as MulterNamed } from 'multer';

declare module 'express' {
  interface Request extends Express.Request {
    cookies: {
      token?: string;
      refreshToken?: string;
    };
  }
}

declare global {
  namespace Express {
    interface Multer extends MulterNamed {}
  }
}
