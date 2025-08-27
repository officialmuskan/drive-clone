const express = require('express');
const Folder = require('../models/Folder');
const Image = require('../models/Image');
const auth = require('../middleware/auth');

const router = express.Router();

// Create folder
router.post('/', auth, async (req, res) => {
  try {
    const { name, parentFolderId } = req.body;
    
    let path = name;
    let parentFolder = null;
    
    if (parentFolderId) {
      parentFolder = await Folder.findOne({
        _id: parentFolderId,
        owner: req.user._id
      });
      
      if (!parentFolder) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
      
      path = `${parentFolder.path}/${name}`;
    }

    const folder = new Folder({
      name,
      parentFolder: parentFolderId || null,
      owner: req.user._id,
      path
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get folders and images for current folder
router.get('/', auth, async (req, res) => {
  try {
    const { parentFolderId } = req.query;
    
    const folders = await Folder.find({
      owner: req.user._id,
      parentFolder: parentFolderId || null
    }).sort({ name: 1 });

    const images = await Image.find({
      owner: req.user._id,
      folder: parentFolderId || null
    }).sort({ name: 1 });

    res.json({ folders, images });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get folder by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get folder breadcrumb path
router.get('/:id/path', auth, async (req, res) => {
  try {
    const folderId = req.params.id;
    const path = [];
    
    let currentFolder = await Folder.findOne({
      _id: folderId,
      owner: req.user._id
    });

    while (currentFolder) {
      path.unshift({
        id: currentFolder._id,
        name: currentFolder.name
      });
      
      if (currentFolder.parentFolder) {
        currentFolder = await Folder.findOne({
          _id: currentFolder.parentFolder,
          owner: req.user._id
        });
      } else {
        currentFolder = null;
      }
    }

    res.json(path);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;