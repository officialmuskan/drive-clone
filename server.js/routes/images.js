const express = require('express');
const multer = require('multer');
const path = require('path');
const streamifier = require("streamifier");
const cloudinary = require("../cloudinary");
const upload = require("../middlewares/multer");

const fs = require('fs');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};



// Upload image
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { name, folderId } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Image name is required' });
    }

    // Verify folder ownership if folderId is provided
    if (folderId) {
      const folder = await Folder.findOne({
        _id: folderId,
        owner: req.user._id
      });
      
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "myapp_images" }, // optional cloudinary folder
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Cloudinary upload failed", error });
        }

        // save reference in DB
        const image = new Image({
          name,
          originalName: req.file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
          size: req.file.size,
          folder: folderId || null,
          owner: req.user._id,
        });

        await image.save();
        res.status(201).json(image);
      }
    );

    // stream buffer -> cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  
  } catch (error) {
    // Clean up uploaded file if database save fails
   res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Search images
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const images = await Image.find({
      owner: req.user._id,
      name: { $regex: q, $options: 'i' }
    }).populate('folder', 'name path').sort({ name: 1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get image by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      owner: req.user._id
    }).populate('folder', 'name path');

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
