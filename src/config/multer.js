const multer = require('multer');
const destination = 'images/playlists';
exports.multerDiskStorage = multer.diskStorage({
  destination: 'public/images/playlists',
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
  },
});
exports.destination = destination;
