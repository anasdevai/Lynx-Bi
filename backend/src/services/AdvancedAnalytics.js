/**
 * Advanced Analytics Service
 * JavaScript implementation of advanced BI analytics
 * Mirrors MIPS advanced_analytics.asm functionality
 */

class AdvancedAnalytics {
  /**
   * Pearson Correlation Coefficient
   * @param {number[]} x - First variable array
   * @param {number[]} y - Second variable array
   * @returns {number} Correlation coefficient (-1 to 1)
   */
  correlation(x, y) {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    
    let sumXY = 0, sumXX = 0, sumYY = 0;
    
    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      sumXY += dx * dy;
      sumXX += dx * dx;
      sumYY += dy * dy;
    }
    
    const denominator = Math.sqrt(sumXX * sumYY);
    return denominator === 0 ? 0 : sumXY / denominator;
  }

  /**
   * Linear Regression (Least Squares)
   * @param {number[]} x - Independent variable
   * @param {number[]} y - Dependent variable
   * @returns {{slope: number, intercept: number, rSquared: number}}
   */
  linearRegression(x, y) {
    if (x.length !== y.length || x.length === 0) {
      return { slope: 0, intercept: 0, rSquared: 0 };
    }
    
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXX += x[i] * x[i];
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const r = this.correlation(x, y);
    
    return { slope, intercept, rSquared: r * r };
  }

  /**
   * Exponential Moving Average
   * @param {number[]} values - Data array
   * @param {number} alpha - Smoothing factor (0-1)
   * @returns {number[]} EMA values
   */
  ema(values, alpha = 0.2) {
    if (values.length === 0) return [];
    
    const result = [values[0]];
    for (let i = 1; i < values.length; i++) {
      result.push(alpha * values[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
  }

  /**
   * Simple Moving Average
   * @param {number[]} values - Data array
   * @param {number} window - Window size
   * @returns {number[]} SMA values
   */
  sma(values, window) {
    const result = [];
    for (let i = window - 1; i < values.length; i++) {
      const windowValues = values.slice(i - window + 1, i + 1);
      result.push(windowValues.reduce((a, b) => a + b, 0) / window);
    }
    return result;
  }

  /**
   * Cumulative Sum
   * @param {number[]} values - Data array
   * @returns {number[]} Cumulative sums
   */
  cumsum(values) {
    const result = [];
    let sum = 0;
    for (const v of values) {
      sum += v;
      result.push(sum);
    }
    return result;
  }

  /**
   * Cumulative Product
   * @param {number[]} values - Data array
   * @returns {number[]} Cumulative products
   */
  cumprod(values) {
    const result = [];
    let prod = 1;
    for (const v of values) {
      prod *= v;
      result.push(prod);
    }
    return result;
  }

  /**
   * Rank values (with ties getting same rank)
   * @param {number[]} values - Data array
   * @returns {number[]} Ranks (1-based)
   */
  rank(values) {
    const indexed = values.map((v, i) => ({ value: v, index: i }));
    indexed.sort((a, b) => a.value - b.value);
    
    const ranks = new Array(values.length);
    let currentRank = 1;
    
    for (let i = 0; i < indexed.length; i++) {
      if (i > 0 && indexed[i].value !== indexed[i - 1].value) {
        currentRank = i + 1;
      }
      ranks[indexed[i].index] = currentRank;
    }
    
    return ranks;
  }

  /**
   * Dense Rank (no gaps after ties)
   * @param {number[]} values - Data array
   * @returns {number[]} Dense ranks
   */
  denseRank(values) {
    const indexed = values.map((v, i) => ({ value: v, index: i }));
    indexed.sort((a, b) => a.value - b.value);
    
    const ranks = new Array(values.length);
    let currentRank = 1;
    
    for (let i = 0; i < indexed.length; i++) {
      if (i > 0 && indexed[i].value !== indexed[i - 1].value) {
        currentRank++;
      }
      ranks[indexed[i].index] = currentRank;
    }
    
    return ranks;
  }

  /**
   * Percent Rank
   * @param {number[]} values - Data array
   * @returns {number[]} Percent ranks (0 to 1)
   */
  percentRank(values) {
    const ranks = this.rank(values);
    const n = values.length;
    return ranks.map(r => (r - 1) / (n - 1));
  }

  /**
   * NTILE - Divide into N equal buckets
   * @param {number[]} values - Data array
   * @param {number} n - Number of tiles
   * @returns {number[]} Tile assignments (1 to n)
   */
  ntile(values, n) {
    const ranks = this.rank(values);
    const rowsPerTile = Math.ceil(values.length / n);
    return ranks.map(r => Math.min(Math.ceil(r / rowsPerTile), n));
  }

  /**
   * Calculate Quartiles
   * @param {number[]} values - Data array
   * @returns {{q1: number, q2: number, q3: number, min: number, max: number}}
   */
  quartiles(values) {
    const sorted = [...values].sort((a, b) => a - b);
    return {
      min: sorted[0],
      q1: this.percentile(sorted, 25),
      q2: this.percentile(sorted, 50),
      q3: this.percentile(sorted, 75),
      max: sorted[sorted.length - 1]
    };
  }

  /**
   * Calculate Percentile
   * @param {number[]} values - Sorted data array
   * @param {number} p - Percentile (0-100)
   * @returns {number} Percentile value
   */
  percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b);
    const idx = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
  }

  /**
   * Calculate Median
   * @param {number[]} values - Data array
   * @returns {number} Median value
   */
  median(values) {
    return this.percentile(values, 50);
  }

  /**
   * Calculate Mode (most frequent value)
   * @param {number[]} values - Data array
   * @returns {number} Mode value
   */
  mode(values) {
    const counts = new Map();
    let maxCount = 0;
    let mode = values[0];
    
    for (const v of values) {
      const count = (counts.get(v) || 0) + 1;
      counts.set(v, count);
      if (count > maxCount) {
        maxCount = count;
        mode = v;
      }
    }
    
    return mode;
  }

  /**
   * Growth Rate (period over period)
   * @param {number[]} values - Data array
   * @returns {number[]} Growth rates as percentages
   */
  growthRate(values) {
    const result = [0]; // First value has no growth
    for (let i = 1; i < values.length; i++) {
      const prev = values[i - 1];
      const curr = values[i];
      result.push(prev === 0 ? 0 : ((curr - prev) / prev) * 100);
    }
    return result;
  }

  /**
   * Compound Annual Growth Rate (CAGR)
   * @param {number} startValue - Beginning value
   * @param {number} endValue - Ending value
   * @param {number} periods - Number of periods
   * @returns {number} CAGR as percentage
   */
  cagr(startValue, endValue, periods) {
    if (startValue <= 0 || periods <= 0) return 0;
    return (Math.pow(endValue / startValue, 1 / periods) - 1) * 100;
  }

  /**
   * Simple Forecast (Linear Extrapolation)
   * @param {number[]} values - Historical data
   * @param {number} periods - Periods to forecast
   * @returns {number[]} Forecasted values
   */
  forecast(values, periods) {
    if (values.length < 2) return [];
    
    // Calculate average change
    let totalChange = 0;
    for (let i = 1; i < values.length; i++) {
      totalChange += values[i] - values[i - 1];
    }
    const avgChange = totalChange / (values.length - 1);
    
    // Generate forecasts
    const result = [];
    let lastValue = values[values.length - 1];
    for (let i = 0; i < periods; i++) {
      lastValue += avgChange;
      result.push(lastValue);
    }
    
    return result;
  }

  /**
   * Detect Seasonality Pattern
   * @param {number[]} values - Time series data
   * @param {number} period - Expected period (e.g., 12 for monthly)
   * @returns {number[]} Seasonal indices
   */
  seasonality(values, period) {
    const indices = new Array(period).fill(0);
    const counts = new Array(period).fill(0);
    
    // Calculate average for each period position
    for (let i = 0; i < values.length; i++) {
      const pos = i % period;
      indices[pos] += values[i];
      counts[pos]++;
    }
    
    // Normalize
    const overallAvg = values.reduce((a, b) => a + b, 0) / values.length;
    return indices.map((sum, i) => {
      const periodAvg = sum / counts[i];
      return periodAvg / overallAvg;
    });
  }

  /**
   * Z-Score Normalization
   * @param {number[]} values - Data array
   * @returns {number[]} Z-scores
   */
  zScore(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev === 0 ? values.map(() => 0) : values.map(v => (v - mean) / stdDev);
  }

  /**
   * Min-Max Normalization
   * @param {number[]} values - Data array
   * @returns {number[]} Normalized values (0 to 1)
   */
  minMaxNormalize(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    return range === 0 ? values.map(() => 0.5) : values.map(v => (v - min) / range);
  }

  /**
   * Interquartile Range
   * @param {number[]} values - Data array
   * @returns {number} IQR
   */
  iqr(values) {
    const q = this.quartiles(values);
    return q.q3 - q.q1;
  }

  /**
   * Coefficient of Variation
   * @param {number[]} values - Data array
   * @returns {number} CV as percentage
   */
  coefficientOfVariation(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return mean === 0 ? 0 : (stdDev / mean) * 100;
  }

  /**
   * Skewness
   * @param {number[]} values - Data array
   * @returns {number} Skewness coefficient
   */
  skewness(values) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    
    let m2 = 0, m3 = 0;
    for (const v of values) {
      const d = v - mean;
      m2 += d * d;
      m3 += d * d * d;
    }
    m2 /= n;
    m3 /= n;
    
    const stdDev = Math.sqrt(m2);
    return stdDev === 0 ? 0 : m3 / Math.pow(stdDev, 3);
  }

  /**
   * Kurtosis
   * @param {number[]} values - Data array
   * @returns {number} Kurtosis coefficient
   */
  kurtosis(values) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    
    let m2 = 0, m4 = 0;
    for (const v of values) {
      const d = v - mean;
      m2 += d * d;
      m4 += d * d * d * d;
    }
    m2 /= n;
    m4 /= n;
    
    return m2 === 0 ? 0 : m4 / (m2 * m2) - 3; // Excess kurtosis
  }
}

module.exports = new AdvancedAnalytics();
