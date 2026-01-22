const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory dashboard store
const dashboards = new Map();

// Create dashboard
router.post('/', (req, res) => {
  const { name, description, datasetId } = req.body;
  
  const dashboard = {
    id: uuidv4(),
    name: name || 'Untitled Dashboard',
    description: description || '',
    datasetId,
    widgets: [],
    filters: [],
    layout: { columns: 12, rowHeight: 100 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dashboards.set(dashboard.id, dashboard);
  res.json(dashboard);
});

// List dashboards
router.get('/', (req, res) => {
  res.json(Array.from(dashboards.values()));
});

// Get dashboard by ID
router.get('/:id', (req, res) => {
  const dashboard = dashboards.get(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ error: 'Dashboard not found' });
  }
  res.json(dashboard);
});

// Update dashboard
router.put('/:id', (req, res) => {
  const dashboard = dashboards.get(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ error: 'Dashboard not found' });
  }
  
  const updates = req.body;
  Object.assign(dashboard, updates, { updatedAt: new Date().toISOString() });
  dashboards.set(req.params.id, dashboard);
  
  res.json(dashboard);
});

// Delete dashboard
router.delete('/:id', (req, res) => {
  if (!dashboards.delete(req.params.id)) {
    return res.status(404).json({ error: 'Dashboard not found' });
  }
  res.json({ success: true });
});

// Add widget to dashboard
router.post('/:id/widgets', (req, res) => {
  const dashboard = dashboards.get(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ error: 'Dashboard not found' });
  }
  
  // Use provided ID if available, otherwise generate new one
  const widget = {
    id: req.body.id || uuidv4(),
    type: req.body.type || 'chart',
    title: req.body.title || 'New Widget',
    chartType: req.body.chartType || 'bar',
    query: req.body.query || {},
    position: req.body.position || { x: 0, y: 0, w: 4, h: 3 },
    config: req.body.config || {}
  };
  
  // Check for duplicate IDs
  const existingWidget = dashboard.widgets.find(w => w.id === widget.id);
  if (existingWidget) {
    // If duplicate, generate new ID
    widget.id = uuidv4();
  }
  
  dashboard.widgets.push(widget);
  dashboard.updatedAt = new Date().toISOString();
  
  res.json(widget);
});

// Update widget
router.put('/:id/widgets/:widgetId', (req, res) => {
  const dashboard = dashboards.get(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ error: 'Dashboard not found' });
  }
  
  const widgetIdx = dashboard.widgets.findIndex(w => w.id === req.params.widgetId);
  if (widgetIdx === -1) {
    return res.status(404).json({ error: 'Widget not found' });
  }
  
  Object.assign(dashboard.widgets[widgetIdx], req.body);
  dashboard.updatedAt = new Date().toISOString();
  
  res.json(dashboard.widgets[widgetIdx]);
});

// Delete widget
router.delete('/:id/widgets/:widgetId', (req, res) => {
  const dashboard = dashboards.get(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ error: 'Dashboard not found' });
  }
  
  dashboard.widgets = dashboard.widgets.filter(w => w.id !== req.params.widgetId);
  dashboard.updatedAt = new Date().toISOString();
  
  res.json({ success: true });
});

// Add/update dashboard filters (slicers)
router.put('/:id/filters', (req, res) => {
  const dashboard = dashboards.get(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ error: 'Dashboard not found' });
  }
  
  dashboard.filters = req.body.filters || [];
  dashboard.updatedAt = new Date().toISOString();
  
  res.json(dashboard);
});

module.exports = router;
