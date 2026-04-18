const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Handle direct upload to Cloudinary using a stream
 * This approach avoids the deprecated 'q' package and uses the modern SDK features.
 */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "luxerent",
        resource_type: "auto",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // End the stream with the file buffer
    uploadStream.end(fileBuffer);
  });
};

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Process the upload directly from memory
    const result = await uploadToCloudinary(req.file.buffer);
    
    // Return the secure URL as the response (maintains compatibility with frontend)
    res.send(result.secure_url);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ 
      message: "Failed to upload image to Cloudinary",
      error: error.message 
    });
  }
});

module.exports = router;
