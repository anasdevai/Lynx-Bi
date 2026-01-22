const express = require('express');
const DatasetStore = require('../services/DatasetStore');
const MIPSEngine = require('../services/MIPSEngine');
const AdvancedAnalytics = require('../services/AdvancedAnalytics');

const router = express.Router();

// Execute BI query
router.post('/execute', async (req, res) => {
  try {
    const { datasetId, query } = req.body;
    
    if (!datasetId) {
      return res.status(400).json({ error: 'Dataset ID required' });
    }
    
    const dataset = DatasetStore.get(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    
    // Execute query through MIPS engine
    const result = await MIPSEngine.executeQuery(query, dataset.data);
    
    res.json({
      success: true,
      datasetId,
      query,
      result,
      executedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available measures for dataset
router.get('/measures/:datasetId', (req, res) => {
  const dataset = DatasetStore.get(req.params.datasetId);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  
  const numericCols = dataset.schema.columns
    .filter(c => c.type === 'integer' || c.type === 'float')
    .map(c => c.name);
  
  const measures = [];
  const aggregations = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX', 'VARIANCE', 'STDDEV'];
  
  for (const col of numericCols) {
    for (const agg of aggregations) {
      measures.push(`${agg}(${col})`);
    }
  }
  
  res.json({ measures, numericColumns: numericCols });
});

// Get available dimensions for grouping
router.get('/dimensions/:datasetId', (req, res) => {
  const dataset = DatasetStore.get(req.params.datasetId);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  
  const dimensions = dataset.schema.columns
    .filter(c => c.type === 'string' || c.type === 'date')
    .map(c => ({ name: c.name, type: c.type }));
  
  res.json({ dimensions });
});

// Preview query results
router.post('/preview', async (req, res) => {
  try {
    const { datasetId, query } = req.body;
    const dataset = DatasetStore.get(datasetId);
    
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    
    // Quick preview with limited data
    const previewData = dataset.data.slice(0, 1000);
    const result = await MIPSEngine.executeQuery(query, previewData);
    
    res.json({ preview: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


// Advanced analytics endpoint
router.post('/advanced', async (req, res) => {
  try {
    const { datasetId, operation, columns, params } = req.body;
    
    const dataset = DatasetStore.get(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    
    // Extract column data
    const getColumnData = (colName) => 
      dataset.data.map(row => parseFloat(row[colName]) || 0);
    
    let result;
    
    switch (operation) {
      case 'correlation':
        const x = getColumnData(columns[0]);
        const y = getColumnData(columns[1]);
        result = { correlation: AdvancedAnalytics.correlation(x, y) };
        break;
        
      case 'regression':
        const xReg = getColumnData(columns[0]);
        const yReg = getColumnData(columns[1]);
        result = AdvancedAnalytics.linearRegression(xReg, yReg);
        break;
        
      case 'ema':
        const emaData = getColumnData(columns[0]);
        result = { ema: AdvancedAnalytics.ema(emaData, params?.alpha || 0.2) };
        break;
        
      case 'sma':
        const smaData = getColumnData(columns[0]);
        result = { sma: AdvancedAnalytics.sma(smaData, params?.window || 3) };
        break;
        
      case 'cumsum':
        const cumsumData = getColumnData(columns[0]);
        result = { cumsum: AdvancedAnalytics.cumsum(cumsumData) };
        break;
        
      case 'rank':
        const rankData = getColumnData(columns[0]);
        result = { 
          rank: AdvancedAnalytics.rank(rankData),
          denseRank: AdvancedAnalytics.denseRank(rankData),
          percentRank: AdvancedAnalytics.percentRank(rankData)
        };
        break;
        
      case 'ntile':
        const ntileData = getColumnData(columns[0]);
        result = { ntile: AdvancedAnalytics.ntile(ntileData, params?.n || 4) };
        break;
        
      case 'quartiles':
        const quartileData = getColumnData(columns[0]);
        result = AdvancedAnalytics.quartiles(quartileData);
        break;
        
      case 'statistics':
        const statsData = getColumnData(columns[0]);
        result = {
          median: AdvancedAnalytics.median(statsData),
          mode: AdvancedAnalytics.mode(statsData),
          skewness: AdvancedAnalytics.skewness(statsData),
          kurtosis: AdvancedAnalytics.kurtosis(statsData),
          iqr: AdvancedAnalytics.iqr(statsData),
          cv: AdvancedAnalytics.coefficientOfVariation(statsData)
        };
        break;
        
      case 'growth':
        const growthData = getColumnData(columns[0]);
        result = { 
          growthRates: AdvancedAnalytics.growthRate(growthData),
          cagr: AdvancedAnalytics.cagr(
            growthData[0], 
            growthData[growthData.length - 1], 
            growthData.length - 1
          )
        };
        break;
        
      case 'forecast':
        const forecastData = getColumnData(columns[0]);
        result = { 
          forecast: AdvancedAnalytics.forecast(forecastData, params?.periods || 5)
        };
        break;
        
      case 'normalize':
        const normData = getColumnData(columns[0]);
        result = {
          zScore: AdvancedAnalytics.zScore(normData),
          minMax: AdvancedAnalytics.minMaxNormalize(normData)
        };
        break;
        
      case 'seasonality':
        const seasonData = getColumnData(columns[0]);
        result = {
          indices: AdvancedAnalytics.seasonality(seasonData, params?.period || 12)
        };
        break;
        
      default:
        return res.status(400).json({ error: `Unknown operation: ${operation}` });
    }
    
    res.json({
      success: true,
      operation,
      columns,
      result
    });
  } catch (error) {
    console.error('Advanced analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get correlation matrix for all numeric columns
router.get('/correlation-matrix/:datasetId', (req, res) => {
  const dataset = DatasetStore.get(req.params.datasetId);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  
  const numericCols = dataset.schema.columns
    .filter(c => c.type === 'integer' || c.type === 'float')
    .map(c => c.name);
  
  const getColumnData = (colName) => 
    dataset.data.map(row => parseFloat(row[colName]) || 0);
  
  const matrix = [];
  for (const col1 of numericCols) {
    const row = [];
    const data1 = getColumnData(col1);
    for (const col2 of numericCols) {
      const data2 = getColumnData(col2);
      row.push(AdvancedAnalytics.correlation(data1, data2));
    }
    matrix.push(row);
  }
  
  res.json({
    columns: numericCols,
    matrix
  });
});

// Get descriptive statistics for a column
router.get('/describe/:datasetId/:column', (req, res) => {
  const dataset = DatasetStore.get(req.params.datasetId);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  
  const values = dataset.data.map(row => parseFloat(row[req.params.column]) || 0);
  const sorted = [...values].sort((a, b) => a - b);
  
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
  
  res.json({
    column: req.params.column,
    count: values.length,
    sum,
    mean,
    std: Math.sqrt(variance),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median: AdvancedAnalytics.median(values),
    q1: AdvancedAnalytics.percentile(sorted, 25),
    q3: AdvancedAnalytics.percentile(sorted, 75),
    skewness: AdvancedAnalytics.skewness(values),
    kurtosis: AdvancedAnalytics.kurtosis(values)
  });
});
