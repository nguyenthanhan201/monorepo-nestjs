// https://github.com/imagekit-developer/imagekit-nodejs#file-upload
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ImageKit = require('imagekit');

export const ImagekitService = new ImageKit({
  publicKey: 'public_zZ62g3sXar9KMuVreSTTeuyb/ZM=',
  privateKey: 'private_GGmHeR+R7loVzCrSrDe9o+rLJR0=',
  urlEndpoint: 'https://ik.imagekit.io/ue5qe7gwv',
});
