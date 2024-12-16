// const multer = require('multer')
// const fs = require('fs');
// const path = require('path');
// const uploadDir = path.join(__dirname, 'my-uploads');

// console.log('uploadDir-->', uploadDir)

// // Ensure the upload directory exists
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Define storage with custom filename function
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'middlewares/my-uploads'); // Destination folder for uploads
//     },
//     filename: (req, file, cb) => {
//         // Extract the original file extension
//         const ext = path.extname(file.originalname);

//         // Create a filename that includes the original extension
//         cb(null, `${file.fieldname}-${Date.now()}${ext}`);
//     }
// });

// const upload = multer({ storage: storage })
// module.exports = { upload };


const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../utils/cloudinaryConfig');

const uploadDir = path.join(__dirname, 'my-uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage with custom filename function
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Destination folder for uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto', // Automatically detect file type (image, video, etc.)
    });
    return result.secure_url; // Return the Cloudinary URL
  } catch (err) {
    throw new Error('Cloudinary upload failed: ' + err.message);
  }
};

module.exports = { upload, uploadToCloudinary };

