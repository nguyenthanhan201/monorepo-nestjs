import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  firebaseCredential,
  firebaseStorageBucket,
} from '../configs/firebaseCredential.config';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseCredential),
      storageBucket: firebaseStorageBucket,
    });
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
