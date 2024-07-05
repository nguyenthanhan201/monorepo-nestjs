import { FileImgValidationPipe } from "@app/shared/pipes/file-img-validate";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { diskStorage } from "multer";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { FileDeleteDto } from "./dto/fileDelete.dto";
import { UploadService } from "./upload.service";

@ApiTags("Upload")
@Controller("upload")
@Public()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get("file")
  async getList() {
    return this.uploadService.getList();
  }

  @Post("file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFileImageKit(
    @UploadedFile(new FileImgValidationPipe())
    file: Express.Multer.File
  ) {
    // console.log('👌  file:', file);
    return this.uploadService.uploadFileImageKit(file);
  }

  @Post("file/s3")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFileS3(
    @UploadedFile(new FileImgValidationPipe())
    file: Express.Multer.File
  ) {
    return this.uploadService.uploadFileS3(file);
  }

  @Delete("file")
  async deleteFile(@Body() body: FileDeleteDto) {
    const { fileId } = body;

    return this.uploadService.deleteFile(fileId);
  }

  @Post("image")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    })
  )
  async uploadImage(
    @UploadedFile(new FileImgValidationPipe())
    file: Express.Multer.File
  ) {
    return this.uploadService.uploadImage(file);
  }

  @Get("image/:filePath")
  async getImage(@Param("filePath") filePath: string, @Res() res: Response) {
    // return this.uploadService.getListImage();
    res.sendFile(filePath, { root: "./uploads" });
  }
}
