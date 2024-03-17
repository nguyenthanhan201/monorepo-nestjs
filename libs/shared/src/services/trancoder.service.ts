import { IUploadResponse } from "@app/shared/interfaces/imageKit.interface";
import { FirebaseService } from "@app/shared/services/firebase.service";
import { UploadService } from "@app/shared/services/upload.service";
import * as ffmpegExecutable from "@ffmpeg-installer/ffmpeg";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import * as ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as path from "path";

ffmpeg.setFfmpegPath(ffmpegExecutable.path);

export interface PlaylistVariant {
  resolution: string;
  outputFileName: string;
}

export interface Resolution {
  resolution: string;
  videoBitrate: string;
  audioBitrate: string;
}
const resolutions: Resolution[] = [
  {
    resolution: "854x480",
    videoBitrate: "1000k",
    audioBitrate: "128k",
  },
  {
    resolution: "1280x720",
    videoBitrate: "2500k",
    audioBitrate: "192k",
  },
  {
    resolution: "1920x1080",
    videoBitrate: "5000k",
    audioBitrate: "192k",
  },
];

@Injectable()
export class TrancoderService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly uploadService: UploadService,
    @Inject("main_queue") private readonly uploadClient: ClientProxy
  ) {}
  async transcoderProcess({
    mp4FileName,
    mp4Path,
  }: {
    mp4FileName: string;
    mp4Path: string;
  }): Promise<string> {
    console.log("Starting script");
    console.log("ffmpegExecutable.path", ffmpegExecutable.path);

    try {
      // const existsUrl = await this.checkIfFileExists(mp4FileName);

      // if (existsUrl) {
      //   return existsUrl;
      // }

      const variantPlaylists = await this.convert(mp4FileName, mp4Path);

      this.generateMasterPlaylist(variantPlaylists, mp4FileName);

      const videoUrl = await this.upload();

      await this.deleteLocalVideo();
      // await this.deleteLocalUpload();
      await this.deleteLocalDownloadVideo(mp4Path);

      console.log("Success");

      return videoUrl;
    } catch (error) {
      throw error;
    }
  }

  async convert(
    mp4FileName: string,
    mp4Path: string
  ): Promise<PlaylistVariant[]> {
    const variantPlaylists: PlaylistVariant[] = [];
    for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
      console.log(`HLS conversion starting for ${resolution}`);
      const outputFileName = `${mp4FileName.replace(
        ".",
        "_"
      )}_${resolution}.m3u8`;
      const segmentFileName = `${mp4FileName.replace(
        ".",
        "_"
      )}_${resolution}_%03d.ts?alt=media`;
      await new Promise((resolve, reject) => {
        ffmpeg(mp4Path)
          .outputOptions([
            `-c:v h264`,
            `-b:v ${videoBitrate}`,
            `-c:a aac`,
            `-b:a ${audioBitrate}`,
            `-vf scale=${resolution}`,
            `-f hls`,
            `-hls_time 10`,
            `-hls_list_size 0`,
            `-hls_segment_filename hls/${segmentFileName}`,
          ])
          .output(`hls/${outputFileName}`)
          // .on('start', function (commandLine) {
          //   console.log('Spawned Ffmpeg with command: ' + commandLine);
          // })
          .on("end", (val: unknown) => resolve(val))
          // .on("progress", function (progress) {
          //   console.log("Processing: " + progress.percent + "% done");
          // })
          .on("error", (err: any) => reject(err))
          .run();
      });
      const variantPlaylist: PlaylistVariant = {
        resolution: resolution,
        outputFileName: outputFileName,
      };
      variantPlaylists.push(variantPlaylist);
      console.log(`HLS conversion done for ${resolution}`);
    }

    return variantPlaylists;
  }
  generateMasterPlaylist(
    variantPlaylists: PlaylistVariant[],
    mp4FileName: string
  ): string {
    console.log(`HLS master m3u8 playlist generating`);

    let masterPlaylist = variantPlaylists
      .map((variantPlaylist: PlaylistVariant) => {
        const { resolution, outputFileName } = variantPlaylist;
        const bandwidth =
          resolution === "320x180"
            ? 676800
            : resolution === "854x480"
              ? 1353600
              : 3230400;
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}?alt=media`;
      })
      .join("\n");
    masterPlaylist = `#EXTM3U\n` + masterPlaylist;

    const masterPlaylistFileName = `${mp4FileName.replace(
      ".",
      "_"
    )}_master.m3u8`;
    const masterPlaylistPath = `hls/${masterPlaylistFileName}`;
    fs.writeFileSync(masterPlaylistPath, masterPlaylist);

    console.log(`HLS master m3u8 playlist generated`);

    return masterPlaylistFileName;
  }
  async upload(): Promise<string> {
    const hlsFolder = path.resolve("hls");
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();
    let videoUrl = "";
    const listUrl = [];

    const files = fs.readdirSync(hlsFolder);

    await Promise.all(
      files.map(async (file) => {
        const fileName = `${file}`.replace("?alt=media", "");
        const fileUpload = bucket.file(fileName);

        // await fileUpload
        //   .getSignedUrl({
        //     action: 'read',
        //     expires: Date.now() + 15 * 60 * 1000,
        //   })
        //   .then((exists) => {
        //     if (exists[0]) {
        //       const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;

        //       if (file.includes('master.m3u8')) videoUrl = imageUrl;

        //       listUrl.push(imageUrl);
        //     }
        //   });

        const filePath = path.join(hlsFolder, file);
        const fileStream = fs.readFileSync(filePath);

        const stream = fileUpload.createWriteStream();

        return new Promise((resolve, reject) => {
          stream.on("error", (err) => {
            reject(err);
          });

          stream.on("finish", () => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;

            if (file.includes("master.m3u8")) videoUrl = imageUrl;

            listUrl.push(imageUrl);
            resolve(imageUrl);
          });

          stream.end(fileStream);
        });
      })
    );

    console.log(listUrl);

    return videoUrl;
  }

  async uploadOriginalVideo(
    file: Express.Multer.File
  ): Promise<IUploadResponse> {
    const uploadVideo = await this.uploadService.uploadFile(file);

    return uploadVideo;
  }
  async deleteOriginalVideo() {}
  async transcoder(file: Express.Multer.File): Promise<string> {
    try {
      const { fileId, url } = await this.uploadOriginalVideo(file);

      const urlTranscoder = this.uploadClient.send(
        {
          cmd: "transcoder",
        },
        {
          fileId,
          url,
        }
      );
      console.log("👌  urlTranscoder:", urlTranscoder);

      return urlTranscoder as any;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  deleteLocalVideo = async (): Promise<void> => {
    console.log("Deleting files in hls folder");
    const directory = path.resolve("hls");

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });
    console.log("Deleted files in hls folder");
  };
  deleteLocalUpload = async (): Promise<void> => {
    console.log("Deleting files in uploads folder");
    const directory = path.resolve("uploads");

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });
    console.log("Deleted files in uploads folder");
  };
  deleteLocalDownloadVideo = async (filePath: string): Promise<void> => {
    console.log("Deleting  download video");
    fs.unlink(path.resolve(filePath), (err) => {
      if (err)
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
    console.log("Deleted  download video");
  };
}

// async checkIfFileExists(mp4FileName: string): Promise<string | null> {
//   const masterPlaylistFileName = `${mp4FileName.replace(
//     '.',
//     '_',
//   )}_master.m3u8`;
//   const storage = this.firebaseService.getStorageInstance();
//   const bucket = storage.bucket('vite-admin-5a901.appspot.com');
//   const fileUpload = bucket.file(masterPlaylistFileName);

//   const downloadUrl = await getDownloadURL(fileUpload);
//   // https:firebasestorage.googleapis.com/v0/b/vite-admin-5a901.appspot.com/o/movie_mp4_master.m3u8?alt=media&token=375b1b19-5bf7-4003-81e2-f086a41957e3

//   if (downloadUrl) {
//     console.log('👌  downloadUrl:', downloadUrl);
//     return downloadUrl;
//   } else {
//     return null;
//   }
// }
