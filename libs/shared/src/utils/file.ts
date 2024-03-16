import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as https from 'https';

async function getRemoteFile(fileName: string, url: string) {
  return new Promise((resolve) => {
    https.get(url, function (response) {
      const len = parseInt(response.headers['content-length'] || '', 10);
      let cur = 0;
      const total = len / 1048576; //1048576 - bytes in 1 Megabyte

      response.on('data', function (chunk) {
        cur += chunk.length;
        showProgress(fileName, cur, len, total);
      });

      response.on('end', function () {
        console.log('Download complete');
      });

      response
        .pipe(fs.createWriteStream(fileName))
        .on('finish', () => {
          resolve(true);
        })
        .on('error', (err) => {
          throw new HttpException(
            err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
    });
  });
}

function showProgress(
  fileName: string,
  cur: number,
  len: number,
  total: number,
) {
  console.log(
    'Downloading ' +
      fileName +
      ' - ' +
      ((100.0 * cur) / len).toFixed(2) +
      '% (' +
      (cur / 1048576).toFixed(2) +
      ' MB) of total size: ' +
      total.toFixed(2) +
      ' MB',
  );
}

export { getRemoteFile, showProgress };
