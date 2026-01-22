# Power BI Feature Mapping

This document maps Power BI features to their AsmBI implementations.

## Data Connectivity

| Power BI Feature | AsmBI Implementation | Status |
|-----------------|---------------------|--------|
| Excel Import | DataParser.parseExcel() | ✅ |
| CSV Import | DataParser.parseCSV() | ✅ |
| Text Import | DataParser.parseCSV() | ✅ |
| Auto Schema Detection | DataParser.inferSchema() | ✅ |
| Data Type Inference | DataParser.inferType() | ✅ |

## Data Modeling

| Power BI Feature | AsmBI Implementation | Status |
|-----------------|---------------------|--------|
| Column Types | Schema columns with type | ✅ |
| Measures vs Dimensions | Auto-categorization | ✅ |
| Calculated Columns | Query-time computation | ✅ |
| Data Preview | Dataset preview endpoint | ✅ |

## DAX Functions (Mini-DAX)

### Aggregation Functions

| DAX Function | MIPS Procedure | Status |
|-------------|---------------|--------|
| SUM() | calc_sum | ✅ |
| COUNT() | calc_count | ✅ |
| AVERAGE() | calc_avg | ✅ |
| MIN() | calc_min | ✅ |
| MAX() | calc_max | ✅ |
| VAR.P() | calc_variance | ✅ |
| STDEV.P() | calc_stddev | ✅ |

### Filter Functions

| DAX Function | MIPS Procedure | Status |
|-------------|---------------|--------|
| FILTER (equality) | apply_filter_eq | ✅ |
| FILTER (range) | apply_filter_range | ✅ |
| ALL | Clear filter_mask | ✅ |

### Time Intelligence

| DAX Function | Implementation | Status |
|-------------|---------------|--------|
| DATEADD | calculateMoM/YoY | ✅ |
| SAMEPERIODLASTYEAR | calculateYoY | ✅ |
| TOTALYTD | Time grouping | ✅ |
| Rolling Average | calc_rolling_avg | ✅ |

## Visualizations

| Power BI Visual | AsmBI Component | Status |
|----------------|-----------------|--------|
| Bar Chart | ChartWrapper (bar) | ✅ |
| Line Chart | ChartWrapper (line) | ✅ |
| Pie Chart | ChartWrapper (pie) | ✅ |
| Area Chart | ChartWrapper (area) | ✅ |
| KPI Card | KPICard | ✅ |
| Table | Data Table | ✅ |
| Donut Chart | ChartWrapper (doughnut) | ✅ |

## Dashboard Features

| Power BI Feature | AsmBI Implementation | Status |
|-----------------|---------------------|--------|
| Multiple Widgets | Dashboard widgets array | ✅ |
| Widget Positioning | Position (x, y, w, h) | ✅ |
| Cross-filtering | Global filters | ✅ |
| Slicers | Filter panel | ✅ |
| Drill-down | Hierarchical grouping | ✅ |

## Analytics Features

| Power BI Feature | AsmBI Implementation | Status |
|-----------------|---------------------|--------|
| Histogram | calc_histogram | ✅ |
| Percentiles | calc_percentile | ✅ |
| Outlier Detection | detect_outliers | ✅ |
| Trend Analysis | detectTrend | ✅ |
| KPI Thresholds | calc_kpi_status | ✅ |

## Report Builder

| Power BI Feature | AsmBI Implementation | Status |
|-----------------|---------------------|--------|
| Drag-drop Measures | Measure selection panel | ✅ |
| Drag-drop Dimensions | GroupBy selection | ✅ |
| Filter Panel | Query filters | ✅ |
| Chart Type Selection | Chart type buttons | ✅ |
| Live Preview | Execute query | ✅ |

## Not Implemented (Out of Scope)

- DirectQuery / Live Connection
- R/Python Visuals
- Natural Language Q&A
- Paginated Reports
- Row-Level Security
- Dataflows
- AI Insights

## MIPS vs JavaScript Comparison

| Operation | MIPS Cycles* | JS Time* | Notes |
|-----------|-------------|----------|-------|
| SUM (1M rows) | ~4M | ~5ms | MIPS competitive |
| GROUP BY | ~10M | ~20ms | Hash table overhead |
| VARIANCE | ~8M | ~10ms | Two-pass algorithm |

*Estimated, actual performance depends on hardware/simulator
