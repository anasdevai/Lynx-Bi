# MIPS Assembly Procedures Documentation

## Overview

The MIPS analytics core (`mips/analytics_core.asm`) implements all numerical computations for AsmBI. This document details each procedure.

## Data Section

### Storage Areas

| Label | Size | Purpose |
|-------|------|---------|
| `data_buffer` | 4MB | Columnar data storage |
| `filter_mask` | 250KB | Bit mask for filtered rows |
| `group_keys` | 40KB | Group-by key storage |
| `group_sums` | 40KB | Aggregated sums per group |
| `hist_bins` | 400B | Histogram bin counts |
| `rolling_results` | 40KB | Time series results |

### Result Variables

| Label | Type | Description |
|-------|------|-------------|
| `agg_sum` | float | SUM result |
| `agg_count` | word | COUNT result |
| `agg_avg` | float | AVG result |
| `agg_min` | float | MIN result |
| `agg_max` | float | MAX result |
| `agg_variance` | float | VARIANCE result |
| `agg_stddev` | float | STDDEV result |
| `kpi_status` | word | 0=green, 1=yellow, 2=red |

## Procedures

### calc_sum
Calculates sum of all values in the current column.

```asm
# Input: data_buffer contains column data
# Output: agg_sum contains result
# Registers: $f0 = accumulator, $t0-$t4 = loop control
```

**Algorithm:**
1. Initialize $f0 to 0.0
2. Loop through each row
3. Load float value, add to accumulator
4. Store result in agg_sum

### calc_count
Returns the number of rows (or filtered rows if mask active).

```asm
# Input: row_count, filtered_count
# Output: agg_count
```

### calc_avg
Calculates arithmetic mean.

```asm
# Calls: calc_sum
# Formula: avg = sum / count
```

### calc_min / calc_max
Find minimum/maximum values using single-pass scan.

```asm
# Uses: c.lt.s for float comparison
# bc1f/bc1t for conditional branching
```

### calc_variance
Calculates population variance: Σ(x - μ)² / n

```asm
# Two-pass algorithm:
# Pass 1: Calculate mean (calls calc_avg)
# Pass 2: Sum squared differences
```

### calc_stddev
Square root of variance.

```asm
# Uses: sqrt.s instruction
```

### apply_filter_eq
Sets filter mask bits for rows matching a value.

```asm
# Input: $a0 = column offset, $a1 = target value
# Output: filter_mask updated, filtered_count set
```

**Bit manipulation:**
```asm
srl $t6, $t3, 3      # Byte index = row / 8
andi $t7, $t3, 7     # Bit index = row % 8
li $t9, 1
sllv $t9, $t9, $t7   # Create bit mask
or $t8, $t8, $t9     # Set bit
```

### apply_filter_range
Filters rows where min ≤ value ≤ max.

```asm
# Input: $a0 = column offset, $f12 = min, $f14 = max
# Uses: c.lt.s for range checking
```

### group_by_single
Groups data by integer key and calculates sum per group.

```asm
# Input: $a0 = key column offset, $a1 = value column offset
# Output: group_keys[], group_sums[], num_groups
```

**Algorithm:**
1. For each row, extract key and value
2. Search existing groups for matching key
3. If found, update sum; else create new group
4. Store group count in num_groups

### calc_histogram
Computes frequency distribution.

```asm
# Input: $a0 = column offset, $a1 = number of bins
# Output: hist_bins[], hist_min, hist_max, hist_width
```

**Steps:**
1. Find min/max values
2. Calculate bin width = (max - min) / bins
3. For each value, compute bin index
4. Increment bin counter

### calc_percentile
Returns value at given percentile (assumes sorted data).

```asm
# Input: $a0 = column offset, $a1 = percentile (0-100)
# Output: $f0 = percentile value
```

### detect_outliers
Marks values outside mean ± k×stddev.

```asm
# Input: $a0 = column offset, $f12 = k multiplier
# Output: filter_mask with outlier flags
```

### calc_kpi_status
Determines KPI status based on thresholds.

```asm
# Input: $f12 = actual value
# Uses: kpi_target, kpi_yellow, kpi_red
# Output: kpi_status (0=green, 1=yellow, 2=red)
```

### calc_rolling_avg
Computes moving average with specified window.

```asm
# Input: $a0 = column offset, $a1 = window size
# Output: rolling_results[]
```

### output_results
Prints all results in structured format for Node.js parsing.

```asm
# Format:
# MEASURE=SUM VALUE=<float>
# MEASURE=COUNT VALUE=<int>
# ...
# KPI=<status>
```

## Register Conventions

| Register | Usage |
|----------|-------|
| $s0-$s2 | Preserved across calls |
| $t0-$t9 | Temporary, not preserved |
| $f0-$f3 | Float temporaries |
| $f4-$f6 | Float parameters/results |
| $f12, $f14 | Float arguments |
| $a0-$a3 | Integer arguments |
| $v0, $v1 | Return values |
| $ra | Return address |
| $sp | Stack pointer |

## Syscall Reference

| $v0 | Operation |
|-----|-----------|
| 1 | Print integer |
| 2 | Print float |
| 4 | Print string |
| 10 | Exit |
| 13 | Open file |
| 14 | Read file |
| 16 | Close file |
