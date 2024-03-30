import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    // const serviceAccount = require('../../config/vite-admin-5a901-firebase-adminsdk-tntl4-3624e97b6d.json');
    admin.initializeApp({
      credential: admin.credential.cert({
        type: 'service_account',
        project_id: 'vite-admin-5a901',
        private_key_id: '3624e97b6dc9e33c6c18375f08a3d84eb54119bd',
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDqwcr8bTO3gN0p\n4181fsW74vZSacAXiOrCPABDRbbhWEqkg7IpjYvL1k0yB1Q3SJi1XAhy8FYBYn1p\nbPWRKd4koFH8JyJ/k5+XlU+a9cdc2g7UUOoDK0CE5NgLvqGm48oREeuyCsOsDjZy\nsxqjOWT5gd1Dq0i6fYayxGryMpAl4TmXS0HYZrT8LcF8OcY2BTko/KduDl08G1t0\nn3yI0rnDFjMI/HlF/A5XyC9FkYHdDWwuTT/jFR1lrMDkNLsrvJRPUqRQpwRSXym7\ntDdiw6RiDa8jNqtT4MYSvwW34zhxs6vTvq5NVOQKq6Cx03OhFe/yYnImZbCCwQuv\nApEL1sQjAgMBAAECggEAR7X+H0DueOI07QxHM6yvk1bf3snuA2JwL/grLmGX3Vte\npcWTAW17JD+o4hzqBV84QsJD1HSFGTQwUimWFAthj/enQ6rit2ztZd0W7aOhjEQS\nHpo++cvXECFlu6S2dagEvFUolgECx8aprDz46J5qMWuRnw+uDkW1BVvJvYVjkiYW\nbugtMVSFxjycy4PZlI4iICMB+F2EY9d6Qop4cCAYpC1hoWr49I4Yl98qT9EKvKy7\ncztPP13RW9s3buvIKwjU5yFobhVqg1N14ye+az/sm5zvjRkNDEzuphL/WcpOJEgm\nKcR6ejgSutLHEH85EyHQ0RXx9RJy/TkUN3aBKk0VKQKBgQD2QIAs5ofY4/3iVjay\niJL4dLn7NLH3kK1nHtQxcgjTy0GzE7s1AyepEyN4Xj98EqRNiGi8bDu0U0USfhMq\nMkCD0wXTryAHgvI6HTTAkC4qg9OgMpywbWqdBvuUzuQoFv0rTgtvi5lOx9I6pNXG\nRXyrPEjKoHciFbp7CaDJHbZ+ewKBgQD0DM2gERHCWZCQbuYrX8C/KBaUeQyk+eOc\neMV+k6iSEm2H212CcKjW33v9f1WE8nYpUdY8jHqBQDpo4LWrnQL3nuSLbmyEH/SS\nFU/EBWDC4mhir1oPSrdQPv0JfL91plDCPQvGyBgJnb/RkJcTU9NF9zyOsipF+dWt\n1uR3yWw0eQKBgDLDXSjkZQC7Dy1HZIMtUE7TkTtNw5orQvPNESUYQuWWMvb9jEwD\nWHusLFW16BRlq2UoR58AGNa1i7miL8U1EsOaDstygIHL5q9AMg24KywsfMW7aT2d\ncKrqM5abh8ET7CCvOABIoNPysU3RiRgUXvzVspPCvIxUOlr+wxxyeZpdAoGBAKLR\nY+H1YV7DOEJT6nVnhYVCroXRmJD8MlEy9beztVP2vWJVBLbAiLQKF4ORDzIKPLDm\na0KsChLvEcjkme9rag5f0GQBgJ5JX3aSh0vktqBuQmwMRs5K76+2xkQtGOLZ2aks\n5w1wczD/MHkUuOXpF9vmzVz6Gl/jBR7cbkJIfEspAoGBAOPShi+7WaLEIhdf3i68\ngweQjIIzOf2V5RMdSZFl2S54iJah2RzlAjxqoXPbj2SCzf+hAdGO7mBFZ+Jfj27r\nH2yRW9TjfitKgJ/wNO8Uz3GP/uJ+Qt1tD2xcwG5LK0uVCcHfatUIJ5gq1Tx/reuH\nRMeHyATWZihk7rFLtWG0ocNU\n-----END PRIVATE KEY-----\n',
        client_email:
          'firebase-adminsdk-tntl4@vite-admin-5a901.iam.gserviceaccount.com',
        client_id: '105978397723094354064',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url:
          'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tntl4%40vite-admin-5a901.iam.gserviceaccount.com',
        universe_domain: 'googleapis.com',
      } as admin.ServiceAccount),
      storageBucket: 'vite-admin-5a901.appspot.com',
    });
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
