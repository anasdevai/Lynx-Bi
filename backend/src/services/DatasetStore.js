// In-memory dataset store (production would use database)
class DatasetStore {
  constructor() {
    this.datasets = new Map();
  }

  save(id, dataset) {
    this.datasets.set(id, dataset);
    return dataset;
  }

  get(id) {
    return this.datasets.get(id) || null;
  }

  list() {
    return Array.from(this.datasets.values());
  }

  delete(id) {
    return this.datasets.delete(id);
  }

  exists(id) {
    return this.datasets.has(id);
  }

  // Get columnar data for MIPS processing
  getColumnarData(id, columns) {
    const dataset = this.get(id);
    if (!dataset) return null;

    const columnar = {};
    for (const col of columns) {
      columnar[col] = dataset.data.map(row => row[col]);
    }
    return columnar;
  }

  // Get numeric columns only
  getNumericColumns(id) {
    const dataset = this.get(id);
    if (!dataset) return [];
    
    return dataset.schema.columns
      .filter(c => c.type === 'integer' || c.type === 'float')
      .map(c => c.name);
  }
}

module.exports = new DatasetStore();
