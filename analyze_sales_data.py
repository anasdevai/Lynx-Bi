import csv
from collections import Counter
from datetime import datetime

# Read the data
data = []
with open('sample_data/brand_store_sales.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    data = list(reader)

print("=" * 70)
print("BRAND STORE SALES DATASET - QUICK ANALYSIS")
print("=" * 70)
print(f"\n📊 DATASET OVERVIEW")
print(f"   Total Transactions: {len(data):,}")
print(f"   Total Columns: {len(data[0].keys())}")
print(f"   File Size: 1.19 MB")

# Financial Summary
total_revenue = sum(float(row['Total_Amount']) for row in data)
total_profit = sum(float(row['Profit']) for row in data)
avg_transaction = total_revenue / len(data)
avg_profit_margin = sum(float(row['Profit_Margin']) for row in data) / len(data)

print(f"\n💰 FINANCIAL SUMMARY")
print(f"   Total Revenue: ${total_revenue:,.2f}")
print(f"   Total Profit: ${total_profit:,.2f}")
print(f"   Average Transaction: ${avg_transaction:,.2f}")
print(f"   Average Profit Margin: {avg_profit_margin:.2f}%")

# Category Analysis
categories = Counter(row['Category'] for row in data)
print(f"\n📦 TOP 5 CATEGORIES BY TRANSACTION COUNT")
for cat, count in categories.most_common(5):
    pct = (count / len(data)) * 100
    print(f"   {cat:.<30} {count:>4} ({pct:>5.1f}%)")

# Store Performance
stores = Counter(row['Store_Name'] for row in data)
print(f"\n🏪 TOP 5 STORES BY TRANSACTION COUNT")
for store, count in stores.most_common(5):
    pct = (count / len(data)) * 100
    print(f"   {store:.<30} {count:>4} ({pct:>5.1f}%)")

# Region Analysis
regions = Counter(row['Region'] for row in data)
print(f"\n🗺️  SALES BY REGION")
for region, count in sorted(regions.items(), key=lambda x: x[1], reverse=True):
    pct = (count / len(data)) * 100
    print(f"   {region:.<30} {count:>4} ({pct:>5.1f}%)")

# Channel Analysis
channels = Counter(row['Sales_Channel'] for row in data)
print(f"\n📱 SALES BY CHANNEL")
for channel, count in sorted(channels.items(), key=lambda x: x[1], reverse=True):
    pct = (count / len(data)) * 100
    print(f"   {channel:.<30} {count:>4} ({pct:>5.1f}%)")

# Customer Type
customer_types = Counter(row['Customer_Type'] for row in data)
print(f"\n👥 CUSTOMER TYPE DISTRIBUTION")
for ctype, count in sorted(customer_types.items(), key=lambda x: x[1], reverse=True):
    pct = (count / len(data)) * 100
    print(f"   {ctype:.<30} {count:>4} ({pct:>5.1f}%)")

# Payment Methods
payments = Counter(row['Payment_Method'] for row in data)
print(f"\n💳 PAYMENT METHOD DISTRIBUTION")
for payment, count in sorted(payments.items(), key=lambda x: x[1], reverse=True):
    pct = (count / len(data)) * 100
    print(f"   {payment:.<30} {count:>4} ({pct:>5.1f}%)")

# Returns
returns = Counter(row['Return_Status'] for row in data)
return_rate = (returns['Yes'] / len(data)) * 100
print(f"\n🔄 RETURN ANALYSIS")
print(f"   Total Returns: {returns['Yes']:,}")
print(f"   Return Rate: {return_rate:.2f}%")

# Date Range
dates = [datetime.strptime(row['Date'], '%Y-%m-%d') for row in data]
min_date = min(dates)
max_date = max(dates)
print(f"\n📅 DATE RANGE")
print(f"   From: {min_date.strftime('%B %d, %Y')}")
print(f"   To: {max_date.strftime('%B %d, %Y')}")
print(f"   Duration: {(max_date - min_date).days} days")

# Price Ranges by Category
print(f"\n💵 PRICE RANGES BY CATEGORY")
cat_prices = {}
for row in data:
    cat = row['Category']
    price = float(row['Unit_Price'])
    if cat not in cat_prices:
        cat_prices[cat] = []
    cat_prices[cat].append(price)

for cat in sorted(cat_prices.keys()):
    prices = cat_prices[cat]
    print(f"   {cat:.<30} ${min(prices):>7.2f} - ${max(prices):>7.2f}")

print("\n" + "=" * 70)
print("✅ Dataset is ready for analysis in AsmBI!")
print("=" * 70)
