# AsmBI System Architecture

## Overview

AsmBI implements a three-tier architecture with strict separation of concerns:

1. **Presentation Layer** (Next.js) - UI/UX and query definition
2. **Orchestration Layer** (Node.js) - File handling, query translation, MIPS execution
3. **Computation Layer** (MIPS Assembly) - All numerical analytics

## Data Flow

```
User Upload → Node.js Parser → Schema Inference → Dataset Store
                                                        ↓
User Query → Query Translation → MIPS Program Generation
                                        ↓
                              MIPS Execution (MARS/Fallback)
                                        ↓
                              Result Parsing → JSON Response
                                        ↓
                              Chart Rendering (Frontend)
```

## MIPS Analytics Engine

### Memory Layout (Columnar)

```
┌─────────────────────────────────────────┐
│ Header (8 bytes)                        │
│   - row_count (4 bytes)                 │
│   - col_count (4 bytes)                 │
├─────────────────────────────────────────┤
│ Column Offsets (4 bytes × col_count)    │
├─────────────────────────────────────────┤
│ Column 0 Data (4 bytes × row_count)     │
├─────────────────────────────────────────┤
│ Column 1 Data (4 bytes × row_count)     │
├─────────────────────────────────────────┤
│ ...                                     │
└─────────────────────────────────────────┘
```

### Supported Operations

| Operation | MIPS Procedure | Complexity |
|-----------|---------------|------------|
| SUM | calc_sum | O(n) |
| COUNT | calc_count | O(1) |
| AVG | calc_avg | O(n) |
| MIN | calc_min | O(n) |
| MAX | calc_max | O(n) |
| VARIANCE | calc_variance | O(2n) |
| STDDEV | calc_stddev | O(2n) |
| GROUP BY | group_by_single | O(n×g) |
| FILTER (eq) | apply_filter_eq | O(n) |
| FILTER (range) | apply_filter_range | O(n) |
| HISTOGRAM | calc_histogram | O(n) |
| PERCENTILE | calc_percentile | O(n log n) |
| OUTLIERS | detect_outliers | O(n) |
| ROLLING AVG | calc_rolling_avg | O(n×w) |

### Output Format

MIPS programs output structured text that Node.js parses:

```
MEASURE=<name> VALUE=<float>
KPI=<GREEN|YELLOW|RED>
HISTOGRAM=<bin1>,<bin2>,...
GROUP=<key> MEASURE=<name> VALUE=<float>
```

## Frontend Components

### State Management (Zustand)

```typescript
interface AppState {
  datasets: Dataset[];
  activeDatasetId: string | null;
  globalFilters: Record<string, any>;
  activeDashboardId: string | null;
}
```

### Query Builder

The frontend constructs queries in a Power BI-like JSON format:

```typescript
interface BIQuery {
  filters?: Record<string, any>;
  groupBy?: string[];
  measures?: string[];
  timeIntelligence?: TimeIntelligenceConfig;
  kpis?: KPIConfig[];
  histogram?: HistogramConfig;
}
```

## API Endpoints

### Dataset Management
- `POST /api/upload` - Multipart file upload
- `GET /api/datasets` - List datasets
- `GET /api/datasets/:id` - Get dataset with preview
- `DELETE /api/datasets/:id` - Remove dataset

### Query Execution
- `POST /api/query/execute` - Run analytics query
- `GET /api/query/measures/:id` - Available aggregations
- `GET /api/query/dimensions/:id` - Available grouping columns

### Dashboard CRUD
- Full REST API for dashboard and widget management

## Security Considerations

1. File upload validation (type, size)
2. Query parameter sanitization
3. MIPS program sandboxing (MARS timeout)
4. No direct file system access from frontend

## Performance Optimizations

1. Columnar data layout for cache efficiency
2. Filter mask bitmap for sparse filtering
3. Incremental refresh support
4. Query result caching (future)
