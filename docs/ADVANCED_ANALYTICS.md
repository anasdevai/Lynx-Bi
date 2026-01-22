# Advanced Analytics Documentation

## Overview

AsmBI includes advanced statistical and analytical functions implemented in both MIPS assembly (`mips/advanced_analytics.asm`) and JavaScript (`backend/src/services/AdvancedAnalytics.js`).

## Available Operations

### Correlation Analysis

**Pearson Correlation Coefficient**
- Measures linear relationship between two variables
- Range: -1 (negative) to +1 (positive)
- Formula: r = Σ(xi-x̄)(yi-ȳ) / sqrt(Σ(xi-x̄)² × Σ(yi-ȳ)²)

```javascript
// API Call
POST /api/query/advanced
{
  "datasetId": "...",
  "operation": "correlation",
  "columns": ["Sales", "Profit"]
}
```

### Linear Regression

**Least Squares Regression**
- Finds best-fit line: Y = slope × X + intercept
- Returns: slope, intercept, R²

```javascript
POST /api/query/advanced
{
  "operation": "regression",
  "columns": ["Quantity", "Revenue"]
}
```

### Moving Averages

**Exponential Moving Average (EMA)**
- Weighted average giving more weight to recent values
- Formula: EMA_t = α × value_t + (1-α) × EMA_{t-1}

**Simple Moving Average (SMA)**
- Unweighted mean of last N values

```javascript
POST /api/query/advanced
{
  "operation": "ema",
  "columns": ["Close"],
  "params": { "alpha": 0.2 }
}
```

### Ranking Functions

| Function | Description |
|----------|-------------|
| RANK | Standard ranking with gaps after ties |
| DENSE_RANK | No gaps after ties |
| PERCENT_RANK | Relative rank as percentage (0-1) |
| NTILE | Divide into N equal buckets |

### Statistical Measures

| Measure | Description |
|---------|-------------|
| Median | Middle value (Q2) |
| Mode | Most frequent value |
| Quartiles | Q1, Q2, Q3, Q4 boundaries |
| IQR | Interquartile range (Q3 - Q1) |
| Skewness | Asymmetry of distribution |
| Kurtosis | Tailedness of distribution |
| CV | Coefficient of variation |

### Growth Analysis

**Period-over-Period Growth**
- Formula: (current - previous) / previous × 100

**CAGR (Compound Annual Growth Rate)**
- Formula: (end/start)^(1/n) - 1

### Forecasting

**Linear Extrapolation**
- Projects future values based on average change
- Simple but effective for trending data

### Normalization

**Z-Score**
- Standardizes to mean=0, std=1
- Formula: z = (x - μ) / σ

**Min-Max**
- Scales to range [0, 1]
- Formula: (x - min) / (max - min)

## MIPS Implementation

### Register Usage

| Register | Purpose |
|----------|---------|
| $f0-$f3 | Temporary floats |
| $f4-$f6 | Intermediate results |
| $f12, $f14 | Function parameters |
| $f20, $f22 | Preserved across calls |
| $s0-$s4 | Preserved integers |

### Key Procedures

```asm
calc_correlation:    # Pearson correlation
calc_linear_regression:  # Least squares
calc_ema:           # Exponential moving average
calc_cumsum:        # Cumulative sum
calc_rank:          # Standard ranking
calc_dense_rank:    # Dense ranking
calc_percent_rank:  # Percentile ranking
calc_ntile:         # N-tile bucketing
calc_quartiles:     # Q1, Q2, Q3, Q4
calc_median:        # Median (Q2)
calc_growth_rate:   # Period growth
calc_compound_growth: # CAGR
calc_forecast:      # Linear forecast
```

## API Reference

### Correlation Matrix

```
GET /api/query/correlation-matrix/:datasetId
```

Returns NxN matrix of correlations between all numeric columns.

### Column Description

```
GET /api/query/describe/:datasetId/:column
```

Returns comprehensive statistics:
- count, sum, mean, std
- min, q1, median, q3, max
- skewness, kurtosis

### Advanced Operations

```
POST /api/query/advanced
{
  "datasetId": "string",
  "operation": "string",
  "columns": ["string"],
  "params": { ... }
}
```

## Performance Notes

- MIPS procedures use O(n) or O(n²) algorithms
- JavaScript fallback provides identical results
- Large datasets (>100K rows) may benefit from MIPS execution
- Correlation matrix is O(n × m²) where m = number of columns
