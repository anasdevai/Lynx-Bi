# MIPS Assembly Viva Guide - Complete Explanation

## Table of Contents
1. [Introduction](#introduction)
2. [MIPS Basics](#mips-basics)
3. [Registers Explained](#registers-explained)
4. [Instructions & Operators](#instructions--operators)
5. [Analytics Core File Explanation](#analytics-core-file-explanation)
6. [Advanced Analytics File Explanation](#advanced-analytics-file-explanation)
7. [Common Viva Questions](#common-viva-questions)

---

## Introduction

**What is this project?**
Lynx BI is a Business Intelligence tool that uses MIPS assembly language to perform high-speed data analytics. Think of it like Excel or Power BI, but the calculations are done using low-level assembly code for maximum performance.

**Why MIPS Assembly?**
- **Speed**: Assembly code runs directly on the processor, making it extremely fast
- **Control**: We have complete control over memory and calculations
- **Learning**: It demonstrates how high-level analytics operations work at the hardware level

**Two Main Files:**
1. `analytics_core.asm` - Basic analytics (SUM, AVG, MIN, MAX, etc.)
2. `advanced_analytics.asm` - Complex analytics (Correlation, Regression, Forecasting, etc.)

---

## MIPS Basics

### What is MIPS?
MIPS (Microprocessor without Interlocked Pipeline Stages) is a type of computer processor architecture. It's like the "language" the CPU understands.

### Program Structure
Every MIPS program has two main sections:

**1. .data section** - Where we store data
- Like declaring variables in Python or Java
- Stores numbers, text, and arrays
- Example: `row_count: .word 0` means "create a variable called row_count with value 0"

**2. .text section** - Where we write code
- Contains all the instructions (the actual program logic)
- Like the functions/methods in other programming languages

---

## Registers Explained

### What are Registers?
Registers are like super-fast temporary storage boxes inside the CPU. Think of them as variables that live directly in the processor.

### Types of Registers We Use:

#### **Integer Registers ($0 - $31)**

**$zero ($0)** - Always contains 0
- Cannot be changed
- Used for comparisons and initialization

**$v0, $v1** - Return values
- Used to return results from functions
- $v0 also used for system calls (like print, exit)

**$a0 - $a3** - Arguments
- Used to pass parameters to functions
- Like function parameters in other languages
- Example: `move $a0, $t0` means "pass $t0 as first argument"

**$t0 - $t9** - Temporary registers
- Used for quick calculations
- Don't need to be saved
- Like local variables in a function

**$s0 - $s7** - Saved registers
- Used for important values that need to be preserved
- Must be saved before use and restored after
- Like instance variables in a class

**$sp** - Stack Pointer
- Points to the top of the stack (memory for function calls)
- Used to save/restore registers
- Automatically manages function call memory

**$ra** - Return Address
- Stores where to return after a function call
- Like a bookmark in a book


#### **Floating-Point Registers ($f0 - $f31)**

**$f0, $f2, $f4...** - Float registers (even numbers)
- Store decimal numbers (like 3.14, 100.5)
- Used for all our analytics calculations
- Example: `lwc1 $f0, value` loads a float into $f0

**Why even numbers?** 
- MIPS uses pairs for double precision
- We use single precision (32-bit floats)

---

## Instructions & Operators

### Data Movement Instructions

**li (Load Immediate)**
```assembly
li $t0, 100
```
- **What it does**: Puts the number 100 into register $t0
- **Like**: `int t0 = 100;` in C
- **Use**: Initialize counters, set constants

**lw (Load Word)**
```assembly
lw $t0, row_count
```
- **What it does**: Loads a 32-bit integer from memory into $t0
- **Like**: `t0 = row_count;` in C
- **Use**: Read integer variables from memory

**sw (Store Word)**
```assembly
sw $t0, row_count
```
- **What it does**: Saves the value in $t0 to memory location row_count
- **Like**: `row_count = t0;` in C
- **Use**: Save calculation results

**lwc1 (Load Word Coprocessor 1)**
```assembly
lwc1 $f0, agg_sum
```
- **What it does**: Loads a floating-point number into $f0
- **Like**: `float f0 = agg_sum;` in C
- **Use**: Read decimal numbers for calculations

**swc1 (Store Word Coprocessor 1)**
```assembly
swc1 $f0, agg_sum
```
- **What it does**: Saves float from $f0 to memory
- **Like**: `agg_sum = f0;` in C
- **Use**: Save float calculation results


**la (Load Address)**
```assembly
la $t0, data_buffer
```
- **What it does**: Loads the memory address (location) of data_buffer into $t0
- **Like**: `int* t0 = &data_buffer;` in C (pointer)
- **Use**: Access arrays and data structures

**move**
```assembly
move $t1, $t0
```
- **What it does**: Copies value from $t0 to $t1
- **Like**: `t1 = t0;` in C
- **Use**: Transfer data between registers

### Arithmetic Instructions (Integer)

**add**
```assembly
add $t0, $t1, $t2
```
- **What it does**: $t0 = $t1 + $t2
- **Like**: `t0 = t1 + t2;` in C
- **Use**: Add two numbers

**addi (Add Immediate)**
```assembly
addi $t0, $t0, 1
```
- **What it does**: $t0 = $t0 + 1
- **Like**: `t0++;` or `t0 = t0 + 1;` in C
- **Use**: Increment counters, adjust values

**sub**
```assembly
sub $t0, $t1, $t2
```
- **What it does**: $t0 = $t1 - $t2
- **Like**: `t0 = t1 - t2;` in C
- **Use**: Subtract numbers

**mul**
```assembly
mul $t0, $t1, $t2
```
- **What it does**: $t0 = $t1 × $t2
- **Like**: `t0 = t1 * t2;` in C
- **Use**: Multiply numbers

**div**
```assembly
div $t1, $t2
```
- **What it does**: Divides $t1 by $t2, result in special registers
- **mflo**: Gets quotient (result)
- **mfhi**: Gets remainder
- **Like**: `result = t1 / t2; remainder = t1 % t2;` in C


### Arithmetic Instructions (Floating-Point)

**add.s (Add Single)**
```assembly
add.s $f0, $f2, $f4
```
- **What it does**: $f0 = $f2 + $f4 (float addition)
- **Like**: `float f0 = f2 + f4;` in C
- **Use**: Add decimal numbers

**sub.s (Subtract Single)**
```assembly
sub.s $f0, $f2, $f4
```
- **What it does**: $f0 = $f2 - $f4
- **Like**: `float f0 = f2 - f4;` in C
- **Use**: Subtract decimals

**mul.s (Multiply Single)**
```assembly
mul.s $f0, $f2, $f4
```
- **What it does**: $f0 = $f2 × $f4
- **Like**: `float f0 = f2 * f4;` in C
- **Use**: Multiply decimals

**div.s (Divide Single)**
```assembly
div.s $f0, $f2, $f4
```
- **What it does**: $f0 = $f2 ÷ $f4
- **Like**: `float f0 = f2 / f4;` in C
- **Use**: Divide decimals (for averages, percentages)

**sqrt.s (Square Root Single)**
```assembly
sqrt.s $f0, $f2
```
- **What it does**: $f0 = √$f2
- **Like**: `float f0 = sqrt(f2);` in C
- **Use**: Calculate standard deviation

**mov.s (Move Single)**
```assembly
mov.s $f0, $f2
```
- **What it does**: Copies float from $f2 to $f0
- **Like**: `float f0 = f2;` in C
- **Use**: Transfer float values

### Conversion Instructions

**cvt.s.w (Convert to Single from Word)**
```assembly
cvt.s.w $f0, $f2
```
- **What it does**: Converts integer in $f2 to float in $f0
- **Like**: `float f0 = (float)f2;` in C
- **Use**: Convert count to float for division


**cvt.w.s (Convert to Word from Single)**
```assembly
cvt.w.s $f0, $f2
```
- **What it does**: Converts float in $f2 to integer in $f0
- **Like**: `int f0 = (int)f2;` in C
- **Use**: Convert percentile to index

**mtc1 (Move To Coprocessor 1)**
```assembly
mtc1 $t0, $f0
```
- **What it does**: Moves integer from $t0 to float register $f0 (as bits, not converted)
- **Use**: Prepare for conversion with cvt.s.w

**mfc1 (Move From Coprocessor 1)**
```assembly
mfc1 $t0, $f0
```
- **What it does**: Moves from float register $f0 to integer register $t0
- **Use**: Extract converted integer

### Comparison Instructions (Float)

**c.eq.s (Compare Equal Single)**
```assembly
c.eq.s $f0, $f2
```
- **What it does**: Checks if $f0 == $f2
- **Sets a flag** that can be tested
- **Like**: `if (f0 == f2)` in C

**c.lt.s (Compare Less Than Single)**
```assembly
c.lt.s $f0, $f2
```
- **What it does**: Checks if $f0 < $f2
- **Like**: `if (f0 < f2)` in C
- **Use**: Find min/max values

**bc1t (Branch Coprocessor 1 True)**
```assembly
bc1t label
```
- **What it does**: Jumps to label if last float comparison was TRUE
- **Like**: `if (condition) goto label;` in C
- **Use**: After c.lt.s or c.eq.s

**bc1f (Branch Coprocessor 1 False)**
```assembly
bc1f label
```
- **What it does**: Jumps to label if last float comparison was FALSE
- **Use**: Opposite of bc1t

### Branch Instructions (Integer)

**beq (Branch if Equal)**
```assembly
beq $t0, $t1, label
```
- **What it does**: If $t0 == $t1, jump to label
- **Like**: `if (t0 == t1) goto label;` in C


**bne (Branch if Not Equal)**
```assembly
bne $t0, $t1, label
```
- **What it does**: If $t0 != $t1, jump to label
- **Like**: `if (t0 != t1) goto label;` in C

**bge (Branch if Greater or Equal)**
```assembly
bge $t0, $t1, label
```
- **What it does**: If $t0 >= $t1, jump to label
- **Like**: `if (t0 >= t1) goto label;` in C
- **Use**: Loop exit conditions

**bgt (Branch if Greater Than)**
```assembly
bgt $t0, $t1, label
```
- **What it does**: If $t0 > $t1, jump to label
- **Like**: `if (t0 > t1) goto label;` in C

**blt (Branch if Less Than)**
```assembly
blt $t0, $t1, label
```
- **What it does**: If $t0 < $t1, jump to label
- **Like**: `if (t0 < t1) goto label;` in C

**beqz (Branch if Equal Zero)**
```assembly
beqz $t0, label
```
- **What it does**: If $t0 == 0, jump to label
- **Like**: `if (t0 == 0) goto label;` in C
- **Use**: Check for null/empty

**bnez (Branch if Not Equal Zero)**
```assembly
bnez $t0, label
```
- **What it does**: If $t0 != 0, jump to label
- **Like**: `if (t0 != 0) goto label;` in C

### Jump Instructions

**j (Jump)**
```assembly
j label
```
- **What it does**: Unconditionally jumps to label
- **Like**: `goto label;` in C
- **Use**: Loop back, skip code

**jal (Jump and Link)**
```assembly
jal function_name
```
- **What it does**: Calls a function, saves return address in $ra
- **Like**: `function_name();` in C
- **Use**: Call subroutines


**jr (Jump Register)**
```assembly
jr $ra
```
- **What it does**: Returns from function (jumps to address in $ra)
- **Like**: `return;` in C
- **Use**: End of every function

### Bitwise & Shift Instructions

**sll (Shift Left Logical)**
```assembly
sll $t0, $t1, 2
```
- **What it does**: $t0 = $t1 << 2 (multiply by 4)
- **Like**: `t0 = t1 * 4;` in C
- **Use**: Calculate array offsets (index × 4 for word size)
- **Example**: `sll $t0, $t3, 2` means multiply index by 4 to get byte offset

**srl (Shift Right Logical)**
```assembly
srl $t0, $t1, 3
```
- **What it does**: $t0 = $t1 >> 3 (divide by 8)
- **Like**: `t0 = t1 / 8;` in C
- **Use**: Calculate byte index from bit index

**sllv (Shift Left Logical Variable)**
```assembly
sllv $t0, $t1, $t2
```
- **What it does**: $t0 = $t1 << $t2 (shift by variable amount)
- **Use**: Bit manipulation

**srlv (Shift Right Logical Variable)**
```assembly
srlv $t0, $t1, $t2
```
- **What it does**: $t0 = $t1 >> $t2
- **Use**: Variable bit shifts

**and**
```assembly
and $t0, $t1, $t2
```
- **What it does**: $t0 = $t1 & $t2 (bitwise AND)
- **Use**: Mask bits

**andi (AND Immediate)**
```assembly
andi $t0, $t1, 7
```
- **What it does**: $t0 = $t1 & 7
- **Like**: `t0 = t1 % 8;` (when using power of 2)
- **Use**: Get bit position within byte

**or**
```assembly
or $t0, $t1, $t2
```
- **What it does**: $t0 = $t1 | $t2 (bitwise OR)
- **Use**: Set bits in mask


**lb (Load Byte)**
```assembly
lb $t0, 0($t1)
```
- **What it does**: Loads 1 byte from memory address in $t1
- **Use**: Read filter mask bits

**sb (Store Byte)**
```assembly
sb $t0, 0($t1)
```
- **What it does**: Stores 1 byte to memory
- **Use**: Write filter mask bits

### Stack Operations

**addi $sp, $sp, -4**
```assembly
addi $sp, $sp, -4
sw $ra, 0($sp)
```
- **What it does**: Allocates space on stack and saves register
- **Like**: Pushing to a stack in other languages
- **Use**: Save registers before function call

**lw $ra, 0($sp)**
```assembly
lw $ra, 0($sp)
addi $sp, $sp, 4
```
- **What it does**: Restores register from stack
- **Like**: Popping from a stack
- **Use**: Restore registers before returning

### System Calls

**syscall**
```assembly
li $v0, 1        # Service 1 = print integer
move $a0, $t0    # Value to print
syscall
```
- **What it does**: Calls operating system service
- **Services**:
  - 1 = Print integer
  - 2 = Print float
  - 4 = Print string
  - 10 = Exit program

---

## Analytics Core File Explanation

### File Purpose
This file contains basic analytics operations like SUM, AVG, MIN, MAX, COUNT, VARIANCE, STDDEV, and filtering operations.

### Data Section Breakdown

**Storage Areas:**
```assembly
row_count:      .word 0          # How many rows of data
col_count:      .word 0          # How many columns
data_buffer:    .space 4000000   # Main data storage (1 million floats)
```
- **Purpose**: Store the dataset in memory
- **Like**: A 2D array in other languages


**Aggregation Results:**
```assembly
agg_sum:        .float 0.0       # Stores SUM result
agg_count:      .word 0          # Stores COUNT result
agg_min:        .float 3.4e+38   # Stores MIN (initialized to max float)
agg_max:        .float -3.4e+38  # Stores MAX (initialized to min float)
agg_avg:        .float 0.0       # Stores AVERAGE result
agg_variance:   .float 0.0       # Stores VARIANCE result
agg_stddev:     .float 0.0       # Stores STANDARD DEVIATION result
```
- **Purpose**: Store calculation results
- **Like**: Global variables for results

**Group By Storage:**
```assembly
group_keys:     .space 40000     # Store unique group values
group_counts:   .space 10000     # Count per group
group_sums:     .space 40000     # Sum per group
num_groups:     .word 0          # How many groups found
```
- **Purpose**: Implement GROUP BY functionality (like SQL)
- **Example**: Group sales by region, sum by category

**Filter Masks:**
```assembly
filter_mask:    .space 250000    # Bit mask for filtering
filtered_count: .word 0          # How many rows passed filter
```
- **Purpose**: Mark which rows match filter conditions
- **Like**: WHERE clause in SQL
- **Bit mask**: Each bit represents one row (1=include, 0=exclude)

### Key Functions Explained

#### 1. calc_sum - Calculate Sum

**What it does**: Adds up all numbers in a column

**Line-by-line explanation:**
```assembly
calc_sum:
    addi $sp, $sp, -8        # Make space on stack
    sw $ra, 0($sp)           # Save return address
    sw $s0, 4($sp)           # Save $s0 register
    
    la $t0, data_buffer      # $t0 = address of data
    lw $t1, row_count        # $t1 = number of rows
    
    lwc1 $f0, float_zero     # $f0 = 0.0 (initialize sum)
    li $t3, 0                # $t3 = 0 (row index)
```
- **Purpose**: Setup - prepare registers and initialize sum to 0

```assembly
sum_loop:
    bge $t3, $t1, sum_done   # If index >= row_count, exit loop
    
    sll $t4, $t3, 2          # $t4 = index * 4 (byte offset)
    add $t4, $t0, $t4        # $t4 = data address + offset
    lwc1 $f2, 0($t4)         # $f2 = load float from memory
    add.s $f0, $f0, $f2      # sum = sum + value
    
    addi $t3, $t3, 1         # index++
    j sum_loop               # Repeat loop
```
- **Purpose**: Loop through all rows, add each value to sum
- **Like**: `for (i=0; i<row_count; i++) sum += data[i];`


```assembly
sum_done:
    swc1 $f0, agg_sum        # Save sum to memory
    
    lw $ra, 0($sp)           # Restore return address
    lw $s0, 4($sp)           # Restore $s0
    addi $sp, $sp, 8         # Free stack space
    jr $ra                   # Return to caller
```
- **Purpose**: Save result and clean up

**Real-world example**: If data = [10.5, 20.3, 15.7], sum = 46.5

#### 2. calc_avg - Calculate Average

**What it does**: Calculates mean (sum ÷ count)

**Key logic:**
```assembly
calc_avg:
    jal calc_sum             # First calculate sum
    
    lw $t0, row_count        # Get count
    beqz $t0, avg_zero       # If count=0, return 0
    
    mtc1 $t0, $f2            # Move count to float register
    cvt.s.w $f2, $f2         # Convert integer to float
    
    lwc1 $f0, agg_sum        # Load sum
    div.s $f0, $f0, $f2      # average = sum / count
    swc1 $f0, agg_avg        # Save result
```
- **Purpose**: Divide sum by count to get average
- **Like**: `average = sum / count;`
- **Special**: Converts integer count to float for division

**Real-world example**: sum=46.5, count=3, average=15.5

#### 3. calc_min - Find Minimum

**What it does**: Finds the smallest number in a column

**Key logic:**
```assembly
calc_min:
    la $t0, data_buffer      # Data address
    lw $t1, row_count        # Row count
    
    lwc1 $f0, 0($t0)         # Initialize min with first value
    li $t2, 1                # Start from second element
    
min_loop:
    bge $t2, $t1, min_store  # If done, save result
    
    sll $t3, $t2, 2          # Calculate offset
    add $t3, $t0, $t3        # Get address
    lwc1 $f2, 0($t3)         # Load value
    
    c.lt.s $f2, $f0          # Compare: is value < min?
    bc1f min_next            # If false, skip update
    mov.s $f0, $f2           # Update min = value
    
min_next:
    addi $t2, $t2, 1         # Next element
    j min_loop
```
- **Purpose**: Compare each value with current minimum
- **Like**: `min = data[0]; for each value: if value < min: min = value`

**Real-world example**: [10.5, 20.3, 15.7] → min = 10.5


#### 4. calc_max - Find Maximum

**What it does**: Finds the largest number in a column

**Key logic:**
```assembly
calc_max:
    lwc1 $f0, 0($t0)         # Initialize max with first value
    
max_loop:
    lwc1 $f2, 0($t3)         # Load value
    
    c.lt.s $f0, $f2          # Compare: is max < value?
    bc1f max_next            # If false, skip
    mov.s $f0, $f2           # Update max = value
```
- **Purpose**: Compare each value with current maximum
- **Opposite of min**: Updates when value is GREATER

**Real-world example**: [10.5, 20.3, 15.7] → max = 20.3

#### 5. calc_variance - Calculate Variance

**What it does**: Measures how spread out the data is

**Formula**: Variance = Σ(x - mean)² / n

**Key logic:**
```assembly
calc_variance:
    jal calc_avg             # First get mean
    lwc1 $f4, agg_avg        # $f4 = mean
    
    lwc1 $f0, float_zero     # sum_of_squares = 0
    li $t2, 0                # index = 0
    
var_loop:
    lwc1 $f2, 0($t3)         # Load value (x)
    
    sub.s $f2, $f2, $f4      # difference = x - mean
    mul.s $f2, $f2, $f2      # squared = difference²
    add.s $f0, $f0, $f2      # sum_of_squares += squared
    
var_calc:
    mtc1 $t1, $f2            # Convert count to float
    cvt.s.w $f2, $f2
    div.s $f0, $f0, $f2      # variance = sum_of_squares / count
    swc1 $f0, agg_variance
```
- **Purpose**: Calculate average squared deviation from mean
- **Steps**:
  1. Calculate mean
  2. For each value: (value - mean)²
  3. Sum all squared differences
  4. Divide by count

**Real-world example**: 
- Data: [10, 20, 30]
- Mean: 20
- Differences: [-10, 0, 10]
- Squared: [100, 0, 100]
- Sum: 200
- Variance: 200/3 = 66.67

#### 6. calc_stddev - Standard Deviation

**What it does**: Square root of variance (more intuitive measure of spread)

**Key logic:**
```assembly
calc_stddev:
    jal calc_variance        # Calculate variance first
    lwc1 $f0, agg_variance   # Load variance
    sqrt.s $f0, $f0          # stddev = √variance
    swc1 $f0, agg_stddev     # Save result
```
- **Purpose**: Convert variance to same units as original data
- **Like**: `stddev = sqrt(variance);`

**Real-world example**: If variance = 66.67, stddev = 8.16


#### 7. apply_filter_eq - Equality Filter

**What it does**: Marks rows where column value equals target (like WHERE column = value)

**Key logic:**
```assembly
apply_filter_eq:
    la $t2, filter_mask      # Bit mask array
    mtc1 $a1, $f4            # Target value
    
filter_eq_loop:
    lwc1 $f2, 0($t5)         # Load value
    
    c.eq.s $f2, $f4          # Is value == target?
    bc1f filter_eq_nomatch   # If not equal, skip
    
    # Set bit in mask
    srl $t6, $t3, 3          # Byte index = row / 8
    andi $t7, $t3, 7         # Bit index = row % 8
    add $t6, $t2, $t6        # Get byte address
    lb $t8, 0($t6)           # Load current byte
    li $t9, 1                # Create bit mask
    sllv $t9, $t9, $t7       # Shift to correct position
    or $t8, $t8, $t9         # Set the bit
    sb $t8, 0($t6)           # Store back
```
- **Purpose**: Create a bit mask where 1 = row matches filter
- **Bit manipulation**: Each byte stores 8 row flags
- **Like**: `mask[row] = (data[row] == target) ? 1 : 0;`

**Real-world example**: 
- Data: [10, 20, 10, 30]
- Filter: value == 10
- Mask: [1, 0, 1, 0] (rows 0 and 2 match)

#### 8. apply_filter_range - Range Filter

**What it does**: Marks rows where min ≤ value ≤ max

**Key logic:**
```assembly
apply_filter_range:
    lwc1 $f2, 0($t5)         # Load value
    
    c.lt.s $f2, $f12         # Is value < min?
    bc1t filter_range_skip   # If yes, skip
    
    c.lt.s $f14, $f2         # Is max < value?
    bc1t filter_range_skip   # If yes, skip
    
    # Set bit (value is in range)
```
- **Purpose**: Filter rows within a range
- **Like**: `WHERE value BETWEEN min AND max` in SQL

**Real-world example**:
- Data: [10, 20, 30, 40]
- Filter: 15 ≤ value ≤ 35
- Result: [20, 30] match

#### 9. group_by_single - Group By Operation

**What it does**: Groups rows by a key column and sums values (like SQL GROUP BY)

**Key logic:**
```assembly
group_by_single:
    lw $t8, 0($t7)           # Load key (e.g., region ID)
    lwc1 $f2, 0($t7)         # Load value (e.g., sales amount)
    
find_group:
    lw $v0, 0($a3)           # Load existing group key
    beq $v0, $t8, update_group  # If key matches, update
    
create_group:
    sw $t8, 0($a3)           # Store new group key
    swc1 $f2, 0($a3)         # Initialize sum
    li $v0, 1
    sw $v0, 0($a3)           # Initialize count = 1
    
update_group:
    lwc1 $f4, 0($a3)         # Load current sum
    add.s $f4, $f4, $f2      # Add new value
    swc1 $f4, 0($a3)         # Store updated sum
```
- **Purpose**: Aggregate data by categories
- **Like**: `SELECT region, SUM(sales) FROM data GROUP BY region`

**Real-world example**:
- Data: [(East, 100), (West, 200), (East, 150)]
- Result: {East: 250, West: 200}


#### 10. calc_histogram - Create Histogram

**What it does**: Divides data into bins and counts values in each bin

**Key logic:**
```assembly
calc_histogram:
    jal calc_min             # Find min value
    jal calc_max             # Find max value
    
    lwc1 $f0, agg_min        # $f0 = min
    lwc1 $f2, agg_max        # $f2 = max
    
    sub.s $f4, $f2, $f0      # range = max - min
    lw $t0, num_bins         # Number of bins
    mtc1 $t0, $f6
    cvt.s.w $f6, $f6
    div.s $f4, $f4, $f6      # bin_width = range / num_bins
    
hist_loop:
    lwc1 $f2, 0($t3)         # Load value
    sub.s $f2, $f2, $f0      # value - min
    div.s $f2, $f2, $f4      # (value - min) / width
    cvt.w.s $f2, $f2         # Convert to integer bin index
    mfc1 $t4, $f2
    
    # Increment bin count
    lw $t6, 0($t5)           # Load current count
    addi $t6, $t6, 1         # Increment
    sw $t6, 0($t5)           # Store back
```
- **Purpose**: Create frequency distribution
- **Steps**:
  1. Find min and max
  2. Calculate bin width
  3. For each value, determine which bin
  4. Increment bin counter

**Real-world example**:
- Data: [5, 15, 25, 35, 45]
- 3 bins: [0-20], [20-40], [40-60]
- Result: [2, 2, 1]

#### 11. calc_rolling_avg - Rolling Average

**What it does**: Calculates moving average over a window

**Key logic:**
```assembly
calc_rolling_avg:
    move $t1, $a1            # Window size
    
rolling_loop:
    lwc1 $f0, float_zero     # sum = 0
    
window_sum:
    lwc1 $f2, 0($t4)         # Load value in window
    add.s $f0, $f0, $f2      # sum += value
    
window_avg:
    mtc1 $a1, $f2            # Window size
    cvt.s.w $f2, $f2
    div.s $f0, $f0, $f2      # avg = sum / window_size
    swc1 $f0, 0($t4)         # Store result
```
- **Purpose**: Smooth data by averaging over sliding window
- **Like**: Moving average in stock charts

**Real-world example**:
- Data: [10, 20, 30, 40, 50]
- Window: 3
- Result: [-, -, 20, 30, 40] (average of last 3 values)

---

## Advanced Analytics File Explanation

### File Purpose
Contains complex statistical operations: correlation, regression, forecasting, ranking, and cumulative calculations.


### Key Functions Explained

#### 1. calc_correlation - Pearson Correlation

**What it does**: Measures relationship between two variables (-1 to +1)

**Formula**: r = Σ(xi-x̄)(yi-ȳ) / √(Σ(xi-x̄)² × Σ(yi-ȳ)²)

**Key logic:**
```assembly
calc_correlation:
    # Calculate mean of X
    add.s $f0, $f0, $f2      # sum_x += x
    div.s $f20, $f0, $f4     # mean_x = sum_x / count
    
    # Calculate mean of Y
    add.s $f0, $f0, $f2      # sum_y += y
    div.s $f22, $f0, $f4     # mean_y = sum_y / count
    
corr_loop:
    sub.s $f10, $f2, $f20    # (xi - mean_x)
    sub.s $f12, $f4, $f22    # (yi - mean_y)
    
    mul.s $f14, $f10, $f12   # (xi-x̄)(yi-ȳ)
    add.s $f0, $f0, $f14     # sum_xy += product
    
    mul.s $f14, $f10, $f10   # (xi-x̄)²
    add.s $f6, $f6, $f14     # sum_xx += squared
    
    mul.s $f14, $f12, $f12   # (yi-ȳ)²
    add.s $f8, $f8, $f14     # sum_yy += squared
    
corr_calc:
    mul.s $f10, $f6, $f8     # sum_xx × sum_yy
    sqrt.s $f10, $f10        # √(sum_xx × sum_yy)
    div.s $f0, $f0, $f10     # r = sum_xy / √(...)
```
- **Purpose**: Measure how two variables move together
- **Result**:
  - +1 = Perfect positive correlation
  - 0 = No correlation
  - -1 = Perfect negative correlation

**Real-world example**:
- X (advertising): [10, 20, 30, 40]
- Y (sales): [100, 200, 300, 400]
- Correlation: +1 (perfect positive - more ads = more sales)

#### 2. calc_linear_regression - Linear Regression

**What it does**: Finds best-fit line (y = mx + b) for data

**Formulas**:
- Slope (m) = (n×Σxy - Σx×Σy) / (n×Σx² - (Σx)²)
- Intercept (b) = (Σy - m×Σx) / n

**Key logic:**
```assembly
calc_linear_regression:
    add.s $f0, $f0, $f10     # sum_x += x
    add.s $f2, $f2, $f12     # sum_y += y
    
    mul.s $f14, $f10, $f12
    add.s $f4, $f4, $f14     # sum_xy += x*y
    
    mul.s $f14, $f10, $f10
    add.s $f6, $f6, $f14     # sum_xx += x²
    
reg_calc:
    mul.s $f10, $f8, $f4     # n × sum_xy
    mul.s $f12, $f0, $f2     # sum_x × sum_y
    sub.s $f10, $f10, $f12   # numerator
    
    mul.s $f12, $f8, $f6     # n × sum_xx
    mul.s $f14, $f0, $f0     # (sum_x)²
    sub.s $f12, $f12, $f14   # denominator
    
    div.s $f20, $f10, $f12   # slope = num / denom
    
    mul.s $f10, $f20, $f0    # slope × sum_x
    sub.s $f10, $f2, $f10    # sum_y - slope×sum_x
    div.s $f22, $f10, $f8    # intercept = ... / n
```
- **Purpose**: Predict Y from X using linear relationship
- **Output**: slope and intercept for prediction line

**Real-world example**:
- Data: [(1,2), (2,4), (3,6)]
- Result: y = 2x + 0 (slope=2, intercept=0)
- Prediction: If x=5, then y=10


#### 3. calc_ema - Exponential Moving Average

**What it does**: Weighted moving average giving more weight to recent values

**Formula**: EMA_t = α × value_t + (1-α) × EMA_{t-1}

**Key logic:**
```assembly
calc_ema:
    lwc1 $f0, 0($t0)         # EMA_0 = first value
    
    li $t3, 1
    mtc1 $t3, $f2
    cvt.s.w $f2, $f2
    sub.s $f2, $f2, $f12     # (1 - alpha)
    
ema_loop:
    lwc1 $f4, 0($t5)         # Current value
    
    mul.s $f6, $f12, $f4     # alpha × value
    mul.s $f8, $f2, $f0      # (1-alpha) × prev_EMA
    add.s $f0, $f6, $f8      # new_EMA = sum
    
    swc1 $f0, 0($t5)         # Store result
```
- **Purpose**: Smooth time series data with exponential weighting
- **Alpha**: Smoothing factor (0-1)
  - High alpha = more responsive to recent changes
  - Low alpha = smoother, less responsive

**Real-world example**:
- Data: [10, 20, 15, 25]
- Alpha: 0.3
- EMA: [10, 13, 13.6, 17.12]

#### 4. calc_cumsum - Cumulative Sum

**What it does**: Running total of values

**Key logic:**
```assembly
calc_cumsum:
    mtc1 $zero, $f0          # running_sum = 0
    
cumsum_loop:
    lwc1 $f2, 0($t5)         # Load value
    add.s $f0, $f0, $f2      # running_sum += value
    swc1 $f0, 0($t5)         # Store cumulative sum
```
- **Purpose**: Calculate running total
- **Like**: Cumulative sales over time

**Real-world example**:
- Data: [10, 20, 30, 40]
- Cumsum: [10, 30, 60, 100]

#### 5. calc_rank - Ranking

**What it does**: Assigns rank to each value (1 = smallest)

**Key logic:**
```assembly
calc_rank:
rank_outer:
    lwc1 $f0, 0($t2)         # Current value
    li $t3, 1                # rank = 1
    
rank_inner:
    lwc1 $f2, 0($t5)         # Compare value
    
    c.lt.s $f2, $f0          # Is other < current?
    bc1f rank_skip_self
    addi $t3, $t3, 1         # rank++ (found smaller value)
    
rank_store:
    sw $t3, 0($t2)           # Store rank
```
- **Purpose**: Rank values from smallest to largest
- **Method**: For each value, count how many are smaller
- **Complexity**: O(n²) - compares each value with all others

**Real-world example**:
- Data: [30, 10, 20, 40]
- Ranks: [3, 1, 2, 4]


#### 6. calc_dense_rank - Dense Ranking

**What it does**: Like rank but no gaps after ties

**Difference from rank**:
- Regular rank: [10, 10, 20] → [1, 1, 3] (gap at 2)
- Dense rank: [10, 10, 20] → [1, 1, 2] (no gap)

**Real-world example**: Competition rankings where ties don't skip numbers

#### 7. calc_percent_rank - Percent Rank

**What it does**: Converts rank to percentage (0.0 to 1.0)

**Formula**: (rank - 1) / (n - 1)

**Key logic:**
```assembly
calc_percent_rank:
    jal calc_rank            # Get ranks first
    
    addi $t3, $t2, -1        # n - 1
    mtc1 $t3, $f4
    cvt.s.w $f4, $f4         # Convert to float
    
prank_loop:
    lw $t6, 0($t5)           # Load rank
    addi $t6, $t6, -1        # rank - 1
    mtc1 $t6, $f0
    cvt.s.w $f0, $f0
    div.s $f0, $f0, $f4      # (rank-1) / (n-1)
```
- **Purpose**: Express rank as percentage of dataset
- **Result**: 0.0 = lowest, 1.0 = highest

**Real-world example**:
- Ranks: [1, 2, 3, 4]
- Percent ranks: [0.0, 0.33, 0.67, 1.0]

#### 8. calc_ntile - N-Tile Division

**What it does**: Divides data into N equal groups (quartiles, deciles, etc.)

**Key logic:**
```assembly
calc_ntile:
    div $t2, $t3             # rows_per_tile = count / N
    
ntile_loop:
    lw $t8, 0($t7)           # Load rank
    div $t8, $t4             # tile = rank / rows_per_tile
    mflo $t9
    addi $t9, $t9, 1         # 1-based tile number
```
- **Purpose**: Segment data into equal-sized buckets
- **Uses**:
  - Quartiles (N=4): Q1, Q2, Q3, Q4
  - Deciles (N=10): D1-D10
  - Percentiles (N=100)

**Real-world example**:
- 12 values, 4 tiles (quartiles)
- Each tile has 3 values
- Result: [1,1,1, 2,2,2, 3,3,3, 4,4,4]

#### 9. calc_quartiles - Calculate Quartiles

**What it does**: Finds Q1 (25%), Q2 (50%/median), Q3 (75%)

**Key logic:**
```assembly
calc_quartiles:
    li $a1, 25
    jal calc_percentile      # Q1 = 25th percentile
    
    li $a1, 50
    jal calc_percentile      # Q2 = 50th percentile (median)
    
    li $a1, 75
    jal calc_percentile      # Q3 = 75th percentile
```
- **Purpose**: Divide data into four equal parts
- **Uses**: Box plots, outlier detection, data distribution

**Real-world example**:
- Data: [10, 20, 30, 40, 50, 60, 70, 80]
- Q1: 25 (25% of data below)
- Q2: 45 (median)
- Q3: 65 (75% of data below)


#### 10. calc_growth_rate - Growth Rate

**What it does**: Calculates percentage change between consecutive values

**Formula**: (current - previous) / previous × 100

**Key logic:**
```assembly
calc_growth_rate:
    lwc1 $f0, 0($t5)         # current value
    lwc1 $f2, 0($t5)         # previous value
    
    c.eq.s $f2, $f4          # Check if previous = 0
    bc1t growth_zero         # Avoid division by zero
    
    sub.s $f4, $f0, $f2      # current - previous
    div.s $f4, $f4, $f2      # (current - prev) / prev
    
    li $t6, 100
    mtc1 $t6, $f6
    cvt.s.w $f6, $f6
    mul.s $f4, $f4, $f6      # × 100 for percentage
```
- **Purpose**: Measure period-over-period change
- **Uses**: Sales growth, revenue trends, YoY comparisons

**Real-world example**:
- Sales: [100, 120, 150, 135]
- Growth: [-, 20%, 25%, -10%]

#### 11. calc_compound_growth - CAGR

**What it does**: Compound Annual Growth Rate

**Formula**: (end/start)^(1/n) - 1

**Key logic:**
```assembly
calc_compound_growth:
    lwc1 $f0, 0($t0)         # start value
    lwc1 $f2, 0($t2)         # end value
    
    div.s $f4, $f2, $f0      # end / start
    
    # Simplified: total growth
    li $t3, 1
    mtc1 $t3, $f6
    cvt.s.w $f6, $f6
    sub.s $f0, $f4, $f6      # (end/start) - 1
    
    mul.s $f0, $f0, $f6      # × 100 for percentage
```
- **Purpose**: Average annual growth rate over multiple periods
- **Uses**: Investment returns, business growth metrics

**Real-world example**:
- Start: $100, End: $150, Years: 3
- CAGR: ~14.5% per year

#### 12. calc_forecast - Simple Forecasting

**What it does**: Predicts future values using linear extrapolation

**Method**: Average change × periods ahead

**Key logic:**
```assembly
calc_forecast:
    # Calculate average change
    lwc1 $f2, 0($t4)         # current
    lwc1 $f4, 0($t4)         # previous
    sub.s $f4, $f2, $f4      # change
    add.s $f0, $f0, $f4      # sum of changes
    
    div.s $f6, $f0, $f2      # avg_change = sum / count
    
    lwc1 $f4, 0($t2)         # last value
    
forecast_gen:
    add.s $f4, $f4, $f6      # next = last + avg_change
    swc1 $f4, 0($t3)         # Store forecast
```
- **Purpose**: Predict future values based on historical trend
- **Method**: Assumes constant average change

**Real-world example**:
- Sales: [100, 110, 120, 130]
- Average change: +10
- Forecast: [140, 150, 160]

---

## Common Viva Questions

### Q1: Why use assembly for analytics?

**Answer**: 
- **Performance**: Assembly runs directly on CPU, no interpretation overhead
- **Control**: Direct memory management and optimization
- **Learning**: Understand how high-level operations work at hardware level
- **Efficiency**: Can optimize for specific processor features


### Q2: Explain the difference between $t and $s registers

**Answer**:
- **$t registers (temporary)**: 
  - Don't need to be saved across function calls
  - Used for quick calculations within a function
  - Caller's responsibility to save if needed
  
- **$s registers (saved)**:
  - Must be preserved across function calls
  - Function must save them on stack before use
  - Function must restore them before returning
  - Used for values that need to persist

### Q3: What is the stack and why do we use it?

**Answer**:
- **Stack**: Memory area for function calls, grows downward
- **Uses**:
  - Save return address ($ra)
  - Save registers that need preservation
  - Pass extra arguments (beyond $a0-$a3)
  - Store local variables
- **Operations**:
  - Push: `addi $sp, $sp, -4; sw $ra, 0($sp)`
  - Pop: `lw $ra, 0($sp); addi $sp, $sp, 4`

### Q4: How does floating-point comparison work?

**Answer**:
- Use `c.lt.s`, `c.eq.s`, etc. to compare
- These set a condition flag (not a register)
- Use `bc1t` (branch if true) or `bc1f` (branch if false) to act on result
- Example:
  ```assembly
  c.lt.s $f0, $f2    # Compare: is $f0 < $f2?
  bc1t label         # If true, jump to label
  ```

### Q5: Explain how the filter mask works

**Answer**:
- **Bit mask**: Each bit represents one row (1=include, 0=exclude)
- **Efficiency**: 8 rows per byte (saves memory)
- **Operations**:
  - Byte index: `row / 8` (using `srl $t, $row, 3`)
  - Bit index: `row % 8` (using `andi $t, $row, 7`)
  - Set bit: Create mask, OR with byte
  - Check bit: Load byte, shift, AND with 1

### Q6: What is columnar storage and why use it?

**Answer**:
- **Columnar**: Store each column separately (not row-by-row)
- **Benefits**:
  - Better cache locality for column operations
  - Easier to compress similar data
  - Faster aggregations (only read needed columns)
  - Better for analytics (usually operate on columns)
- **Example**: Instead of [(1,A), (2,B)], store [1,2] and [A,B]

### Q7: How does GROUP BY work in assembly?

**Answer**:
- **Process**:
  1. For each row, extract key and value
  2. Search existing groups for matching key
  3. If found: update sum and count
  4. If not found: create new group
- **Data structures**:
  - `group_keys`: Array of unique keys
  - `group_sums`: Corresponding sums
  - `group_counts`: Corresponding counts
- **Complexity**: O(n×g) where g = number of groups

### Q8: Explain variance calculation step by step

**Answer**:
1. **Calculate mean**: Sum all values, divide by count
2. **Calculate deviations**: For each value, subtract mean
3. **Square deviations**: Multiply each deviation by itself
4. **Sum squared deviations**: Add all squared values
5. **Divide by count**: Get average squared deviation
6. **Result**: Variance (measure of spread)

**Why square?**: 
- Makes all deviations positive
- Emphasizes larger deviations
- Mathematical properties for statistics


### Q9: What is the purpose of `sll $t0, $t1, 2`?

**Answer**:
- **Purpose**: Calculate array offset for word (4-byte) access
- **Math**: Shift left by 2 = multiply by 4
- **Why**: Arrays store elements consecutively in memory
  - Element 0: offset 0
  - Element 1: offset 4
  - Element 2: offset 8
  - Formula: offset = index × 4
- **Example**: 
  ```assembly
  li $t0, 3          # index = 3
  sll $t1, $t0, 2    # offset = 3 × 4 = 12
  add $t2, $base, $t1  # address = base + 12
  ```

### Q10: How does correlation differ from regression?

**Answer**:
- **Correlation**:
  - Measures strength of relationship (-1 to +1)
  - Symmetric (X→Y same as Y→X)
  - No prediction, just relationship
  - Example: r=0.9 means strong positive relationship
  
- **Regression**:
  - Finds prediction equation (y = mx + b)
  - Asymmetric (predicts Y from X)
  - Provides slope and intercept
  - Example: y = 2x + 5 predicts Y given X

### Q11: Explain the histogram algorithm

**Answer**:
1. **Find range**: Calculate min and max values
2. **Calculate bin width**: (max - min) / number_of_bins
3. **Initialize bins**: Set all bin counts to 0
4. **Assign values**: For each value:
   - Calculate: bin_index = (value - min) / bin_width
   - Increment: bin_count[bin_index]++
5. **Result**: Frequency distribution across bins

**Example**:
- Data: [5, 15, 25, 35, 45]
- Range: 5-45, 4 bins
- Bin width: 10
- Bins: [5-15], [15-25], [25-35], [35-45]
- Counts: [2, 1, 1, 1]

### Q12: What is the difference between EMA and SMA?

**Answer**:
- **SMA (Simple Moving Average)**:
  - Equal weight to all values in window
  - Formula: (v1 + v2 + ... + vn) / n
  - Slower to respond to changes
  
- **EMA (Exponential Moving Average)**:
  - More weight to recent values
  - Formula: α×current + (1-α)×previous_EMA
  - Faster to respond to changes
  - Alpha controls responsiveness (0-1)

**Example** (window=3):
- Data: [10, 20, 30, 40]
- SMA: [-, -, 20, 30] (average of last 3)
- EMA (α=0.5): [10, 15, 22.5, 31.25] (weighted)

### Q13: Why do we need to convert integers to floats?

**Answer**:
- **Integer division**: 7 / 2 = 3 (truncates)
- **Float division**: 7.0 / 2.0 = 3.5 (accurate)
- **Process**:
  1. `mtc1 $t0, $f0` - Move integer to float register
  2. `cvt.s.w $f0, $f0` - Convert to float format
  3. Now can use in float operations
- **Use cases**: Calculating averages, percentages, ratios

### Q14: How do you handle division by zero?

**Answer**:
```assembly
lw $t0, count
beqz $t0, handle_zero    # If count == 0, jump

# Normal division
mtc1 $t0, $f2
cvt.s.w $f2, $f2
div.s $f0, $f0, $f2
j done

handle_zero:
lwc1 $f0, float_zero     # Return 0.0
done:
```
- **Check before dividing**: Use `beqz` or `c.eq.s`
- **Alternative**: Return 0, NaN, or error code


### Q15: What is the time complexity of your algorithms?

**Answer**:
- **Linear O(n)**:
  - SUM, COUNT, AVG, MIN, MAX: Single pass through data
  - Cumulative sum, growth rate: One pass
  
- **O(n²)**:
  - Ranking: Compare each element with all others
  - Group by: Search groups for each row (worst case)
  
- **O(n log n)**:
  - Sorting (if implemented with quicksort/mergesort)
  - Percentile (with proper selection algorithm)
  
- **Multiple passes**:
  - Variance: 2 passes (mean, then squared deviations)
  - Correlation: 3 passes (mean X, mean Y, correlation)

### Q16: Explain the syscall mechanism

**Answer**:
- **Purpose**: Request OS services (I/O, exit, etc.)
- **Process**:
  1. Load service code into $v0
  2. Load arguments into $a0, $f12, etc.
  3. Execute `syscall`
  4. OS performs service
  5. Result (if any) in $v0 or $f0

**Common services**:
```assembly
# Print integer
li $v0, 1
move $a0, $t0
syscall

# Print float
li $v0, 2
mov.s $f12, $f0
syscall

# Print string
li $v0, 4
la $a0, message
syscall

# Exit program
li $v0, 10
syscall
```

### Q17: How would you optimize these algorithms?

**Answer**:
- **Loop unrolling**: Process multiple elements per iteration
- **Register allocation**: Keep frequently used values in registers
- **Reduce memory access**: Cache values in registers
- **SIMD**: Use vector instructions (if available)
- **Better algorithms**: 
  - Use quickselect for percentiles (O(n) vs O(n log n))
  - Hash table for group by (O(n) vs O(n²))
- **Parallel processing**: Divide work across multiple cores

### Q18: What are the limitations of your implementation?

**Answer**:
- **Fixed memory**: Limited by .space allocations
- **No dynamic allocation**: Can't grow arrays at runtime
- **Simple algorithms**: Some use O(n²) instead of optimal
- **No error handling**: Assumes valid input
- **Single precision**: Uses 32-bit floats (not 64-bit doubles)
- **No sorting**: Percentiles assume sorted data or use approximation
- **Limited group by**: Fixed maximum number of groups

### Q19: How does the rolling average work?

**Answer**:
1. **Window size**: Number of values to average (e.g., 3)
2. **For each position** (starting from window_size-1):
   - Sum the last `window_size` values
   - Divide by window_size
   - Store result
3. **First values**: No result (not enough history)

**Example** (window=3):
```
Data:    [10, 20, 30, 40, 50]
Index:    0   1   2   3   4
Window:  [10,20,30] → avg=20
         [20,30,40] → avg=30
         [30,40,50] → avg=40
Result:  [-, -, 20, 30, 40]
```

### Q20: Explain the difference between .data and .text sections

**Answer**:
- **.data section**:
  - Stores variables and constants
  - Allocated at program start
  - Read/write memory
  - Contains: integers, floats, strings, arrays
  - Example: `count: .word 0`
  
- **.text section**:
  - Contains executable instructions
  - Read-only (usually)
  - The actual program code
  - Contains: functions, loops, calculations
  - Example: `add $t0, $t1, $t2`

**Analogy**: 
- .data = Variables in a program
- .text = Functions/methods in a program


---

## Quick Reference Tables

### Register Usage Summary

| Register | Purpose | Must Save? | Example Use |
|----------|---------|------------|-------------|
| $zero | Always 0 | No | Comparisons, initialization |
| $v0-$v1 | Return values | No | Function results, syscall code |
| $a0-$a3 | Arguments | No | Pass parameters to functions |
| $t0-$t9 | Temporary | No | Loop counters, calculations |
| $s0-$s7 | Saved | Yes | Important values across calls |
| $sp | Stack pointer | Yes | Function call management |
| $ra | Return address | Yes | Return from functions |
| $f0-$f31 | Float registers | Varies | Decimal calculations |

### Common Instruction Patterns

**Loop Pattern:**
```assembly
li $t0, 0              # index = 0
lw $t1, count          # load count
loop:
    bge $t0, $t1, done # if index >= count, exit
    # ... loop body ...
    addi $t0, $t0, 1   # index++
    j loop
done:
```

**Function Call Pattern:**
```assembly
# Caller
addi $sp, $sp, -4
sw $ra, 0($sp)         # Save return address
jal function           # Call function
lw $ra, 0($sp)         # Restore return address
addi $sp, $sp, 4

# Callee
function:
    addi $sp, $sp, -8
    sw $ra, 0($sp)     # Save registers
    sw $s0, 4($sp)
    # ... function body ...
    lw $ra, 0($sp)     # Restore registers
    lw $s0, 4($sp)
    addi $sp, $sp, 8
    jr $ra             # Return
```

**Array Access Pattern:**
```assembly
la $t0, array          # Base address
li $t1, 5              # Index
sll $t2, $t1, 2        # Offset = index * 4
add $t3, $t0, $t2      # Address = base + offset
lw $t4, 0($t3)         # Load value
```

### Syscall Services

| Code | Service | Arguments | Example |
|------|---------|-----------|---------|
| 1 | Print integer | $a0 = value | `li $v0, 1; move $a0, $t0; syscall` |
| 2 | Print float | $f12 = value | `li $v0, 2; mov.s $f12, $f0; syscall` |
| 4 | Print string | $a0 = address | `li $v0, 4; la $a0, msg; syscall` |
| 10 | Exit program | None | `li $v0, 10; syscall` |

### Data Type Sizes

| Type | Size | Directive | Example |
|------|------|-----------|---------|
| Byte | 1 byte | .byte | `.byte 255` |
| Word | 4 bytes | .word | `.word 1000` |
| Float | 4 bytes | .float | `.float 3.14` |
| String | Variable | .asciiz | `.asciiz "Hello"` |
| Array | N × size | .space | `.space 400` (100 words) |

---

## Tips for Viva Success

### 1. Understand the Big Picture
- Know what each file does overall
- Explain how assembly connects to high-level analytics
- Relate to real-world BI tools (Excel, Power BI)

### 2. Master Key Concepts
- Register types and usage
- Stack operations
- Float vs integer operations
- Memory addressing

### 3. Trace Through Code
- Be able to walk through a loop iteration
- Explain what each register contains
- Show how memory is accessed

### 4. Know the Math
- Understand formulas (variance, correlation, etc.)
- Explain why we use each formula
- Give real-world examples

### 5. Compare with High-Level Code
- Relate assembly to C/Java/Python
- Explain what the compiler does
- Show understanding of abstraction levels

### 6. Be Ready for "What If" Questions
- What if count is zero?
- What if data doesn't fit in memory?
- How would you optimize this?
- What are the limitations?

### 7. Practice Explaining
- Use simple language
- Draw diagrams if helpful
- Give concrete examples
- Show enthusiasm for the topic

---

## Conclusion

This guide covers all the essential concepts, instructions, and algorithms in your MIPS assembly analytics project. Remember:

- **Assembly is just another programming language** - it's closer to hardware but follows the same logic
- **Every high-level operation** (like calculating average) **breaks down into simple steps** - that's what assembly shows
- **Understanding assembly** helps you appreciate how computers really work and makes you a better programmer

**Good luck with your viva!** 🎓

---

*Last Updated: January 2026*
*For Lynx BI - Business Intelligence with MIPS Assembly*
