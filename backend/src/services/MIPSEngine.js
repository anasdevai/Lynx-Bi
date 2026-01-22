const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const AdvancedAnalytics = require('./AdvancedAnalytics');

class MIPSEngine {
  constructor() {
    this.mipsDir = path.join(__dirname, '../../mips');
    this.tempDir = path.join(__dirname, '../../temp');
    this.marsAvailable = false;
    this.ensureDirectories();
    this.checkMARSAvailability();
  }

  ensureDirectories() {
    [this.mipsDir, this.tempDir].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
  }

  checkMARSAvailability() {
    const marsPath = path.join(this.mipsDir, 'mars.jar');
    this.marsAvailable = fs.existsSync(marsPath);
    
    if (this.marsAvailable) {
      console.log('✅ MIPS Execution: Using MARS simulator');
      console.log(`   Location: ${marsPath}`);
    } else {
      console.log('⚠️  MIPS Execution: Using JavaScript fallback');
      console.log('   To enable MIPS: Place mars.jar in mips/ folder');
      console.log('   Download from: http://courses.missouristate.edu/kenvollmar/mars/');
    }
  }

  // Execute MIPS analytics query
  async executeQuery(query, data) {
    const { measures, filters, groupBy, timeIntelligence } = query;
    
    // Prepare data file for MIPS
    const dataFile = await this.prepareDataFile(data, query);
    
    // Generate MIPS program based on query
    const mipsProgram = this.generateMIPSProgram(query, dataFile);
    const programFile = path.join(this.tempDir, `query_${uuidv4()}.asm`);
    fs.writeFileSync(programFile, mipsProgram);
    
    // Execute MIPS (using MARS simulator or fallback to JS)
    try {
      const result = await this.executeMIPS(programFile, dataFile);
      return this.parseResult(result);
    } catch (error) {
      console.warn('MIPS execution failed, using JS fallback:', error.message);
      return this.executeJSFallback(query, data);
    } finally {
      // Cleanup temp files
      this.cleanup([programFile, dataFile]);
    }
  }

  async prepareDataFile(data, query) {
    const dataFile = path.join(this.tempDir, `data_${uuidv4()}.bin`);
    
    // Extract relevant columns
    const columns = this.getRelevantColumns(query);
    const columnarData = {};
    
    for (const col of columns) {
      columnarData[col] = data.map(row => {
        const val = row[col];
        return typeof val === 'number' ? val : (parseFloat(val) || 0);
      });
    }
    
    // Write binary format for MIPS
    const buffer = this.createBinaryBuffer(columnarData, data.length);
    fs.writeFileSync(dataFile, buffer);
    
    return dataFile;
  }

  getRelevantColumns(query) {
    const columns = new Set();
    
    // Add measure columns
    if (query.measures) {
      query.measures.forEach(m => {
        const match = m.match(/\((\w+)\)/);
        if (match) columns.add(match[1]);
      });
    }
    
    // Add groupBy columns
    if (query.groupBy) {
      query.groupBy.forEach(g => columns.add(g));
    }
    
    // Add filter columns
    if (query.filters) {
      Object.keys(query.filters).forEach(f => columns.add(f));
    }
    
    return Array.from(columns);
  }

  createBinaryBuffer(columnarData, rowCount) {
    const columns = Object.keys(columnarData);
    const headerSize = 8 + columns.length * 4; // rowCount + colCount + offsets
    const dataSize = rowCount * columns.length * 4;
    const buffer = Buffer.alloc(headerSize + dataSize);
    
    let offset = 0;
    buffer.writeInt32LE(rowCount, offset); offset += 4;
    buffer.writeInt32LE(columns.length, offset); offset += 4;
    
    // Write column offsets
    let dataOffset = headerSize;
    for (const col of columns) {
      buffer.writeInt32LE(dataOffset, offset); offset += 4;
      dataOffset += rowCount * 4;
    }
    
    // Write column data
    offset = headerSize;
    for (const col of columns) {
      for (const val of columnarData[col]) {
        buffer.writeFloatLE(val, offset); offset += 4;
      }
    }
    
    return buffer;
  }


  generateMIPSProgram(query, dataFile) {
    // Generate MIPS assembly based on query type
    const measures = query.measures || [];
    const hasGroupBy = query.groupBy && query.groupBy.length > 0;
    
    return `
# Lynx BI Analytics Engine - Auto-generated MIPS Program
# Query: ${JSON.stringify(query)}

.data
    data_file:    .asciiz "${dataFile.replace(/\\/g, '/')}"
    result_buf:   .space 4096
    newline:      .asciiz "\\n"
    measure_lbl:  .asciiz "MEASURE="
    value_lbl:    .asciiz " VALUE="
    kpi_lbl:      .asciiz "KPI="
    hist_lbl:     .asciiz "HISTOGRAM="
    
    # Data storage
    row_count:    .word 0
    col_count:    .word 0
    data_buffer:  .space 400000    # 100K floats max
    
    # Aggregation results
    sum_result:   .float 0.0
    count_result: .word 0
    min_result:   .float 999999999.0
    max_result:   .float -999999999.0
    avg_result:   .float 0.0
    variance:     .float 0.0
    stddev:       .float 0.0

.text
.globl main

main:
    # Initialize
    jal load_data
    
    # Execute aggregations
    ${measures.map(m => this.generateMeasureCode(m)).join('\n    ')}
    
    # Output results
    jal output_results
    
    # Exit
    li $v0, 10
    syscall

# Load binary data file
load_data:
    # Open file
    li $v0, 13
    la $a0, data_file
    li $a1, 0
    li $a2, 0
    syscall
    move $s0, $v0           # File descriptor
    
    # Read header (row_count, col_count)
    li $v0, 14
    move $a0, $s0
    la $a1, row_count
    li $a2, 8
    syscall
    
    # Read data
    li $v0, 14
    move $a0, $s0
    la $a1, data_buffer
    li $a2, 400000
    syscall
    
    # Close file
    li $v0, 16
    move $a0, $s0
    syscall
    
    jr $ra

# SUM aggregation
calc_sum:
    la $t0, data_buffer
    lw $t1, row_count
    mtc1 $zero, $f0         # sum = 0
    
sum_loop:
    beqz $t1, sum_done
    lwc1 $f2, 0($t0)
    add.s $f0, $f0, $f2
    addi $t0, $t0, 4
    addi $t1, $t1, -1
    j sum_loop
    
sum_done:
    swc1 $f0, sum_result
    jr $ra

# COUNT aggregation
calc_count:
    lw $t0, row_count
    sw $t0, count_result
    jr $ra

# AVG aggregation
calc_avg:
    jal calc_sum
    lwc1 $f0, sum_result
    lw $t0, row_count
    mtc1 $t0, $f2
    cvt.s.w $f2, $f2
    div.s $f0, $f0, $f2
    swc1 $f0, avg_result
    jr $ra

# MIN aggregation
calc_min:
    la $t0, data_buffer
    lw $t1, row_count
    lwc1 $f0, 0($t0)        # min = first value
    
min_loop:
    beqz $t1, min_done
    lwc1 $f2, 0($t0)
    c.lt.s $f2, $f0
    bc1f min_skip
    mov.s $f0, $f2
min_skip:
    addi $t0, $t0, 4
    addi $t1, $t1, -1
    j min_loop
    
min_done:
    swc1 $f0, min_result
    jr $ra

# MAX aggregation
calc_max:
    la $t0, data_buffer
    lw $t1, row_count
    lwc1 $f0, 0($t0)        # max = first value
    
max_loop:
    beqz $t1, max_done
    lwc1 $f2, 0($t0)
    c.lt.s $f0, $f2
    bc1f max_skip
    mov.s $f0, $f2
max_skip:
    addi $t0, $t0, 4
    addi $t1, $t1, -1
    j max_loop
    
max_done:
    swc1 $f0, max_result
    jr $ra

# Output results in structured format
output_results:
    # Print MEASURE=SUM VALUE=xxx
    li $v0, 4
    la $a0, measure_lbl
    syscall
    
    li $v0, 4
    la $a0, value_lbl
    syscall
    
    li $v0, 2
    lwc1 $f12, sum_result
    syscall
    
    li $v0, 4
    la $a0, newline
    syscall
    
    jr $ra
`;
  }

  generateMeasureCode(measure) {
    const match = measure.match(/(\w+)\((\w+)\)/);
    if (!match) return '';
    
    const [, func, col] = match;
    switch (func.toUpperCase()) {
      case 'SUM': return 'jal calc_sum';
      case 'COUNT': return 'jal calc_count';
      case 'AVG': return 'jal calc_avg';
      case 'MIN': return 'jal calc_min';
      case 'MAX': return 'jal calc_max';
      default: return '';
    }
  }

  async executeMIPS(programFile, dataFile) {
    // Check if MARS is available
    if (!this.marsAvailable) {
      throw new Error('MARS simulator not available');
    }
    
    return new Promise((resolve, reject) => {
      const marsPath = path.join(this.mipsDir, 'mars.jar');
      
      // Try MARS simulator
      const mars = spawn('java', ['-jar', marsPath, programFile], {
        cwd: this.mipsDir,
        timeout: 30000
      });
      
      let output = '';
      let error = '';
      
      mars.stdout.on('data', data => output += data.toString());
      mars.stderr.on('data', data => error += data.toString());
      
      mars.on('close', code => {
        if (code === 0) {
          console.log('✅ MIPS execution successful');
          resolve(output);
        } else {
          reject(new Error(error || 'MIPS execution failed'));
        }
      });
      
      mars.on('error', (err) => {
        reject(new Error(`MARS execution error: ${err.message}`));
      });
    });
  }


  // JavaScript fallback when MIPS simulator unavailable
  executeJSFallback(query, data) {
    const results = { measures: {}, groups: [], kpis: [], histogram: null, advanced: {} };
    
    // Apply filters
    let filteredData = this.applyFilters(data, query.filters);
    
    // Group by processing
    if (query.groupBy && query.groupBy.length > 0) {
      results.groups = this.processGroupBy(filteredData, query);
    }
    
    // Calculate measures
    if (query.measures) {
      for (const measure of query.measures) {
        results.measures[measure] = this.calculateMeasure(filteredData, measure);
      }
    }
    
    // Time intelligence
    if (query.timeIntelligence) {
      results.timeAnalysis = this.processTimeIntelligence(filteredData, query);
    }
    
    // KPIs
    if (query.kpis) {
      results.kpis = this.calculateKPIs(results.measures, query.kpis);
    }
    
    // Histogram
    if (query.histogram) {
      results.histogram = this.calculateHistogram(filteredData, query.histogram);
    }
    
    // Advanced Analytics
    if (query.advanced) {
      results.advanced = this.processAdvancedAnalytics(filteredData, query.advanced);
    }
    
    return results;
  }

  // Process advanced analytics queries
  processAdvancedAnalytics(data, config) {
    const results = {};
    
    // Correlation
    if (config.correlation) {
      const { xColumn, yColumn } = config.correlation;
      const x = data.map(r => parseFloat(r[xColumn]) || 0);
      const y = data.map(r => parseFloat(r[yColumn]) || 0);
      results.correlation = {
        value: AdvancedAnalytics.correlation(x, y),
        columns: [xColumn, yColumn]
      };
    }
    
    // Linear Regression
    if (config.regression) {
      const { xColumn, yColumn } = config.regression;
      const x = data.map(r => parseFloat(r[xColumn]) || 0);
      const y = data.map(r => parseFloat(r[yColumn]) || 0);
      results.regression = AdvancedAnalytics.linearRegression(x, y);
    }
    
    // Median
    if (config.median) {
      const values = data.map(r => parseFloat(r[config.median]) || 0);
      results.median = AdvancedAnalytics.median(values);
    }
    
    // Mode
    if (config.mode) {
      const values = data.map(r => parseFloat(r[config.mode]) || 0);
      results.mode = AdvancedAnalytics.mode(values);
    }
    
    // Quartiles
    if (config.quartiles) {
      const values = data.map(r => parseFloat(r[config.quartiles]) || 0);
      results.quartiles = AdvancedAnalytics.quartiles(values);
    }
    
    // EMA
    if (config.ema) {
      const { column, alpha } = config.ema;
      const values = data.map(r => parseFloat(r[column]) || 0);
      results.ema = AdvancedAnalytics.ema(values, alpha || 0.2);
    }
    
    // SMA
    if (config.sma) {
      const { column, window } = config.sma;
      const values = data.map(r => parseFloat(r[column]) || 0);
      results.sma = AdvancedAnalytics.sma(values, window || 3);
    }
    
    // Cumulative Sum
    if (config.cumsum) {
      const values = data.map(r => parseFloat(r[config.cumsum]) || 0);
      results.cumsum = AdvancedAnalytics.cumsum(values);
    }
    
    // Growth Rate
    if (config.growthRate) {
      const values = data.map(r => parseFloat(r[config.growthRate]) || 0);
      results.growthRate = AdvancedAnalytics.growthRate(values);
      results.periodGrowth = AdvancedAnalytics.periodGrowth(values);
    }
    
    // Z-Scores
    if (config.zScores) {
      const values = data.map(r => parseFloat(r[config.zScores]) || 0);
      results.zScores = AdvancedAnalytics.zScores(values);
    }
    
    // Rank
    if (config.rank) {
      const values = data.map(r => parseFloat(r[config.rank]) || 0);
      results.rank = AdvancedAnalytics.rank(values);
      results.percentRank = AdvancedAnalytics.percentRank(values);
    }
    
    // Forecast
    if (config.forecast) {
      const { column, periods } = config.forecast;
      const values = data.map(r => parseFloat(r[column]) || 0);
      results.forecast = AdvancedAnalytics.forecast(values, periods || 3);
    }
    
    // Skewness & Kurtosis
    if (config.distribution) {
      const values = data.map(r => parseFloat(r[config.distribution]) || 0);
      results.distribution = {
        skewness: AdvancedAnalytics.skewness(values),
        kurtosis: AdvancedAnalytics.kurtosis(values),
        cv: AdvancedAnalytics.coefficientOfVariation(values)
      };
    }
    
    // Pareto Analysis
    if (config.pareto) {
      const values = data.map(r => parseFloat(r[config.pareto]) || 0);
      results.pareto = AdvancedAnalytics.paretoAnalysis(values);
    }
    
    // Seasonality Detection
    if (config.seasonality) {
      const { column, maxLag } = config.seasonality;
      const values = data.map(r => parseFloat(r[column]) || 0);
      results.seasonality = AdvancedAnalytics.seasonality(values, maxLag || 12);
    }
    
    return results;
  }

  applyFilters(data, filters) {
    if (!filters) return data;
    
    return data.filter(row => {
      for (const [col, values] of Object.entries(filters)) {
        if (Array.isArray(values)) {
          if (!values.includes(row[col])) return false;
        } else if (typeof values === 'object') {
          // Range filter
          if (values.min !== undefined && row[col] < values.min) return false;
          if (values.max !== undefined && row[col] > values.max) return false;
        }
      }
      return true;
    });
  }

  processGroupBy(data, query) {
    const groups = new Map();
    const groupCols = query.groupBy;
    
    for (const row of data) {
      const key = groupCols.map(c => row[c]).join('|');
      if (!groups.has(key)) {
        groups.set(key, { key: {}, rows: [] });
        groupCols.forEach(c => groups.get(key).key[c] = row[c]);
      }
      groups.get(key).rows.push(row);
    }
    
    return Array.from(groups.values()).map(g => {
      const result = { ...g.key };
      if (query.measures) {
        for (const measure of query.measures) {
          result[measure] = this.calculateMeasure(g.rows, measure);
        }
      }
      return result;
    });
  }

  calculateMeasure(data, measure) {
    const match = measure.match(/(\w+)\((\w+)\)/);
    if (!match) return null;
    
    const [, func, col] = match;
    const values = data.map(r => parseFloat(r[col]) || 0);
    
    switch (func.toUpperCase()) {
      case 'SUM':
        return values.reduce((a, b) => a + b, 0);
      case 'COUNT':
        return values.length;
      case 'AVG':
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      case 'MIN':
        return Math.min(...values);
      case 'MAX':
        return Math.max(...values);
      case 'VARIANCE':
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
      case 'STDDEV':
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
      default:
        return null;
    }
  }

  processTimeIntelligence(data, query) {
    const { timeIntelligence } = query;
    const dateCol = timeIntelligence.dateColumn;
    const type = timeIntelligence.type;
    
    // Sort by date
    const sorted = [...data].sort((a, b) => 
      new Date(a[dateCol]) - new Date(b[dateCol])
    );
    
    switch (type) {
      case 'mom': // Month over Month
        return this.calculateMoM(sorted, query);
      case 'yoy': // Year over Year
        return this.calculateYoY(sorted, query);
      case 'rolling':
        return this.calculateRollingAvg(sorted, query, timeIntelligence.window || 3);
      case 'trend':
        return this.detectTrend(sorted, query);
      default:
        return null;
    }
  }

  calculateMoM(data, query) {
    // Group by month and calculate change
    const byMonth = new Map();
    for (const row of data) {
      const date = new Date(row[query.timeIntelligence.dateColumn]);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key).push(row);
    }
    
    const results = [];
    const months = Array.from(byMonth.keys()).sort();
    
    for (let i = 1; i < months.length; i++) {
      const curr = this.calculateMeasure(byMonth.get(months[i]), query.measures[0]);
      const prev = this.calculateMeasure(byMonth.get(months[i-1]), query.measures[0]);
      results.push({
        period: months[i],
        value: curr,
        change: prev ? ((curr - prev) / prev * 100).toFixed(2) : 0
      });
    }
    return results;
  }

  calculateYoY(data, query) {
    const byYear = new Map();
    for (const row of data) {
      const year = new Date(row[query.timeIntelligence.dateColumn]).getFullYear();
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(row);
    }
    
    const results = [];
    const years = Array.from(byYear.keys()).sort();
    
    for (let i = 1; i < years.length; i++) {
      const curr = this.calculateMeasure(byYear.get(years[i]), query.measures[0]);
      const prev = this.calculateMeasure(byYear.get(years[i-1]), query.measures[0]);
      results.push({
        year: years[i],
        value: curr,
        change: prev ? ((curr - prev) / prev * 100).toFixed(2) : 0
      });
    }
    return results;
  }

  calculateRollingAvg(data, query, window) {
    const results = [];
    const measure = query.measures[0];
    
    for (let i = window - 1; i < data.length; i++) {
      const windowData = data.slice(i - window + 1, i + 1);
      results.push({
        index: i,
        value: this.calculateMeasure(windowData, measure)
      });
    }
    return results;
  }

  detectTrend(data, query) {
    const values = data.map(r => this.calculateMeasure([r], query.measures[0]));
    const n = values.length;
    
    // Linear regression
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return {
      direction: slope > 0.01 ? 'up' : slope < -0.01 ? 'down' : 'stable',
      slope: slope.toFixed(4)
    };
  }

  calculateKPIs(measures, kpiDefs) {
    return kpiDefs.map(kpi => {
      const value = measures[kpi.measure];
      let status = 'green';
      
      if (value < kpi.thresholds.red) status = 'red';
      else if (value < kpi.thresholds.yellow) status = 'yellow';
      
      return { name: kpi.name, value, status, target: kpi.target };
    });
  }

  calculateHistogram(data, config) {
    const col = config.column;
    const bins = config.bins || 10;
    const values = data.map(r => parseFloat(r[col]) || 0);
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const histogram = Array(bins).fill(0);
    for (const v of values) {
      const idx = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      histogram[idx]++;
    }
    
    return {
      bins: histogram,
      min, max, binWidth,
      percentiles: {
        p50: this.percentile(values, 50),
        p90: this.percentile(values, 90),
        p99: this.percentile(values, 99)
      }
    };
  }

  percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b);
    const idx = Math.ceil(p / 100 * sorted.length) - 1;
    return sorted[idx];
  }

  parseResult(output) {
    const results = { measures: {}, kpis: [], histogram: null };
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('MEASURE=')) {
        const match = line.match(/MEASURE=(\w+)\s+VALUE=([0-9.-]+)/);
        if (match) results.measures[match[1]] = parseFloat(match[2]);
      } else if (line.startsWith('KPI=')) {
        results.kpis.push(line.replace('KPI=', ''));
      } else if (line.startsWith('HISTOGRAM=')) {
        results.histogram = line.replace('HISTOGRAM=', '').split(',').map(Number);
      }
    }
    
    return results;
  }

  cleanup(files) {
    for (const file of files) {
      try { fs.unlinkSync(file); } catch (e) {}
    }
  }
}

module.exports = new MIPSEngine();
