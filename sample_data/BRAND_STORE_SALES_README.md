# Brand Store Sales Dataset

## Overview
This comprehensive dataset contains **5,000 sales transactions** from a multi-location brand retail store chain spanning **2 years** (2022-2023). The dataset is designed to test all features of the AsmBI Business Intelligence platform.

## Dataset Statistics
- **Total Records**: 5,000 transactions
- **Date Range**: January 1, 2022 - December 31, 2023
- **Total Columns**: 32 fields
- **File Format**: CSV (Excel-compatible)
- **File Location**: `sample_data/brand_store_sales.csv`

## Store Network
- **20 Store Locations** across 5 US regions:
  - Northeast: New York, Boston, Philadelphia
  - Southeast: Miami, Atlanta, Orlando, Tampa
  - Midwest: Chicago, Denver
  - Southwest: Houston, Dallas, San Antonio, Phoenix, Austin, Las Vegas
  - West: Los Angeles, San Diego, San Jose, Seattle, Portland

## Product Categories (10)
1. **Electronics** - Smartphones, Laptops, Tablets, Smartwatches, etc.
2. **Clothing** - T-Shirts, Jeans, Dresses, Jackets, etc.
3. **Footwear** - Sneakers, Boots, Sandals, Heels, etc.
4. **Accessories** - Watches, Sunglasses, Wallets, Handbags, etc.
5. **Home & Living** - Bedding, Lamps, Rugs, Wall Art, etc.
6. **Beauty & Personal Care** - Perfumes, Skincare, Makeup, etc.
7. **Sports & Outdoors** - Yoga Mats, Bicycles, Camping Gear, etc.
8. **Books & Media** - Novels, Magazines, Cookbooks, etc.
9. **Toys & Games** - Board Games, Puzzles, Action Figures, etc.
10. **Jewelry** - Necklaces, Bracelets, Earrings, Rings, etc.

## Column Descriptions

### Transaction Information
- **Transaction_ID**: Unique transaction identifier (TXN000001 - TXN005000)
- **Date**: Transaction date (YYYY-MM-DD format)
- **Time**: Transaction time (HH:MM:SS format)

### Location Data
- **Store_Name**: Name of the retail location
- **Store_ID**: Unique store identifier (ST001 - ST020)
- **Region**: Geographic region (Northeast, Southeast, Midwest, Southwest, West)

### Product Information
- **Category**: Product category
- **Product_Name**: Specific product name
- **Brand**: Brand name (10 premium brands)
- **SKU**: Stock Keeping Unit identifier

### Sales Metrics
- **Quantity**: Number of units sold (1-5)
- **Unit_Price**: Price per unit ($10 - $5,000 depending on category)
- **Subtotal**: Quantity × Unit Price
- **Discount_Percent**: Discount percentage (0%, 5%, 10%, 15%, 20%, 25%, 30%)
- **Discount_Amount**: Dollar amount of discount
- **Tax_Rate**: Sales tax rate (8%)
- **Tax_Amount**: Dollar amount of tax
- **Total_Amount**: Final transaction amount

### Financial Metrics
- **Cost_Per_Unit**: Cost to store per unit (60-80% of unit price)
- **Total_Cost**: Total cost of goods sold
- **Profit**: Total Amount - Total Cost
- **Profit_Margin**: Profit as percentage of Total Amount

### Customer & Channel Data
- **Payment_Method**: Credit Card, Debit Card, Cash, Digital Wallet, Gift Card, Buy Now Pay Later
- **Customer_Type**: Regular, VIP, New, Returning, Member
- **Customer_ID**: Unique customer identifier (CUST1000 - CUST9999)
- **Sales_Channel**: In-Store, Online, Mobile App, Phone Order
- **Sales_Rep_ID**: Sales representative identifier (REP100 - REP999)

### Marketing & Operations
- **Promotion_Code**: Applied promotion (NONE, SUMMER20, WINTER25, FLASH15, VIP30, NEWCUST10)
- **Shipping_Cost**: Shipping cost for online orders ($0 - $25)
- **Return_Status**: Whether item was returned (Yes/No) - ~11% return rate
- **Customer_Rating**: Customer satisfaction rating (1-5 stars)
- **Inventory_Status**: Stock status (In Stock, Low Stock, Out of Stock)

## Use Cases for Testing AsmBI Features

### 1. Data Upload & Schema Detection
- Test CSV upload functionality
- Verify automatic schema inference for 32 columns
- Check data type detection (dates, numbers, strings)

### 2. Aggregation Functions
- **SUM**: Total sales, total profit, total quantity
- **AVG**: Average transaction value, average profit margin
- **COUNT**: Number of transactions, unique customers
- **MIN/MAX**: Price ranges, date ranges
- **MEDIAN**: Median transaction value

### 3. Group By Analysis
- Sales by Store/Region
- Sales by Category/Product
- Sales by Brand
- Sales by Date (daily, monthly, yearly trends)
- Sales by Customer Type
- Sales by Sales Channel
- Sales by Payment Method

### 4. Advanced Analytics
- **Correlation**: Price vs Quantity, Discount vs Sales
- **Regression**: Predict sales based on variables
- **Growth Analysis**: Year-over-year growth, month-over-month trends
- **Forecasting**: Predict future sales
- **Quartiles**: Identify top/bottom performers
- **Normalization**: Compare metrics across different scales

### 5. Dashboard Visualizations
- **Bar Charts**: Sales by category, store performance
- **Line Charts**: Sales trends over time
- **Pie Charts**: Market share by brand, category distribution
- **Area Charts**: Cumulative sales growth
- **KPI Cards**: Total revenue, profit margin, transaction count
- **Heatmaps**: Sales by store and time period

### 6. Filtering & Drill-Down
- Filter by date range
- Filter by region/store
- Filter by category/brand
- Filter by customer type
- Multi-dimensional filtering

### 7. Performance Testing
- Query performance with 5,000 records
- MIPS assembly computation speed
- Real-time aggregation performance
- Chart rendering performance

## Sample Insights to Discover

1. **Top Performing Stores**: Which locations generate the most revenue?
2. **Best-Selling Categories**: Which product categories are most popular?
3. **Seasonal Trends**: How do sales vary by month/season?
4. **Profit Margins**: Which categories/brands have the highest margins?
5. **Customer Behavior**: How do VIP customers differ from regular customers?
6. **Channel Performance**: Online vs In-Store sales comparison
7. **Promotion Effectiveness**: Which promotion codes drive the most sales?
8. **Return Analysis**: Which products/categories have highest return rates?
9. **Regional Differences**: How do sales patterns vary by region?
10. **Price Sensitivity**: Impact of discounts on sales volume

## Data Quality
- No missing values
- Realistic price ranges by category
- Logical relationships (subtotal = unit_price × quantity)
- Proper date/time formatting
- Consistent ID formats
- Realistic discount and tax calculations

## Getting Started
1. Navigate to the Upload page in AsmBI
2. Upload `brand_store_sales.csv`
3. Verify schema detection (32 columns)
4. Start building dashboards and running analytics!

---
**Generated**: January 2025
**Purpose**: Comprehensive testing of AsmBI features
**Data Type**: Synthetic but realistic retail sales data
