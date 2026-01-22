const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class DataParser {
  async parse(filePath, originalName) {
    const ext = path.extname(originalName).toLowerCase();
    
    let rawData;
    if (ext === '.csv' || ext === '.txt') {
      rawData = this.parseCSV(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
      rawData = this.parseExcel(filePath);
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }
    
    const schema = this.inferSchema(rawData);
    const data = this.convertData(rawData, schema);
    
    return { data, schema, preview: data };
  }

  parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) throw new Error('Empty file');
    
    // Detect delimiter
    const delimiter = this.detectDelimiter(lines[0]);
    const headers = this.parseCSVLine(lines[0], delimiter);
    
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i], delimiter);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((h, idx) => row[h] = values[idx]);
        rows.push(row);
      }
    }
    
    return { headers, rows };
  }

  parseCSVLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  detectDelimiter(line) {
    const delimiters = [',', ';', '\t', '|'];
    let maxCount = 0;
    let bestDelimiter = ',';
    
    for (const d of delimiters) {
      const count = (line.match(new RegExp(`\\${d}`, 'g')) || []).length;
      if (count > maxCount) {
        maxCount = count;
        bestDelimiter = d;
      }
    }
    return bestDelimiter;
  }

  parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    if (jsonData.length === 0) throw new Error('Empty spreadsheet');
    
    const headers = jsonData[0].map(h => String(h || 'Column'));
    const rows = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = jsonData[i][idx] !== undefined ? jsonData[i][idx] : null;
      });
      rows.push(row);
    }
    
    return { headers, rows };
  }

  inferSchema(rawData) {
    const { headers, rows } = rawData;
    const columns = headers.map(name => {
      const values = rows.map(r => r[name]).filter(v => v !== null && v !== '');
      const type = this.inferType(values);
      return { name, type, nullable: values.length < rows.length };
    });
    
    return { columns, rowCount: rows.length };
  }


  inferType(values) {
    if (values.length === 0) return 'string';
    
    let intCount = 0, floatCount = 0, dateCount = 0, stringCount = 0;
    
    for (const v of values.slice(0, 100)) { // Sample first 100
      const str = String(v).trim();
      
      if (/^-?\d+$/.test(str)) {
        intCount++;
      } else if (/^-?\d+\.?\d*$/.test(str) || /^-?\d*\.?\d+$/.test(str)) {
        floatCount++;
      } else if (this.isDate(str)) {
        dateCount++;
      } else {
        stringCount++;
      }
    }
    
    const total = values.slice(0, 100).length;
    if (intCount / total > 0.8) return 'integer';
    if ((intCount + floatCount) / total > 0.8) return 'float';
    if (dateCount / total > 0.8) return 'date';
    return 'string';
  }

  isDate(str) {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{2}-\d{2}-\d{4}$/,
      /^\d{4}\/\d{2}\/\d{2}$/
    ];
    return datePatterns.some(p => p.test(str)) || !isNaN(Date.parse(str));
  }

  convertData(rawData, schema) {
    const { rows } = rawData;
    return rows.map(row => {
      const converted = {};
      for (const col of schema.columns) {
        const val = row[col.name];
        converted[col.name] = this.convertValue(val, col.type);
      }
      return converted;
    });
  }

  convertValue(value, type) {
    if (value === null || value === '' || value === undefined) return null;
    
    switch (type) {
      case 'integer':
        const intVal = parseInt(value, 10);
        return isNaN(intVal) ? null : intVal;
      case 'float':
        const floatVal = parseFloat(value);
        return isNaN(floatVal) ? null : floatVal;
      case 'date':
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString();
      default:
        return String(value);
    }
  }
}

module.exports = DataParser;
