require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const uploadRoutes = require('./routes/upload');
const datasetRoutes = require('./routes/datasets');
const queryRoutes = require('./routes/query');
const dashboardRoutes = require('./routes/dashboards');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/dashboards', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'MIPS Assembly Analytics' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Lynx BI Backend running on http://localhost:${PORT}`);
  console.log('MIPS Analytics Engine initialized');
});
