"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showProgress = exports.getRemoteFile = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const https = require("https");
async function getRemoteFile(fileName, url) {
    return new Promise((resolve) => {
        https.get(url, function (response) {
            const len = parseInt(response.headers['content-length'] || '', 10);
            let cur = 0;
            const total = len / 1048576;
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
                throw new common_1.HttpException(err.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });
}
exports.getRemoteFile = getRemoteFile;
function showProgress(fileName, cur, len, total) {
    console.log('Downloading ' +
        fileName +
        ' - ' +
        ((100.0 * cur) / len).toFixed(2) +
        '% (' +
        (cur / 1048576).toFixed(2) +
        ' MB) of total size: ' +
        total.toFixed(2) +
        ' MB');
}
exports.showProgress = showProgress;
//# sourceMappingURL=file.js.map