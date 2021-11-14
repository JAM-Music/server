const multer = require('multer');
const destination = 'images/playlists';
exports.multerDiskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `./public/${destination}`);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
  },
});
exports.destination = destination;
