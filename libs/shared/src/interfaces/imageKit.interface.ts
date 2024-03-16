export interface IUploadResponse {
  fileId: string;
  name: string;
  size: number;
  versionInfo: {
    id: string;
    name: string;
  };
  filePath: string;
  url: string;
  height: number;
  width: number;
  bitRate: number;
  duration: number;
  audioCodec: string;
  videoCodec: string;
  fileType: string;
  AITags: null;
}

// {
//     "fileId": "65f2f72f88c257da337a895e",
//     "name": "movie_PQAqezxlK.mp4",
//     "size": 1057149,
//     "versionInfo": {
//         "id": "65f2f72f88c257da337a895e",
//         "name": "Version 1"
//     },
//     "filePath": "/products/movie_PQAqezxlK.mp4",
//     "url": "https://ik.imagekit.io/ue5qe7gwv/products/movie_PQAqezxlK.mp4",
//     "height": 480,
//     "width": 640,
//     "bitRate": 1066673,
//     "duration": 6,
//     "audioCodec": "aac",
//     "videoCodec": "h264",
//     "fileType": "non-image",
//     "AITags": null
// }
