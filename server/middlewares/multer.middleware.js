const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname);
  },
});

const upload = multer({ storage: storage });

const multermiddleware = async (req, res, next) => {
  try {
    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    
    // Ensure the upload was successful
    if (!uploadResult) {
      return res.status(500).json({ message: 'Upload to Cloudinary failed' });
    }
    
    console.log('Upload result:', uploadResult);

    // Only delete the file after successful upload
    await fs.promises.unlink(req.file.path);
    console.log("File deleted successfully from the local filesystem");
    req.uploadResult = uploadResult
    console.log("secure_url is added")
    next();
  } catch (error) {
    console.error('Error during profile image upload:', error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { multermiddleware ,upload};