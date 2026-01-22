# AsmBI Testing Guide with Brand Store Sales Dataset

## 🎯 Quick Start

### Step 1: Upload the Dataset
1. Start the AsmBI application (backend and frontend)
2. Navigate to **Upload Data** page
3. Upload `sample_data/brand_store_sales.csv`
4. Verify schema detection shows **32 columns**
5. Confirm **5,000 rows** were imported

### Step 2: Explore Data Model
1. Go to **Data Model** page
2. Select "brand_store_sales" dataset
3. Review the schema:
   - **Measures** (numeric): Unit_Price, Quantity, Total_Amount, Profit, etc.
   - **Dimensions** (categorical): Store_Name, Category, Brand, Region, etc.
   - **Dates**: Date field for time-series analysis

## 📊 Feature Testing Scenarios

### 1. Basic Aggregations (Report Builder)

#### Test Case 1.1: Total Revenue by Category
- **Measures**: SUM(Total_Amount)
- **Group By**: Category
- **Chart Type**: Bar Chart
- **Expected**: See 10 categories with Electronics and Jewelry having highest values

#### Test Case 1.2: Average Transaction Value by Store
- **Measures**: AVG(Total_Amount)
- **Group By**: Store_Name
- **Chart Type**: Bar Chart
- **Expected**: 20 stores with varying average values

#### Test Case 1.3: Sales Count by Region
- **Measures**: COUNT(Transaction_ID)
- **Group By**: Region
- **Chart Type**: Pie Chart
- **Expected**: 5 regions with relatively even distribution (~20% each)

### 2. Multi-Dimensional Analysis

#### Test Case 2.1: Revenue by Category and Region
- **Measures**: SUM(Total_Amount)
- **Group By**: Category, Region
- **Expected**: 50 combinations (10 categories × 5 regions)

#### Test Case 2.2: Profit Analysis by Brand and Channel
- **Measures**: SUM(Profit), AVG(Profit_Margin)
- **Group By**: Brand, Sales_Channel
- **Expected**: 40 combinations showing profitability patterns

### 3. Time-Series Analysis

#### Test Case 3.1: Monthly Sales Trend
- **Measures**: SUM(Total_Amount)
- **Group By**: Date (by month)
- **Chart Type**: Line Chart
- **Expected**: 24 months of data showing trends

#### Test Case 3.2: Daily Transaction Volume
- **Measures**: COUNT(Transaction_ID)
- **Group By**: Date
- **Chart Type**: Area Chart
- **Expected**: 730 days of transaction patterns

### 4. Advanced Analytics

#### Test Case 4.1: Correlation Analysis
- **Page**: Analytics
- **Operation**: Correlation
- **Columns**: Unit_Price, Quantity
- **Expected**: Negative correlation (higher price = lower quantity)

#### Test Case 4.2: Price Statistics by Category
- **Page**: Analytics
- **Operation**: Descriptive Statistics
- **Column**: Unit_Price
- **Group By**: Category
- **Expected**: Mean, median, std dev for each category

#### Test Case 4.3: Sales Forecasting
- **Page**: Analytics
- **Operation**: Forecast
- **Column**: Total_Amount
- **Expected**: Predicted future sales values

#### Test Case 4.4: Growth Analysis
- **Page**: Analytics
- **Operation**: Growth Analysis
- **Column**: Total_Amount
- **Expected**: CAGR and growth rates over time

### 5. Dashboard Creation

#### Test Case 5.1: Executive Dashboard
Create a dashboard with:
- **KPI Cards**: Total Revenue, Total Profit, Avg Transaction, Return Rate
- **Bar Chart**: Top 10 Products by Revenue
- **Line Chart**: Monthly Sales Trend
- **Pie Chart**: Sales by Channel
- **Table**: Top Performing Stores

#### Test Case 5.2: Category Performance Dashboard
- **KPI Cards**: Category Count, Avg Price, Total Units Sold
- **Bar Chart**: Revenue by Category
- **Heatmap**: Category × Region Performance
- **Gauge**: Profit Margin by Category

#### Test Case 5.3: Store Operations Dashboard
- **Map/Table**: Store Locations and Performance
- **Bar Chart**: Transactions by Store
- **Line Chart**: Store Performance Over Time
- **KPI Cards**: Best/Worst Performing Stores

### 6. Filtering & Drill-Down

#### Test Case 6.1: Date Range Filtering
- Filter data to Q1 2023 (Jan-Mar 2023)
- Compare metrics to Q1 2022
- **Expected**: Subset of data with date-specific insights

#### Test Case 6.2: Category Deep Dive
- Filter to "Electronics" category only
- Analyze by Brand and Store
- **Expected**: Electronics-specific patterns

#### Test Case 6.3: VIP Customer Analysis
- Filter Customer_Type = "VIP"
- Compare to "Regular" customers
- **Expected**: Higher average transaction values for VIP

### 7. Performance Testing

#### Test Case 7.1: Large Aggregation Query
- **Measures**: SUM(Total_Amount), SUM(Profit), COUNT(*)
- **Group By**: Store_Name, Category, Brand
- **Expected**: Fast execution (<1 second) with MIPS engine

#### Test Case 7.2: Complex Multi-Measure Query
- **Measures**: SUM, AVG, MIN, MAX, COUNT for multiple columns
- **Group By**: Multiple dimensions
- **Expected**: Efficient MIPS assembly computation

## 🔍 Specific Insights to Discover

### Business Questions to Answer:

1. **Which store generates the most revenue?**
   - Use: SUM(Total_Amount) GROUP BY Store_Name

2. **What's the most profitable product category?**
   - Use: SUM(Profit), AVG(Profit_Margin) GROUP BY Category

3. **How do online sales compare to in-store?**
   - Use: SUM(Total_Amount) GROUP BY Sales_Channel

4. **Which brands have the highest return rates?**
   - Use: COUNT(*) WHERE Return_Status='Yes' GROUP BY Brand

5. **What's the impact of discounts on sales volume?**
   - Use: Correlation between Discount_Percent and Quantity

6. **Which payment method is most popular?**
   - Use: COUNT(*) GROUP BY Payment_Method

7. **How do customer ratings vary by category?**
   - Use: AVG(Customer_Rating) GROUP BY Category

8. **What's the seasonal sales pattern?**
   - Use: SUM(Total_Amount) GROUP BY Month

9. **Which region has the highest profit margin?**
   - Use: AVG(Profit_Margin) GROUP BY Region

10. **What's the average transaction value by customer type?**
    - Use: AVG(Total_Amount) GROUP BY Customer_Type

## 🎨 Visualization Recommendations

### Best Chart Types for Each Analysis:

- **Revenue/Sales Trends**: Line Chart or Area Chart
- **Category Comparison**: Bar Chart or Column Chart
- **Market Share**: Pie Chart or Donut Chart
- **Store Performance**: Horizontal Bar Chart
- **Time Series**: Line Chart with multiple series
- **Distribution**: Histogram or Box Plot
- **Correlation**: Scatter Plot or Heatmap
- **KPIs**: Card/Number widgets with trend indicators

## ✅ Expected Results Summary

### Dataset Totals:
- **Total Revenue**: ~$7.2M
- **Total Profit**: ~$1.9M
- **Average Transaction**: ~$1,442
- **Average Profit Margin**: ~25.3%
- **Return Rate**: ~11.4%
- **Transaction Count**: 5,000

### Distribution:
- **Categories**: Evenly distributed (~10% each)
- **Regions**: Evenly distributed (~20% each)
- **Channels**: Evenly distributed (~25% each)
- **Customer Types**: Evenly distributed (~20% each)

### Price Ranges:
- **Lowest**: Books & Media ($10-$50)
- **Highest**: Jewelry ($100-$5,000)
- **Mid-Range**: Electronics ($200-$2,000)

## 🐛 Testing Checklist

- [ ] CSV upload successful
- [ ] Schema correctly detected (32 columns)
- [ ] All 5,000 rows imported
- [ ] Numeric columns recognized as measures
- [ ] String columns recognized as dimensions
- [ ] Date column parsed correctly
- [ ] Basic aggregations work (SUM, AVG, COUNT)
- [ ] Group By functionality works
- [ ] Multiple measures in single query
- [ ] Charts render correctly
- [ ] Filters apply properly
- [ ] Dashboard creation works
- [ ] Advanced analytics execute
- [ ] MIPS engine performs calculations
- [ ] Export functionality works
- [ ] Performance is acceptable (<1s for most queries)

## 📝 Notes

- The dataset is synthetic but realistic
- All calculations are mathematically correct
- No missing or null values
- Consistent data types throughout
- Suitable for production-level testing
- Can be used for demos and presentations

---

**Happy Testing! 🚀**
