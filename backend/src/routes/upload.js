const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const DataParser = require('../services/DataParser');
const DatasetStore = require('../services/DatasetStore');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: CSV, Excel, TXT'));
    }
  }
});

// Upload endpoint
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    
    // Parse the file and infer schema
    const parser = new DataParser();
    const { data, schema, preview } = await parser.parse(filePath, originalName);
    
    // Store dataset
    const datasetId = uuidv4();
    const dataset = {
      id: datasetId,
      name: path.basename(originalName, path.extname(originalName)),
      originalName,
      filePath,
      schema,
      rowCount: data.length,
      columnCount: schema.columns.length,
      createdAt: new Date().toISOString(),
      data
    };
    
    DatasetStore.save(datasetId, dataset);
    
    res.json({
      id: datasetId,
      name: dataset.name,
      schema,
      rowCount: dataset.rowCount,
      columnCount: dataset.columnCount,
      preview: preview.slice(0, 100) // First 100 rows for preview
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
