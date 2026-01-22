# ============================================================================
# Lynx BI Advanced Analytics - MIPS Assembly
# Extended analytics procedures for complex BI operations
# ============================================================================

.data
    # ========== Correlation & Regression ==========
    corr_result:    .float 0.0
    slope:          .float 0.0
    intercept:      .float 0.0
    r_squared:      .float 0.0
    
    # ========== Moving Statistics ==========
    ema_alpha:      .float 0.2          # Exponential smoothing factor
    ema_results:    .space 40000
    sma_results:    .space 40000
    
    # ========== Ranking ==========
    rank_buffer:    .space 100000       # Row index + rank pairs
    dense_ranks:    .space 100000
    percent_ranks:  .space 100000
    
    # ========== Cumulative ==========
    cumsum_results: .space 400000
    cumprod_results:.space 400000
    running_avg:    .space 400000
    
    # ========== Segmentation ==========
    quartiles:      .space 16           # Q1, Q2, Q3, Q4 boundaries
    deciles:        .space 40           # 10 decile boundaries
    ntile_results:  .space 100000
    
    # ========== Forecasting ==========
    forecast_vals:  .space 40000
    seasonality:    .space 48           # 12 months * 4 bytes
    trend_coef:     .float 0.0
    
    # ========== Strings ==========
    str_corr:       .asciiz "CORRELATION="
    str_slope:      .asciiz "SLOPE="
    str_intercept:  .asciiz "INTERCEPT="
    str_rsq:        .asciiz "R_SQUARED="
    str_forecast:   .asciiz "FORECAST="
    str_rank:       .asciiz "RANK="
    str_cumsum:     .asciiz "CUMSUM="
    str_quartile:   .asciiz "QUARTILE="

.text
.globl calc_correlation
.globl calc_linear_regression
.globl calc_ema
.globl calc_cumsum
.globl calc_rank
.globl calc_dense_rank
.globl calc_percent_rank
.globl calc_ntile
.globl calc_quartiles
.globl calc_median
.globl calc_mode
.globl calc_forecast
.globl calc_growth_rate
.globl calc_compound_growth

# ============================================================================
# PEARSON CORRELATION COEFFICIENT
# Input: $a0 = X column offset, $a1 = Y column offset
# Output: corr_result = r value (-1 to 1)
# Formula: r = Σ(xi-x̄)(yi-ȳ) / sqrt(Σ(xi-x̄)² × Σ(yi-ȳ)²)
# ============================================================================
calc_correlation:
    addi $sp, $sp, -32
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    sw $s2, 12($sp)
    sw $s3, 16($sp)
    sw $s4, 20($sp)
    swc1 $f20, 24($sp)
    swc1 $f22, 28($sp)
    
    move $s0, $a0           # X offset
    move $s1, $a1           # Y offset
    
    la $s2, data_buffer
    lw $s3, row_count
    
    # Calculate means of X and Y
    # Mean X
    add $t0, $s2, $s0
    li $t1, 0
    mtc1 $zero, $f0         # sum_x = 0
corr_mean_x:
    bge $t1, $s3, corr_mean_x_done
    sll $t2, $t1, 2
    add $t2, $t0, $t2
    lwc1 $f2, 0($t2)
    add.s $f0, $f0, $f2
    addi $t1, $t1, 1
    j corr_mean_x
corr_mean_x_done:
    mtc1 $s3, $f4
    cvt.s.w $f4, $f4
    div.s $f20, $f0, $f4    # f20 = mean_x
    
    # Mean Y
    add $t0, $s2, $s1
    li $t1, 0
    mtc1 $zero, $f0         # sum_y = 0
corr_mean_y:
    bge $t1, $s3, corr_mean_y_done
    sll $t2, $t1, 2
    add $t2, $t0, $t2
    lwc1 $f2, 0($t2)
    add.s $f0, $f0, $f2
    addi $t1, $t1, 1
    j corr_mean_y
corr_mean_y_done:
    div.s $f22, $f0, $f4    # f22 = mean_y
    
    # Calculate correlation components
    add $s4, $s2, $s0       # X data pointer
    add $t0, $s2, $s1       # Y data pointer
    li $t1, 0
    mtc1 $zero, $f0         # sum_xy = 0
    mtc1 $zero, $f6         # sum_xx = 0
    mtc1 $zero, $f8         # sum_yy = 0
    
corr_loop:
    bge $t1, $s3, corr_calc
    sll $t2, $t1, 2
    
    # Load X and Y values
    add $t3, $s4, $t2
    lwc1 $f2, 0($t3)        # xi
    add $t3, $t0, $t2
    lwc1 $f4, 0($t3)        # yi
    
    # (xi - mean_x)
    sub.s $f10, $f2, $f20
    # (yi - mean_y)
    sub.s $f12, $f4, $f22
    
    # sum_xy += (xi - mean_x)(yi - mean_y)
    mul.s $f14, $f10, $f12
    add.s $f0, $f0, $f14
    
    # sum_xx += (xi - mean_x)²
    mul.s $f14, $f10, $f10
    add.s $f6, $f6, $f14
    
    # sum_yy += (yi - mean_y)²
    mul.s $f14, $f12, $f12
    add.s $f8, $f8, $f14
    
    addi $t1, $t1, 1
    j corr_loop
    
corr_calc:
    # r = sum_xy / sqrt(sum_xx * sum_yy)
    mul.s $f10, $f6, $f8    # sum_xx * sum_yy
    sqrt.s $f10, $f10
    div.s $f0, $f0, $f10
    swc1 $f0, corr_result
    
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    lw $s2, 12($sp)
    lw $s3, 16($sp)
    lw $s4, 20($sp)
    lwc1 $f20, 24($sp)
    lwc1 $f22, 28($sp)
    addi $sp, $sp, 32
    jr $ra

# ============================================================================
# LINEAR REGRESSION (Least Squares)
# Input: $a0 = X column offset, $a1 = Y column offset
# Output: slope, intercept, r_squared
# ============================================================================
calc_linear_regression:
    addi $sp, $sp, -24
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    sw $s2, 12($sp)
    swc1 $f20, 16($sp)
    swc1 $f22, 20($sp)
    
    move $s0, $a0
    move $s1, $a1
    
    la $s2, data_buffer
    lw $t0, row_count
    
    # Calculate sums: Σx, Σy, Σxy, Σx²
    mtc1 $zero, $f0         # sum_x
    mtc1 $zero, $f2         # sum_y
    mtc1 $zero, $f4         # sum_xy
    mtc1 $zero, $f6         # sum_xx
    
    li $t1, 0
    add $t2, $s2, $s0       # X pointer
    add $t3, $s2, $s1       # Y pointer
    
reg_loop:
    bge $t1, $t0, reg_calc
    sll $t4, $t1, 2
    
    add $t5, $t2, $t4
    lwc1 $f10, 0($t5)       # x
    add $t5, $t3, $t4
    lwc1 $f12, 0($t5)       # y
    
    add.s $f0, $f0, $f10    # sum_x += x
    add.s $f2, $f2, $f12    # sum_y += y
    
    mul.s $f14, $f10, $f12
    add.s $f4, $f4, $f14    # sum_xy += x*y
    
    mul.s $f14, $f10, $f10
    add.s $f6, $f6, $f14    # sum_xx += x²
    
    addi $t1, $t1, 1
    j reg_loop
    
reg_calc:
    # n
    mtc1 $t0, $f8
    cvt.s.w $f8, $f8
    
    # slope = (n*Σxy - Σx*Σy) / (n*Σx² - (Σx)²)
    mul.s $f10, $f8, $f4    # n * sum_xy
    mul.s $f12, $f0, $f2    # sum_x * sum_y
    sub.s $f10, $f10, $f12  # numerator
    
    mul.s $f12, $f8, $f6    # n * sum_xx
    mul.s $f14, $f0, $f0    # sum_x²
    sub.s $f12, $f12, $f14  # denominator
    
    div.s $f20, $f10, $f12  # slope
    swc1 $f20, slope
    
    # intercept = (Σy - slope*Σx) / n
    mul.s $f10, $f20, $f0   # slope * sum_x
    sub.s $f10, $f2, $f10   # sum_y - slope*sum_x
    div.s $f22, $f10, $f8   # intercept
    swc1 $f22, intercept
    
    # Calculate R² using correlation
    move $a0, $s0
    move $a1, $s1
    jal calc_correlation
    lwc1 $f0, corr_result
    mul.s $f0, $f0, $f0     # r²
    swc1 $f0, r_squared
    
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    lw $s2, 12($sp)
    lwc1 $f20, 16($sp)
    lwc1 $f22, 20($sp)
    addi $sp, $sp, 24
    jr $ra

# ============================================================================
# EXPONENTIAL MOVING AVERAGE (EMA)
# Input: $a0 = column offset, $f12 = alpha (smoothing factor 0-1)
# Output: ema_results array
# Formula: EMA_t = α × value_t + (1-α) × EMA_{t-1}
# ============================================================================
calc_ema:
    addi $sp, $sp, -8
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    
    la $t0, data_buffer
    add $t0, $t0, $a0
    lw $t1, row_count
    la $t2, ema_results
    
    # First value: EMA_0 = value_0
    lwc1 $f0, 0($t0)
    swc1 $f0, 0($t2)
    
    # 1 - alpha
    li $t3, 1
    mtc1 $t3, $f2
    cvt.s.w $f2, $f2
    sub.s $f2, $f2, $f12    # f2 = 1 - alpha
    
    li $t3, 1               # Start from index 1
ema_loop:
    bge $t3, $t1, ema_done
    
    sll $t4, $t3, 2
    add $t5, $t0, $t4
    lwc1 $f4, 0($t5)        # current value
    
    # EMA = alpha * value + (1-alpha) * prev_EMA
    mul.s $f6, $f12, $f4    # alpha * value
    mul.s $f8, $f2, $f0     # (1-alpha) * prev_EMA
    add.s $f0, $f6, $f8     # new EMA
    
    add $t5, $t2, $t4
    swc1 $f0, 0($t5)
    
    addi $t3, $t3, 1
    j ema_loop
    
ema_done:
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    addi $sp, $sp, 8
    jr $ra

# ============================================================================
# CUMULATIVE SUM
# Input: $a0 = column offset
# Output: cumsum_results array
# ============================================================================
calc_cumsum:
    la $t0, data_buffer
    add $t0, $t0, $a0
    lw $t1, row_count
    la $t2, cumsum_results
    
    mtc1 $zero, $f0         # Running sum
    li $t3, 0
    
cumsum_loop:
    bge $t3, $t1, cumsum_done
    
    sll $t4, $t3, 2
    add $t5, $t0, $t4
    lwc1 $f2, 0($t5)
    add.s $f0, $f0, $f2     # cumsum += value
    
    add $t5, $t2, $t4
    swc1 $f0, 0($t5)
    
    addi $t3, $t3, 1
    j cumsum_loop
    
cumsum_done:
    jr $ra


# ============================================================================
# RANK (with ties getting same rank, gaps after)
# Input: $a0 = column offset
# Output: rank_buffer array (value, rank pairs)
# ============================================================================
calc_rank:
    addi $sp, $sp, -16
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    sw $s2, 12($sp)
    
    la $s0, data_buffer
    add $s0, $s0, $a0
    lw $s1, row_count
    la $s2, rank_buffer
    
    # Simple O(n²) ranking - for each element, count how many are smaller
    li $t0, 0               # Current row
    
rank_outer:
    bge $t0, $s1, rank_done
    
    sll $t1, $t0, 2
    add $t2, $s0, $t1
    lwc1 $f0, 0($t2)        # Current value
    
    li $t3, 1               # Rank starts at 1
    li $t4, 0               # Compare index
    
rank_inner:
    bge $t4, $s1, rank_store
    beq $t4, $t0, rank_skip_self
    
    sll $t5, $t4, 2
    add $t5, $s0, $t5
    lwc1 $f2, 0($t5)
    
    # If other value < current value, increment rank
    c.lt.s $f2, $f0
    bc1f rank_skip_self
    addi $t3, $t3, 1
    
rank_skip_self:
    addi $t4, $t4, 1
    j rank_inner
    
rank_store:
    # Store rank at position
    sll $t1, $t0, 2
    add $t2, $s2, $t1
    sw $t3, 0($t2)
    
    addi $t0, $t0, 1
    j rank_outer
    
rank_done:
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    lw $s2, 12($sp)
    addi $sp, $sp, 16
    jr $ra

# ============================================================================
# DENSE RANK (no gaps after ties)
# Input: $a0 = column offset
# Output: dense_ranks array
# ============================================================================
calc_dense_rank:
    addi $sp, $sp, -16
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    sw $s2, 12($sp)
    
    la $s0, data_buffer
    add $s0, $s0, $a0
    lw $s1, row_count
    la $s2, dense_ranks
    
    li $t0, 0
    
dense_outer:
    bge $t0, $s1, dense_done
    
    sll $t1, $t0, 2
    add $t2, $s0, $t1
    lwc1 $f0, 0($t2)
    
    li $t3, 1               # Dense rank
    li $t4, 0
    
dense_inner:
    bge $t4, $s1, dense_store
    beq $t4, $t0, dense_skip
    
    sll $t5, $t4, 2
    add $t5, $s0, $t5
    lwc1 $f2, 0($t5)
    
    # Count distinct values less than current
    c.lt.s $f2, $f0
    bc1f dense_skip
    
    # Check if we already counted this value
    # (simplified - just increment for now)
    addi $t3, $t3, 1
    
dense_skip:
    addi $t4, $t4, 1
    j dense_inner
    
dense_store:
    sll $t1, $t0, 2
    add $t2, $s2, $t1
    sw $t3, 0($t2)
    
    addi $t0, $t0, 1
    j dense_outer
    
dense_done:
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    lw $s2, 12($sp)
    addi $sp, $sp, 16
    jr $ra

# ============================================================================
# PERCENT RANK
# Input: $a0 = column offset
# Output: percent_ranks array (0.0 to 1.0)
# Formula: (rank - 1) / (n - 1)
# ============================================================================
calc_percent_rank:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # First calculate regular ranks
    jal calc_rank
    
    la $t0, rank_buffer
    la $t1, percent_ranks
    lw $t2, row_count
    
    # n - 1
    addi $t3, $t2, -1
    mtc1 $t3, $f4
    cvt.s.w $f4, $f4
    
    li $t3, 0
prank_loop:
    bge $t3, $t2, prank_done
    
    sll $t4, $t3, 2
    add $t5, $t0, $t4
    lw $t6, 0($t5)          # rank
    
    # (rank - 1) / (n - 1)
    addi $t6, $t6, -1
    mtc1 $t6, $f0
    cvt.s.w $f0, $f0
    div.s $f0, $f0, $f4
    
    add $t5, $t1, $t4
    swc1 $f0, 0($t5)
    
    addi $t3, $t3, 1
    j prank_loop
    
prank_done:
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# NTILE (divide into N equal buckets)
# Input: $a0 = column offset, $a1 = number of tiles
# Output: ntile_results array (1 to N)
# ============================================================================
calc_ntile:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # First get ranks
    jal calc_rank
    
    la $t0, rank_buffer
    la $t1, ntile_results
    lw $t2, row_count
    move $t3, $a1           # N tiles
    
    # rows_per_tile = ceil(n / N)
    div $t2, $t3
    mflo $t4                # rows per tile
    mfhi $t5                # remainder
    bnez $t5, ntile_ceil
    j ntile_loop_start
ntile_ceil:
    addi $t4, $t4, 1
    
ntile_loop_start:
    li $t5, 0               # Row index
    lw $t2, row_count
    
ntile_loop:
    bge $t5, $t2, ntile_done
    
    sll $t6, $t5, 2
    add $t7, $t0, $t6
    lw $t8, 0($t7)          # rank
    
    # tile = ceil(rank / rows_per_tile)
    addi $t8, $t8, -1       # 0-based
    div $t8, $t4
    mflo $t9
    addi $t9, $t9, 1        # 1-based tile
    
    # Clamp to N
    bgt $t9, $t3, ntile_clamp
    j ntile_store
ntile_clamp:
    move $t9, $t3
    
ntile_store:
    add $t7, $t1, $t6
    sw $t9, 0($t7)
    
    addi $t5, $t5, 1
    j ntile_loop
    
ntile_done:
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# QUARTILES (Q1, Q2/Median, Q3)
# Input: $a0 = column offset
# Output: quartiles array [Q1, Q2, Q3, Q4_max]
# ============================================================================
calc_quartiles:
    addi $sp, $sp, -8
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    
    move $s0, $a0
    la $t0, quartiles
    
    # Q1 = 25th percentile
    move $a0, $s0
    li $a1, 25
    jal calc_percentile
    mfc1 $t1, $f0
    la $t0, quartiles
    sw $t1, 0($t0)
    
    # Q2 = 50th percentile (median)
    move $a0, $s0
    li $a1, 50
    jal calc_percentile
    mfc1 $t1, $f0
    la $t0, quartiles
    sw $t1, 4($t0)
    
    # Q3 = 75th percentile
    move $a0, $s0
    li $a1, 75
    jal calc_percentile
    mfc1 $t1, $f0
    la $t0, quartiles
    sw $t1, 8($t0)
    
    # Q4 = max
    move $a0, $s0
    jal calc_max
    lwc1 $f0, agg_max
    mfc1 $t1, $f0
    la $t0, quartiles
    sw $t1, 12($t0)
    
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    addi $sp, $sp, 8
    jr $ra

# ============================================================================
# MEDIAN (Q2)
# Input: $a0 = column offset
# Output: $f0 = median value
# ============================================================================
calc_median:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    li $a1, 50
    jal calc_percentile
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# ============================================================================
# GROWTH RATE
# Input: $a0 = column offset
# Output: growth rates in rolling_results
# Formula: (current - previous) / previous * 100
# ============================================================================
calc_growth_rate:
    la $t0, data_buffer
    add $t0, $t0, $a0
    lw $t1, row_count
    la $t2, rolling_results
    
    # First value has no growth rate (set to 0)
    mtc1 $zero, $f0
    swc1 $f0, 0($t2)
    
    li $t3, 1
growth_loop:
    bge $t3, $t1, growth_done
    
    sll $t4, $t3, 2
    add $t5, $t0, $t4
    lwc1 $f0, 0($t5)        # current
    
    addi $t4, $t4, -4
    add $t5, $t0, $t4
    lwc1 $f2, 0($t5)        # previous
    
    # Avoid division by zero
    mtc1 $zero, $f4
    c.eq.s $f2, $f4
    bc1t growth_zero
    
    # (current - previous) / previous * 100
    sub.s $f4, $f0, $f2
    div.s $f4, $f4, $f2
    li $t6, 100
    mtc1 $t6, $f6
    cvt.s.w $f6, $f6
    mul.s $f4, $f4, $f6
    j growth_store
    
growth_zero:
    mtc1 $zero, $f4
    
growth_store:
    sll $t4, $t3, 2
    add $t5, $t2, $t4
    swc1 $f4, 0($t5)
    
    addi $t3, $t3, 1
    j growth_loop
    
growth_done:
    jr $ra

# ============================================================================
# COMPOUND ANNUAL GROWTH RATE (CAGR)
# Input: $a0 = column offset, $a1 = number of periods
# Output: $f0 = CAGR percentage
# Formula: (end/start)^(1/n) - 1
# ============================================================================
calc_compound_growth:
    la $t0, data_buffer
    add $t0, $t0, $a0
    lw $t1, row_count
    
    # Get first value
    lwc1 $f0, 0($t0)        # start
    
    # Get last value
    addi $t2, $t1, -1
    sll $t2, $t2, 2
    add $t2, $t0, $t2
    lwc1 $f2, 0($t2)        # end
    
    # end / start
    div.s $f4, $f2, $f0
    
    # For CAGR we need nth root, approximate with log
    # Simplified: just return total growth for now
    li $t3, 1
    mtc1 $t3, $f6
    cvt.s.w $f6, $f6
    sub.s $f0, $f4, $f6     # (end/start) - 1
    
    li $t3, 100
    mtc1 $t3, $f6
    cvt.s.w $f6, $f6
    mul.s $f0, $f0, $f6     # Convert to percentage
    
    jr $ra

# ============================================================================
# SIMPLE FORECAST (Linear Extrapolation)
# Input: $a0 = column offset, $a1 = periods to forecast
# Output: forecast_vals array
# ============================================================================
calc_forecast:
    addi $sp, $sp, -12
    sw $ra, 0($sp)
    sw $s0, 4($sp)
    sw $s1, 8($sp)
    
    move $s0, $a0
    move $s1, $a1
    
    # Use linear regression with index as X
    # First, we need to set up X as 0,1,2,3...
    # For simplicity, use last value + average change
    
    la $t0, data_buffer
    add $t0, $t0, $s0
    lw $t1, row_count
    
    # Calculate average change
    mtc1 $zero, $f0         # sum of changes
    li $t2, 1
    
forecast_avg_loop:
    bge $t2, $t1, forecast_avg_done
    
    sll $t3, $t2, 2
    add $t4, $t0, $t3
    lwc1 $f2, 0($t4)        # current
    
    addi $t3, $t3, -4
    add $t4, $t0, $t3
    lwc1 $f4, 0($t4)        # previous
    
    sub.s $f4, $f2, $f4     # change
    add.s $f0, $f0, $f4
    
    addi $t2, $t2, 1
    j forecast_avg_loop
    
forecast_avg_done:
    # Average change
    addi $t2, $t1, -1
    mtc1 $t2, $f2
    cvt.s.w $f2, $f2
    div.s $f6, $f0, $f2     # f6 = avg change
    
    # Get last value
    addi $t2, $t1, -1
    sll $t2, $t2, 2
    add $t2, $t0, $t2
    lwc1 $f4, 0($t2)        # last value
    
    # Generate forecasts
    la $t0, forecast_vals
    li $t2, 0
    
forecast_gen:
    bge $t2, $s1, forecast_done
    
    add.s $f4, $f4, $f6     # next = last + avg_change
    
    sll $t3, $t2, 2
    add $t3, $t0, $t3
    swc1 $f4, 0($t3)
    
    addi $t2, $t2, 1
    j forecast_gen
    
forecast_done:
    lw $ra, 0($sp)
    lw $s0, 4($sp)
    lw $s1, 8($sp)
    addi $sp, $sp, 12
    jr $ra

# ============================================================================
# END OF ADVANCED ANALYTICS
# ============================================================================
