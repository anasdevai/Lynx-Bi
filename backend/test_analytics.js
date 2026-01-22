/**
 * Test Analytics Engine
 * Run this to verify MIPS/JavaScript analytics are working
 */

const MIPSEngine = require('./src/services/MIPSEngine');

// Sample test data
const testData = [
  { sales: 100, profit: 20, region: 'East', month: 'Jan' },
  { sales: 200, profit: 40, region: 'West', month: 'Jan' },
  { sales: 150, profit: 30, region: 'East', month: 'Feb' },
  { sales: 250, profit: 50, region: 'West', month: 'Feb' },
  { sales: 180, profit: 35, region: 'East', month: 'Mar' },
  { sales: 220, profit: 45, region: 'West', month: 'Mar' },
];

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 Lynx BI Analytics Engine Test Suite');
  console.log('='.repeat(70) + '\n');

  // Test 1: Basic Aggregations
  console.log('📊 Test 1: Basic Aggregations');
  console.log('-'.repeat(70));
  try {
    const query1 = {
      measures: ['SUM(sales)', 'AVG(sales)', 'MIN(sales)', 'MAX(sales)', 'COUNT(sales)']
    };
    const result1 = await MIPSEngine.executeQuery(query1, testData);
    console.log('✅ Result:', JSON.stringify(result1.measures, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Group By
  console.log('\n📊 Test 2: Group By Region');
  console.log('-'.repeat(70));
  try {
    const query2 = {
      measures: ['SUM(sales)', 'AVG(profit)'],
      groupBy: ['region']
    };
    const result2 = await MIPSEngine.executeQuery(query2, testData);
    console.log('✅ Result:', JSON.stringify(result2.groups, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Filters
  console.log('\n📊 Test 3: Filters (sales > 150)');
  console.log('-'.repeat(70));
  try {
    const query3 = {
      measures: ['SUM(sales)', 'COUNT(sales)'],
      filters: {
        sales: { min: 150 }
      }
    };
    const result3 = await MIPSEngine.executeQuery(query3, testData);
    console.log('✅ Result:', JSON.stringify(result3.measures, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Advanced Analytics - Correlation
  console.log('\n📊 Test 4: Correlation (sales vs profit)');
  console.log('-'.repeat(70));
  try {
    const query4 = {
      measures: ['SUM(sales)'],
      advanced: {
        correlation: { xColumn: 'sales', yColumn: 'profit' }
      }
    };
    const result4 = await MIPSEngine.executeQuery(query4, testData);
    console.log('✅ Result:', JSON.stringify(result4.advanced, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 5: Time Intelligence - Rolling Average
  console.log('\n📊 Test 5: Rolling Average (window=2)');
  console.log('-'.repeat(70));
  try {
    const query5 = {
      measures: ['AVG(sales)'],
      timeIntelligence: {
        type: 'rolling',
        dateColumn: 'month',
        window: 2
      }
    };
    const result5 = await MIPSEngine.executeQuery(query5, testData);
    console.log('✅ Result:', JSON.stringify(result5.timeAnalysis, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 6: KPI Status
  console.log('\n📊 Test 6: KPI Status');
  console.log('-'.repeat(70));
  try {
    const query6 = {
      measures: ['SUM(sales)'],
      kpis: [{
        name: 'Total Sales',
        measure: 'SUM(sales)',
        target: 1000,
        thresholds: { yellow: 800, red: 600 }
      }]
    };
    const result6 = await MIPSEngine.executeQuery(query6, testData);
    console.log('✅ Result:', JSON.stringify(result6.kpis, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 7: Histogram
  console.log('\n📊 Test 7: Histogram');
  console.log('-'.repeat(70));
  try {
    const query7 = {
      measures: ['SUM(sales)'],
      histogram: { column: 'sales', bins: 5 }
    };
    const result7 = await MIPSEngine.executeQuery(query7, testData);
    console.log('✅ Result:', JSON.stringify(result7.histogram, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 8: Advanced - Forecast
  console.log('\n📊 Test 8: Forecast (3 periods)');
  console.log('-'.repeat(70));
  try {
    const query8 = {
      measures: ['SUM(sales)'],
      advanced: {
        forecast: { column: 'sales', periods: 3 }
      }
    };
    const result8 = await MIPSEngine.executeQuery(query8, testData);
    console.log('✅ Result:', JSON.stringify(result8.advanced.forecast, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ All tests completed!');
  console.log('='.repeat(70) + '\n');
}

// Run tests
runTests().catch(console.error);
