import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the uploads folder path
const uploadDir = path.join(process.cwd(), 'uploads');

// Make sure the uploads folder exists, if not create it
fs.mkdirSync(uploadDir, { recursive: true });

// Setup storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save file with current timestamp + original filename
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer upload middleware using the storage settings
const upload = multer({ storage });

// Export the upload middleware to use it in other files
export default upload;
