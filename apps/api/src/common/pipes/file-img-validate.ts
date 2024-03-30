import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

const imageType = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'jpeg',
  'jpg',
  'png',
  'svg',
];

@Injectable()
export class FileImgValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    const limitKb = 100000; // 100kb

    // check type of file is img
    if (!imageType.includes(file.mimetype)) {
      throw new HttpException('File type is not image', HttpStatus.BAD_REQUEST);
    }

    // check size of file is less than 1kb
    if (file.size > limitKb) {
      throw new HttpException(
        'File size is too large',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    return file;
  }
}
