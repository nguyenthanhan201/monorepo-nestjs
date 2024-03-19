"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrancoderService = void 0;
const firebase_service_1 = require("./firebase.service");
const upload_service_1 = require("./upload.service");
const ffmpegExecutable = require("@ffmpeg-installer/ffmpeg");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
ffmpeg.setFfmpegPath(ffmpegExecutable.path);
const resolutions = [
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
];
let TrancoderService = class TrancoderService {
    constructor(firebaseService, uploadService, uploadClient) {
        this.firebaseService = firebaseService;
        this.uploadService = uploadService;
        this.uploadClient = uploadClient;
        this.deleteLocalVideo = async () => {
            console.log("Deleting files in hls folder");
            const directory = path.resolve("hls");
            fs.readdir(directory, (err, files) => {
                if (err)
                    throw err;
                for (const file of files) {
                    fs.unlink(path.join(directory, file), (err) => {
                        if (err)
                            throw err;
                    });
                }
            });
            console.log("Deleted files in hls folder");
        };
        this.deleteLocalUpload = async () => {
            console.log("Deleting files in uploads folder");
            const directory = path.resolve("uploads");
            fs.readdir(directory, (err, files) => {
                if (err)
                    throw err;
                for (const file of files) {
                    fs.unlink(path.join(directory, file), (err) => {
                        if (err)
                            throw err;
                    });
                }
            });
            console.log("Deleted files in uploads folder");
        };
        this.deleteLocalDownloadVideo = async (filePath) => {
            console.log("Deleting  download video");
            fs.unlink(path.resolve(filePath), (err) => {
                if (err)
                    throw new common_1.HttpException(err.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            });
            console.log("Deleted  download video");
        };
    }
    async transcoderProcess({ mp4FileName, mp4Path, }) {
        console.log("Starting script");
        console.log("ffmpegExecutable.path", ffmpegExecutable.path);
        try {
            const variantPlaylists = await this.convert(mp4FileName, mp4Path);
            this.generateMasterPlaylist(variantPlaylists, mp4FileName);
            const videoUrl = await this.upload();
            await this.deleteLocalVideo();
            await this.deleteLocalDownloadVideo(mp4Path);
            console.log("Success");
            return videoUrl;
        }
        catch (error) {
            throw error;
        }
    }
    async convert(mp4FileName, mp4Path) {
        const variantPlaylists = [];
        for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
            console.log(`HLS conversion starting for ${resolution}`);
            const outputFileName = `${mp4FileName.replace(".", "_")}_${resolution}.m3u8`;
            const segmentFileName = `${mp4FileName.replace(".", "_")}_${resolution}_%03d.ts?alt=media`;
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
                    .on("end", (val) => resolve(val))
                    .on("error", (err) => reject(err))
                    .run();
            });
            const variantPlaylist = {
                resolution: resolution,
                outputFileName: outputFileName,
            };
            variantPlaylists.push(variantPlaylist);
            console.log(`HLS conversion done for ${resolution}`);
        }
        return variantPlaylists;
    }
    generateMasterPlaylist(variantPlaylists, mp4FileName) {
        console.log(`HLS master m3u8 playlist generating`);
        let masterPlaylist = variantPlaylists
            .map((variantPlaylist) => {
            const { resolution, outputFileName } = variantPlaylist;
            const bandwidth = resolution === "320x180"
                ? 676800
                : resolution === "854x480"
                    ? 1353600
                    : 3230400;
            return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}?alt=media`;
        })
            .join("\n");
        masterPlaylist = `#EXTM3U\n` + masterPlaylist;
        const masterPlaylistFileName = `${mp4FileName.replace(".", "_")}_master.m3u8`;
        const masterPlaylistPath = `hls/${masterPlaylistFileName}`;
        fs.writeFileSync(masterPlaylistPath, masterPlaylist);
        console.log(`HLS master m3u8 playlist generated`);
        return masterPlaylistFileName;
    }
    async upload() {
        const hlsFolder = path.resolve("hls");
        const storage = this.firebaseService.getStorageInstance();
        const bucket = storage.bucket();
        let videoUrl = "";
        const listUrl = [];
        const files = fs.readdirSync(hlsFolder);
        await Promise.all(files.map(async (file) => {
            const fileName = `${file}`.replace("?alt=media", "");
            const fileUpload = bucket.file(fileName);
            const filePath = path.join(hlsFolder, file);
            const fileStream = fs.readFileSync(filePath);
            const stream = fileUpload.createWriteStream();
            return new Promise((resolve, reject) => {
                stream.on("error", (err) => {
                    reject(err);
                });
                stream.on("finish", () => {
                    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;
                    if (file.includes("master.m3u8"))
                        videoUrl = imageUrl;
                    listUrl.push(imageUrl);
                    resolve(imageUrl);
                });
                stream.end(fileStream);
            });
        }));
        console.log(listUrl);
        return videoUrl;
    }
    async uploadOriginalVideo(file) {
        const uploadVideo = await this.uploadService.uploadFile(file);
        return uploadVideo;
    }
    async deleteOriginalVideo() { }
    async transcoder(file) {
        try {
            const { fileId, url } = await this.uploadOriginalVideo(file);
            const urlTranscoder = this.uploadClient.send({
                cmd: "transcoder",
            }, {
                fileId,
                url,
            });
            console.log("👌  urlTranscoder:", urlTranscoder);
            return urlTranscoder;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TrancoderService = TrancoderService;
exports.TrancoderService = TrancoderService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)("main_queue")),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        upload_service_1.UploadService,
        microservices_1.ClientProxy])
], TrancoderService);
//# sourceMappingURL=trancoder.service.js.map