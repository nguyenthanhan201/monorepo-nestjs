import { ImagekitService } from "@app/shared/configs/imageKit.config";
import { S3Service } from "@app/shared/configs/s3.config";
import { Upload } from "@aws-sdk/lib-storage";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async getList() {
    try {
      const list = await ImagekitService.listFiles({
        path: "/products",
        skip: 0,
        limit: 10,
      });
      return list;
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error, null, 2),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async uploadFileImageKit(file: Express.Multer.File) {
    const { buffer, originalname } = file;
    // console.log('👌  file:', file);

    try {
      const uploadedFile = await ImagekitService.upload({
        file: buffer.toString("base64"),
        fileName: originalname,
        folder: "/products",
      });

      return uploadedFile;
    } catch (error) {
      console.log("👌  error:", error);
      throw new HttpException(
        JSON.stringify(error, null, 2),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async uploadFileS3(file: Express.Multer.File) {
    const path = "90s";
    const bucket_name = this.configService.get("AWS_S3_PUBLIC_BUCKET");
    const key = `${path}/${Date.now().toString()}-${file.originalname}`;

    // normal upload
    // await S3Service.send(
    //   new PutObjectCommand({
    //     Bucket: bucket_name,
    //     Key: key,
    //     Body: file.buffer,
    //     ContentType: file.mimetype,
    //     ACL: "public-read",
    //     ContentLength: file.size, // calculate length of buffer
    //   })
    // );

    // multipart upload
    const parallelUploads3 = new Upload({
      client: S3Service,
      params: {
        Bucket: bucket_name,
        Key: key,
        Body: Buffer.from(file.buffer),
        ACL: "public-read",
        ContentType: file.mimetype,
      },
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log({ progress });
    });

    await parallelUploads3.done();

    return `https://${bucket_name}.s3.amazonaws.com/${key}`;
  }

  async deleteFile(fileId: string) {
    try {
      const deletedFile = await ImagekitService.deleteFile(fileId);
      return deletedFile;
    } catch (error) {
      console.log("👌  error:", error);
      throw new HttpException(
        JSON.stringify(error, null, 2),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async uploadImage(file: Express.Multer.File) {
    return {
      ...file,
      filePath: `http://localhost:8080/api/v1/upload/image/${file.filename}`,
    };
  }
}
