const express = require('express');
const DatasetStore = require('../services/DatasetStore');

const router = express.Router();

// List all datasets
router.get('/', (req, res) => {
  const datasets = DatasetStore.list();
  res.json(datasets.map(d => ({
    id: d.id,
    name: d.name,
    rowCount: d.rowCount,
    columnCount: d.columnCount,
    schema: d.schema,
    createdAt: d.createdAt
  })));
});

// Get dataset by ID
router.get('/:id', (req, res) => {
  const dataset = DatasetStore.get(req.params.id);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  res.json({
    id: dataset.id,
    name: dataset.name,
    schema: dataset.schema,
    rowCount: dataset.rowCount,
    columnCount: dataset.columnCount,
    preview: dataset.data.slice(0, 100)
  });
});

// Get dataset schema
router.get('/:id/schema', (req, res) => {
  const dataset = DatasetStore.get(req.params.id);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  res.json(dataset.schema);
});

// Delete dataset
router.delete('/:id', (req, res) => {
  const success = DatasetStore.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  res.json({ success: true });
});

module.exports = router;
