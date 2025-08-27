const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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

    const image = new Image({
      name,
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      folder: folderId || null,
      owner: req.user._id
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    // Clean up uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
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