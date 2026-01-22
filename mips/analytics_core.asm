# ============================================================================
# Lynx BI Analytics Core - MIPS Assembly
# High-performance columnar analytics engine
# ============================================================================

.data
    # ========== Data Storage (Columnar Layout) ==========
    row_count:      .word 0
    col_count:      .word 0
    col_offsets:    .space 256          # Up to 64 columns (4 bytes each)
    data_buffer:    .space 4000000      # 1M floats max (4MB)
    
    # ========== Aggregation Results ==========
    agg_sum:        .float 0.0
    agg_count:      .word 0
    agg_min:        .float 3.4028235e+38
    agg_max:        .float -3.4028235e+38
    agg_avg:        .float 0.0
    agg_variance:   .float 0.0
    agg_stddev:     .float 0.0
    
    # ========== Group By Storage ==========
    group_keys:     .space 40000        # Group key storage
    group_counts:   .space 10000        # Count per group
    group_sums:     .space 40000        # Sum per group (float)
    num_groups:     .word 0
    max_groups:     .word 1000
    
    # ========== Filter Masks ==========
    filter_mask:    .space 250000       # Bit mask for filtered rows
    filtered_count: .word 0
    
    # ========== Histogram ==========
    hist_bins:      .space 400          # 100 bins max
    hist_min:       .float 0.0
    hist_max:       .float 0.0
    hist_width:     .float 0.0
    num_bins:       .word 10
    
    # ========== KPI Thresholds ==========
    kpi_target:     .float 0.0
    kpi_yellow:     .float 0.0
    kpi_red:        .float 0.0
    kpi_status:     .word 0             # 0=green, 1=yellow, 2=red
    
    # ========== Time Intelligence ==========
    time_window:    .word 3
    rolling_results:.space 40000
    
    # ========== Output Strings ==========
    str_measure:    .asciiz "MEASURE="
    str_value:      .asciiz " VALUE="
    str_kpi:        .asciiz "KPI="
    str_green:      .asciiz "GREEN"
    str_yellow:     .asciiz "YELLOW"
    str_red:        .asciiz "RED"
    str_hist:       .asciiz "HISTOGRAM="
    str_group:      .asciiz "GROUP="
    str_newline:    .asciiz "\n"
    str_comma:      .asciiz ","
    str_sum:        .asciiz "SUM"
    str_count:      .asciiz "COUNT"
    str_avg:        .asciiz "AVG"
    str_min:        .asciiz "MIN"
    str_max:        .asciiz "MAX"
    str_var:        .asciiz "VARIANCE"
    str_std:        .asciiz "STDDEV"
    
    # ========== Constants ==========
    float_zero:     .float 0.0
    float_one:      .float 1.0
    float_max:      .float 3.4028235e+38
    float_min:      .float -3.4028235e+38

.text
.globl main
.globl load_column
.globl calc_sum
.globl calc_count
.globl calc_avg
.globl calc_min
.globl calc_max
.globl calc_variance
.globl calc_stddev
.globl apply_filter_eq
.globl apply_filter_range
.globl group_by_single
.globl calc_histogram
.globl calc_percentile
.globl detect_outliers
.globl calc_kpi_status
.globl calc_rolling_avg
.globl output_results

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================
main:
    # Initialize registers
    li $s0, 0               # Current column index
    li $s1, 0               # Operation flags
    
    # Main processing would be driven by parameters
    # For standalone testing, run all aggregations
    
    jal calc_sum
    jal calc_count
    jal calc_avg
    jal calc_min
    jal calc_max
    jal calc_variance
    jal calc_stddev
    jal output_results
    
    # Exit
    li $v0, 10
    syscall

# ============================================================================
# LOAD COLUMN DATA
# Input: $a0 = column index
# Output: $v0 = pointer to column data, $v1 = row count
# ============================================================================
load_column:
    # Save return address
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # Get column offset
    sll $t0, $a0, 2         # column_index * 4
    la $t1, col_offsets
    add $t1, $t1, $t0
    lw $t2, 0($t1)          # Offset to column data
    
    # Calculate pointer
    la $v0, data_buffer
    add $v0, $v0, $t2
    
    # Get row count
    lw $v1, row_count
    
    # Restore and return
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra


# ============================================================================
# SUM AGGREGATION
# Calculates sum of all values in current column
# Uses filter mask if active
# ============================================================================
calc_sum:
    addi $sp, $sp, -8
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    
    la $t0, data_buffer     # Data pointer
    lw $t1, row_count       # Row count
    la $t2, filter_mask     # Filter mask
    
    # Initialize sum to 0
    lwc1 $f0, float_zero
    li $t3, 0               # Row index
    
sum_loop:
    bge $t3, $t1, sum_done
    
    # Check filter mask (optional)
    # srl $t4, $t3, 3       # Byte index
    # andi $t5, $t3, 7      # Bit index
    # add $t4, $t2, $t4
    # lb $t6, 0($t4)
    # srlv $t6, $t6, $t5
    # andi $t6, $t6, 1
    # beqz $t6, sum_skip
    
    # Load and accumulate
    sll $t4, $t3, 2         # Row * 4
    add $t4, $t0, $t4
    lwc1 $f2, 0($t4)
    add.s $f0, $f0, $f2
    
sum_skip:
    addi $t3, $t3, 1
    j sum_loop
    
sum_done:
    swc1 $f0, agg_sum
    
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    addi $sp, $sp, 8
    jr $ra

# ============================================================================
# COUNT AGGREGATION
# Counts non-null values (or filtered rows)
# ============================================================================
calc_count:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    lw $t0, row_count
    lw $t1, filtered_count
    
    # If filter active, use filtered count
    beqz $t1, count_use_total
    move $t0, $t1
    
count_use_total:
    sw $t0, agg_count
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# AVG AGGREGATION
# Calculates average: sum / count
# ============================================================================
calc_avg:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # Get sum
    jal calc_sum
    
    # Get count
    lw $t0, row_count
    beqz $t0, avg_zero
    
    # Convert count to float
    mtc1 $t0, $f2
    cvt.s.w $f2, $f2
    
    # Divide
    lwc1 $f0, agg_sum
    div.s $f0, $f0, $f2
    swc1 $f0, agg_avg
    j avg_done
    
avg_zero:
    lwc1 $f0, float_zero
    swc1 $f0, agg_avg
    
avg_done:
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# MIN AGGREGATION
# Finds minimum value in column
# ============================================================================
calc_min:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    la $t0, data_buffer
    lw $t1, row_count
    beqz $t1, min_done
    
    # Initialize with first value
    lwc1 $f0, 0($t0)
    li $t2, 1
    
min_loop:
    bge $t2, $t1, min_store
    
    sll $t3, $t2, 2
    add $t3, $t0, $t3
    lwc1 $f2, 0($t3)
    
    # Compare: if f2 < f0, update min
    c.lt.s $f2, $f0
    bc1f min_next
    mov.s $f0, $f2
    
min_next:
    addi $t2, $t2, 1
    j min_loop
    
min_store:
    swc1 $f0, agg_min
    
min_done:
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# MAX AGGREGATION
# Finds maximum value in column
# ============================================================================
calc_max:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    la $t0, data_buffer
    lw $t1, row_count
    beqz $t1, max_done
    
    # Initialize with first value
    lwc1 $f0, 0($t0)
    li $t2, 1
    
max_loop:
    bge $t2, $t1, max_store
    
    sll $t3, $t2, 2
    add $t3, $t0, $t3
    lwc1 $f2, 0($t3)
    
    # Compare: if f2 > f0, update max
    c.lt.s $f0, $f2
    bc1f max_next
    mov.s $f0, $f2
    
max_next:
    addi $t2, $t2, 1
    j max_loop
    
max_store:
    swc1 $f0, agg_max
    
max_done:
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# VARIANCE AGGREGATION
# Calculates population variance: Σ(x - μ)² / n
# ============================================================================
calc_variance:
    addi $sp, $sp, -8
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    
    # First calculate mean
    jal calc_avg
    lwc1 $f4, agg_avg       # f4 = mean
    
    la $t0, data_buffer
    lw $t1, row_count
    beqz $t1, var_zero
    
    # Sum of squared differences
    lwc1 $f0, float_zero    # f0 = sum of squares
    li $t2, 0
    
var_loop:
    bge $t2, $t1, var_calc
    
    sll $t3, $t2, 2
    add $t3, $t0, $t3
    lwc1 $f2, 0($t3)        # f2 = x
    
    sub.s $f2, $f2, $f4     # f2 = x - mean
    mul.s $f2, $f2, $f2     # f2 = (x - mean)²
    add.s $f0, $f0, $f2     # sum += (x - mean)²
    
    addi $t2, $t2, 1
    j var_loop
    
var_calc:
    # Divide by n
    mtc1 $t1, $f2
    cvt.s.w $f2, $f2
    div.s $f0, $f0, $f2
    swc1 $f0, agg_variance
    j var_done
    
var_zero:
    lwc1 $f0, float_zero
    swc1 $f0, agg_variance
    
var_done:
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    addi $sp, $sp, 8
    jr $ra

# ============================================================================
# STANDARD DEVIATION
# Calculates sqrt(variance)
# ============================================================================
calc_stddev:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    jal calc_variance
    lwc1 $f0, agg_variance
    sqrt.s $f0, $f0
    swc1 $f0, agg_stddev
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra


# ============================================================================
# EQUALITY FILTER
# Input: $a0 = column offset, $a1 = target value (as int bits)
# Sets filter_mask bits for matching rows
# ============================================================================
apply_filter_eq:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    la $t0, data_buffer
    add $t0, $t0, $a0       # Column start
    lw $t1, row_count
    la $t2, filter_mask
    mtc1 $a1, $f4           # Target value
    
    li $t3, 0               # Row index
    li $t4, 0               # Filtered count
    
filter_eq_loop:
    bge $t3, $t1, filter_eq_done
    
    sll $t5, $t3, 2
    add $t5, $t0, $t5
    lwc1 $f2, 0($t5)
    
    # Compare equality
    c.eq.s $f2, $f4
    bc1f filter_eq_nomatch
    
    # Set bit in mask
    srl $t6, $t3, 3         # Byte index
    andi $t7, $t3, 7        # Bit index
    add $t6, $t2, $t6
    lb $t8, 0($t6)
    li $t9, 1
    sllv $t9, $t9, $t7
    or $t8, $t8, $t9
    sb $t8, 0($t6)
    addi $t4, $t4, 1
    
filter_eq_nomatch:
    addi $t3, $t3, 1
    j filter_eq_loop
    
filter_eq_done:
    sw $t4, filtered_count
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# RANGE FILTER
# Input: $a0 = column offset, $f12 = min, $f14 = max
# Sets filter_mask bits for rows where min <= value <= max
# ============================================================================
apply_filter_range:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    la $t0, data_buffer
    add $t0, $t0, $a0
    lw $t1, row_count
    la $t2, filter_mask
    
    li $t3, 0
    li $t4, 0
    
filter_range_loop:
    bge $t3, $t1, filter_range_done
    
    sll $t5, $t3, 2
    add $t5, $t0, $t5
    lwc1 $f2, 0($t5)
    
    # Check min <= value
    c.lt.s $f2, $f12
    bc1t filter_range_skip
    
    # Check value <= max
    c.lt.s $f14, $f2
    bc1t filter_range_skip
    
    # Set bit
    srl $t6, $t3, 3
    andi $t7, $t3, 7
    add $t6, $t2, $t6
    lb $t8, 0($t6)
    li $t9, 1
    sllv $t9, $t9, $t7
    or $t8, $t8, $t9
    sb $t8, 0($t6)
    addi $t4, $t4, 1
    
filter_range_skip:
    addi $t3, $t3, 1
    j filter_range_loop
    
filter_range_done:
    sw $t4, filtered_count
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# GROUP BY (Single Column)
# Groups data by integer key and calculates sum per group
# Input: $a0 = key column offset, $a1 = value column offset
# ============================================================================
group_by_single:
    addi $sp, $sp, -16
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    sw $s2, 12($sp)
    
    la $s0, data_buffer
    add $s1, $s0, $a0       # Key column
    add $s2, $s0, $a1       # Value column
    lw $t0, row_count
    
    la $t1, group_keys
    la $t2, group_sums
    la $t3, group_counts
    li $t4, 0               # Number of groups
    
    li $t5, 0               # Row index
    
group_loop:
    bge $t5, $t0, group_done
    
    # Get key and value
    sll $t6, $t5, 2
    add $t7, $s1, $t6
    lw $t8, 0($t7)          # Key (as int)
    add $t7, $s2, $t6
    lwc1 $f2, 0($t7)        # Value
    
    # Find or create group
    li $t9, 0               # Group search index
    
find_group:
    bge $t9, $t4, create_group
    
    sll $a2, $t9, 2
    add $a3, $t1, $a2
    lw $v0, 0($a3)
    beq $v0, $t8, update_group
    
    addi $t9, $t9, 1
    j find_group
    
create_group:
    # Add new group
    sll $a2, $t4, 2
    add $a3, $t1, $a2
    sw $t8, 0($a3)          # Store key
    
    add $a3, $t2, $a2
    swc1 $f2, 0($a3)        # Initialize sum
    
    add $a3, $t3, $a2
    li $v0, 1
    sw $v0, 0($a3)          # Initialize count
    
    addi $t4, $t4, 1
    j group_next
    
update_group:
    # Update existing group
    sll $a2, $t9, 2
    add $a3, $t2, $a2
    lwc1 $f4, 0($a3)
    add.s $f4, $f4, $f2
    swc1 $f4, 0($a3)        # Update sum
    
    add $a3, $t3, $a2
    lw $v0, 0($a3)
    addi $v0, $v0, 1
    sw $v0, 0($a3)          # Update count
    
group_next:
    addi $t5, $t5, 1
    j group_loop
    
group_done:
    sw $t4, num_groups
    
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    lw $s2, 12($sp)
    addi $sp, $sp, 16
    jr $ra

# ============================================================================
# HISTOGRAM CALCULATION
# Input: $a0 = column offset, $a1 = number of bins
# ============================================================================
calc_histogram:
    addi $sp, $sp, -12
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    
    sw $a1, num_bins
    
    # First find min/max
    jal calc_min
    jal calc_max
    
    lwc1 $f0, agg_min
    lwc1 $f2, agg_max
    swc1 $f0, hist_min
    swc1 $f2, hist_max
    
    # Calculate bin width
    sub.s $f4, $f2, $f0     # range = max - min
    lw $t0, num_bins
    mtc1 $t0, $f6
    cvt.s.w $f6, $f6
    div.s $f4, $f4, $f6     # width = range / bins
    swc1 $f4, hist_width
    
    # Clear histogram bins
    la $t1, hist_bins
    li $t2, 0
clear_bins:
    bge $t2, $t0, bins_cleared
    sll $t3, $t2, 2
    add $t3, $t1, $t3
    sw $zero, 0($t3)
    addi $t2, $t2, 1
    j clear_bins
    
bins_cleared:
    # Populate bins
    la $s0, data_buffer
    add $s0, $s0, $a0
    lw $s1, row_count
    li $t2, 0
    
hist_loop:
    bge $t2, $s1, hist_done
    
    sll $t3, $t2, 2
    add $t3, $s0, $t3
    lwc1 $f2, 0($t3)        # Value
    
    # Calculate bin index: (value - min) / width
    sub.s $f2, $f2, $f0
    div.s $f2, $f2, $f4
    cvt.w.s $f2, $f2
    mfc1 $t4, $f2           # Bin index
    
    # Clamp to valid range
    bltz $t4, hist_clamp_low
    j hist_check_high
hist_clamp_low:
    li $t4, 0
hist_check_high:
    lw $t5, num_bins
    addi $t5, $t5, -1
    bgt $t4, $t5, hist_clamp_high
    j hist_increment
hist_clamp_high:
    move $t4, $t5
    
hist_increment:
    sll $t5, $t4, 2
    add $t5, $t1, $t5
    lw $t6, 0($t5)
    addi $t6, $t6, 1
    sw $t6, 0($t5)
    
    addi $t2, $t2, 1
    j hist_loop
    
hist_done:
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    addi $sp, $sp, 12
    jr $ra


# ============================================================================
# PERCENTILE CALCULATION
# Input: $a0 = column offset, $a1 = percentile (0-100)
# Output: $f0 = percentile value
# Note: Requires sorted data or uses selection algorithm
# ============================================================================
calc_percentile:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    la $t0, data_buffer
    add $t0, $t0, $a0
    lw $t1, row_count
    
    # Calculate index: (percentile / 100) * count
    mtc1 $a1, $f2
    cvt.s.w $f2, $f2
    li $t2, 100
    mtc1 $t2, $f4
    cvt.s.w $f4, $f4
    div.s $f2, $f2, $f4
    
    mtc1 $t1, $f4
    cvt.s.w $f4, $f4
    mul.s $f2, $f2, $f4
    cvt.w.s $f2, $f2
    mfc1 $t2, $f2           # Index
    
    # Clamp index
    bltz $t2, perc_clamp_low
    j perc_check_high
perc_clamp_low:
    li $t2, 0
perc_check_high:
    blt $t2, $t1, perc_get
    addi $t2, $t1, -1
    
perc_get:
    # For simplicity, return value at index (assumes sorted)
    # Production would use quickselect
    sll $t2, $t2, 2
    add $t2, $t0, $t2
    lwc1 $f0, 0($t2)
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# OUTLIER DETECTION
# Marks values outside mean ± k*stddev
# Input: $a0 = column offset, $f12 = k multiplier
# Output: Updates filter_mask with outlier flags
# ============================================================================
detect_outliers:
    addi $sp, $sp, -8
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    
    # Calculate mean and stddev
    jal calc_avg
    jal calc_stddev
    
    lwc1 $f4, agg_avg       # mean
    lwc1 $f6, agg_stddev    # stddev
    
    # Calculate bounds
    mul.s $f8, $f6, $f12    # k * stddev
    sub.s $f10, $f4, $f8    # lower = mean - k*stddev
    add.s $f14, $f4, $f8    # upper = mean + k*stddev
    
    la $t0, data_buffer
    add $t0, $t0, $a0
    lw $t1, row_count
    la $t2, filter_mask
    
    li $t3, 0
    li $t4, 0               # Outlier count
    
outlier_loop:
    bge $t3, $t1, outlier_done
    
    sll $t5, $t3, 2
    add $t5, $t0, $t5
    lwc1 $f2, 0($t5)
    
    # Check if outlier (value < lower OR value > upper)
    c.lt.s $f2, $f10
    bc1t mark_outlier
    c.lt.s $f14, $f2
    bc1t mark_outlier
    j outlier_next
    
mark_outlier:
    srl $t6, $t3, 3
    andi $t7, $t3, 7
    add $t6, $t2, $t6
    lb $t8, 0($t6)
    li $t9, 1
    sllv $t9, $t9, $t7
    or $t8, $t8, $t9
    sb $t8, 0($t6)
    addi $t4, $t4, 1
    
outlier_next:
    addi $t3, $t3, 1
    j outlier_loop
    
outlier_done:
    sw $t4, filtered_count
    
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    addi $sp, $sp, 8
    jr $ra

# ============================================================================
# KPI STATUS CALCULATION
# Input: $f12 = actual value
# Uses kpi_target, kpi_yellow, kpi_red thresholds
# Output: kpi_status (0=green, 1=yellow, 2=red)
# ============================================================================
calc_kpi_status:
    lwc1 $f2, kpi_red
    c.lt.s $f12, $f2
    bc1t kpi_is_red
    
    lwc1 $f2, kpi_yellow
    c.lt.s $f12, $f2
    bc1t kpi_is_yellow
    
    # Green
    li $t0, 0
    sw $t0, kpi_status
    jr $ra
    
kpi_is_yellow:
    li $t0, 1
    sw $t0, kpi_status
    jr $ra
    
kpi_is_red:
    li $t0, 2
    sw $t0, kpi_status
    jr $ra

# ============================================================================
# ROLLING AVERAGE
# Calculates moving average with specified window
# Input: $a0 = column offset, $a1 = window size
# Output: rolling_results array
# ============================================================================
calc_rolling_avg:
    addi $sp, $sp, -12
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    
    sw $a1, time_window
    la $s0, data_buffer
    add $s0, $s0, $a0
    lw $s1, row_count
    la $t0, rolling_results
    
    # Start from window-1 index
    move $t1, $a1
    addi $t1, $t1, -1       # Start index
    
rolling_loop:
    bge $t1, $s1, rolling_done
    
    # Calculate sum of window
    lwc1 $f0, float_zero
    move $t2, $t1
    sub $t3, $t2, $a1
    addi $t3, $t3, 1        # Window start
    
window_sum:
    bgt $t3, $t2, window_avg
    sll $t4, $t3, 2
    add $t4, $s0, $t4
    lwc1 $f2, 0($t4)
    add.s $f0, $f0, $f2
    addi $t3, $t3, 1
    j window_sum
    
window_avg:
    mtc1 $a1, $f2
    cvt.s.w $f2, $f2
    div.s $f0, $f0, $f2
    
    # Store result
    sub $t4, $t1, $a1
    addi $t4, $t4, 1
    sll $t4, $t4, 2
    add $t4, $t0, $t4
    swc1 $f0, 0($t4)
    
    addi $t1, $t1, 1
    j rolling_loop
    
rolling_done:
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    addi $sp, $sp, 12
    jr $ra

# ============================================================================
# OUTPUT RESULTS
# Prints all aggregation results in structured format
# ============================================================================
output_results:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # Output SUM
    li $v0, 4
    la $a0, str_measure
    syscall
    la $a0, str_sum
    syscall
    la $a0, str_value
    syscall
    li $v0, 2
    lwc1 $f12, agg_sum
    syscall
    li $v0, 4
    la $a0, str_newline
    syscall
    
    # Output COUNT
    li $v0, 4
    la $a0, str_measure
    syscall
    la $a0, str_count
    syscall
    la $a0, str_value
    syscall
    li $v0, 1
    lw $a0, agg_count
    syscall
    li $v0, 4
    la $a0, str_newline
    syscall
    
    # Output AVG
    li $v0, 4
    la $a0, str_measure
    syscall
    la $a0, str_avg
    syscall
    la $a0, str_value
    syscall
    li $v0, 2
    lwc1 $f12, agg_avg
    syscall
    li $v0, 4
    la $a0, str_newline
    syscall
    
    # Output MIN
    li $v0, 4
    la $a0, str_measure
    syscall
    la $a0, str_min
    syscall
    la $a0, str_value
    syscall
    li $v0, 2
    lwc1 $f12, agg_min
    syscall
    li $v0, 4
    la $a0, str_newline
    syscall
    
    # Output MAX
    li $v0, 4
    la $a0, str_measure
    syscall
    la $a0, str_max
    syscall
    la $a0, str_value
    syscall
    li $v0, 2
    lwc1 $f12, agg_max
    syscall
    li $v0, 4
    la $a0, str_newline
    syscall
    
    # Output VARIANCE
    li $v0, 4
    la $a0, str_measure
    syscall
    la $a0, str_var
    syscall
    la $a0, str_value
    syscall
    li $v0, 2
    lwc1 $f12, agg_variance
    syscall
    li $v0, 4
    la $a0, str_newline
    syscall
    
    # Output STDDEV
    li $v0, 4
    la $a0, str_measure
    syscall
    la $a0, str_std
    syscall
    la $a0, str_value
    syscall
    li $v0, 2
    lwc1 $f12, agg_stddev
    syscall
    li $v0, 4
    la $a0, str_newline
    syscall
    
    # Output KPI status
    li $v0, 4
    la $a0, str_kpi
    syscall
    
    lw $t0, kpi_status
    beqz $t0, out_green
    li $t1, 1
    beq $t0, $t1, out_yellow
    la $a0, str_red
    j out_kpi_print
out_yellow:
    la $a0, str_yellow
    j out_kpi_print
out_green:
    la $a0, str_green
out_kpi_print:
    syscall
    la $a0, str_newline
    syscall
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# END OF ANALYTICS CORE
# ============================================================================
