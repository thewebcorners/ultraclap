const multer = require('multer');
const path = require('path');


const storage = multer.memoryStorage(); // keep file in buffer, we'll upload to Cloudinary


const fileFilter = (req, file, cb) => {
const ext = path.extname(file.originalname).toLowerCase();
if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) cb(null, true);
else cb(new Error('Only images are allowed'));
};


const limits = { fileSize: (parseInt(process.env.MAX_UPLOAD_FILE_SIZE_MB || '5') * 1024 * 1024) };


const upload = multer({ storage, fileFilter, limits });


module.exports = upload;