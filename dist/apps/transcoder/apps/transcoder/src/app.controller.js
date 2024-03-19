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
exports.AppController = void 0;
const trancoder_service_1 = require("../../../libs/shared/src/services/trancoder.service");
const file_1 = require("../../../libs/shared/src/utils/file");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path = require("path");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService, trancoderService) {
        this.appService = appService;
        this.trancoderService = trancoderService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async transcoder(context) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage);
        const formatMessage = JSON.parse(originalMessage.content.toString());
        const { data: { fileId, url }, } = formatMessage;
        const videoName = `${fileId}.mp4`;
        const pathVideo = path.resolve(videoName);
        console.log("👌  pathVideo:", pathVideo);
        await (0, file_1.getRemoteFile)(`${fileId}.mp4`, url);
        const videoUrl = await this.trancoderService.transcoderProcess({
            mp4FileName: videoName,
            mp4Path: pathVideo,
        });
        return {
            videoUrl,
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "transcoder" }),
    __param(0, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [microservices_1.RmqContext]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "transcoder", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        trancoder_service_1.TrancoderService])
], AppController);
//# sourceMappingURL=app.controller.js.map