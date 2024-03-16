import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

const videoType = ['video/mp4'];

@Injectable()
export class FileVideoValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file)
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);

    const limitMb = 100000000; // 100mb

    // check type of file is img
    if (!videoType.includes(file.mimetype)) {
      throw new HttpException('File type is not video', HttpStatus.BAD_REQUEST);
    }

    // check size of file is less than 100mb
    if (file.size > limitMb) {
      throw new HttpException(
        'File size is too large',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    return file;
  }
}
