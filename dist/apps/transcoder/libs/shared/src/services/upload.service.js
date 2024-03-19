"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const imageKit_config_1 = require("../configs/imageKit.config");
let UploadService = class UploadService {
    async getList() {
        try {
            const list = await imageKit_config_1.ImagekitService.listFiles({
                path: '/products',
                skip: 0,
                limit: 10,
            });
            return list;
        }
        catch (error) {
            throw new common_1.HttpException(JSON.stringify(error, null, 2), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async uploadFile(file) {
        const { buffer, originalname } = file;
        try {
            const uploadedFile = await imageKit_config_1.ImagekitService.upload({
                file: buffer.toString('base64'),
                fileName: originalname,
                folder: '/products',
            });
            return uploadedFile;
        }
        catch (error) {
            console.log('👌  error:', error);
            throw new common_1.HttpException(JSON.stringify(error, null, 2), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteFile(fileId) {
        try {
            const deletedFile = await imageKit_config_1.ImagekitService.deleteFile(fileId);
            return deletedFile;
        }
        catch (error) {
            console.log('👌  error:', error);
            throw new common_1.HttpException(JSON.stringify(error, null, 2), common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map