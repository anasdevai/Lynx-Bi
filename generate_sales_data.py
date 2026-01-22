import csv
import random
from datetime import datetime, timedelta

# Configuration
num_records = 5000
start_date = datetime(2022, 1, 1)

# Data pools
stores = ['New York Flagship', 'Los Angeles Downtown', 'Chicago Magnificent Mile', 'Miami Beach', 'Houston Galleria', 
          'Phoenix Fashion Square', 'Philadelphia Center City', 'San Antonio Riverwalk', 'San Diego Gaslamp', 
          'Dallas NorthPark', 'San Jose Valley Fair', 'Austin Domain', 'Seattle Pike Place', 'Denver Cherry Creek',
          'Boston Newbury Street', 'Portland Pearl District', 'Las Vegas Strip', 'Atlanta Buckhead', 
          'Orlando Mall', 'Tampa Bay Street']

categories = ['Electronics', 'Clothing', 'Footwear', 'Accessories', 'Home & Living', 'Beauty & Personal Care', 
              'Sports & Outdoors', 'Books & Media', 'Toys & Games', 'Jewelry']

products = {
    'Electronics': ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Headphones', 'Camera', 'Gaming Console', 'Smart TV'],
    'Clothing': ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Shirt', 'Pants', 'Skirt'],
    'Footwear': ['Sneakers', 'Boots', 'Sandals', 'Heels', 'Loafers', 'Running Shoes', 'Dress Shoes'],
    'Accessories': ['Watch', 'Sunglasses', 'Belt', 'Wallet', 'Handbag', 'Backpack', 'Scarf', 'Hat'],
    'Home & Living': ['Bedding Set', 'Lamp', 'Cushion', 'Rug', 'Wall Art', 'Vase', 'Mirror', 'Clock'],
    'Beauty & Personal Care': ['Perfume', 'Skincare Set', 'Makeup Kit', 'Hair Dryer', 'Shampoo', 'Body Lotion'],
    'Sports & Outdoors': ['Yoga Mat', 'Dumbbell Set', 'Bicycle', 'Tennis Racket', 'Camping Tent', 'Hiking Boots'],
    'Books & Media': ['Novel', 'Magazine', 'Cookbook', 'Biography', 'Comic Book', 'Audio Book'],
    'Toys & Games': ['Board Game', 'Action Figure', 'Puzzle', 'Doll', 'Building Blocks', 'Video Game'],
    'Jewelry': ['Necklace', 'Bracelet', 'Earrings', 'Ring', 'Pendant', 'Brooch']
}

brands = ['Premium Brand A', 'Luxury Brand B', 'Designer Brand C', 'Classic Brand D', 'Modern Brand E', 
          'Elite Brand F', 'Signature Brand G', 'Heritage Brand H', 'Contemporary Brand I', 'Exclusive Brand J']

payment_methods = ['Credit Card', 'Debit Card', 'Cash', 'Digital Wallet', 'Gift Card', 'Buy Now Pay Later']
customer_types = ['Regular', 'VIP', 'New', 'Returning', 'Member']
regions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West']
sales_channels = ['In-Store', 'Online', 'Mobile App', 'Phone Order']

# Generate data
data = []
for i in range(num_records):
    date = start_date + timedelta(days=random.randint(0, 730))
    store = random.choice(stores)
    category = random.choice(categories)
    product = random.choice(products[category])
    brand = random.choice(brands)
    
    base_prices = {
        'Electronics': (200, 2000), 'Clothing': (20, 200), 'Footwear': (40, 300),
        'Accessories': (30, 500), 'Home & Living': (25, 400), 'Beauty & Personal Care': (15, 150),
        'Sports & Outdoors': (30, 800), 'Books & Media': (10, 50), 'Toys & Games': (15, 100),
        'Jewelry': (100, 5000)
    }
    
    unit_price = round(random.uniform(*base_prices[category]), 2)
    quantity = random.randint(1, 5)
    subtotal = round(unit_price * quantity, 2)
    discount_percent = random.choice([0, 0, 0, 5, 10, 15, 20, 25, 30])
    discount_amount = round(subtotal * discount_percent / 100, 2)
    tax_rate = 0.08
    tax_amount = round((subtotal - discount_amount) * tax_rate, 2)
    total_amount = round(subtotal - discount_amount + tax_amount, 2)
    cost_per_unit = round(unit_price * random.uniform(0.6, 0.8), 2)
    total_cost = round(cost_per_unit * quantity, 2)
    profit = round(total_amount - total_cost, 2)
    profit_margin = round((profit / total_amount * 100) if total_amount > 0 else 0, 2)
    
    record = {
        'Transaction_ID': f'TXN{str(i+1).zfill(6)}',
        'Date': date.strftime('%Y-%m-%d'),
        'Time': f'{random.randint(9, 21):02d}:{random.randint(0, 59):02d}:{random.randint(0, 59):02d}',
        'Store_Name': store,
        'Store_ID': f'ST{stores.index(store)+1:03d}',
        'Region': random.choice(regions),
        'Category': category,
        'Product_Name': product,
        'Brand': brand,
        'SKU': f'{category[:3].upper()}{random.randint(1000, 9999)}',
        'Quantity': quantity,
        'Unit_Price': unit_price,
        'Subtotal': subtotal,
        'Discount_Percent': discount_percent,
        'Discount_Amount': discount_amount,
        'Tax_Rate': tax_rate,
        'Tax_Amount': tax_amount,
        'Total_Amount': total_amount,
        'Cost_Per_Unit': cost_per_unit,
        'Total_Cost': total_cost,
        'Profit': profit,
        'Profit_Margin': profit_margin,
        'Payment_Method': random.choice(payment_methods),
        'Customer_Type': random.choice(customer_types),
        'Customer_ID': f'CUST{random.randint(1000, 9999)}',
        'Sales_Channel': random.choice(sales_channels),
        'Sales_Rep_ID': f'REP{random.randint(100, 999)}',
        'Promotion_Code': random.choice(['NONE', 'NONE', 'NONE', 'SUMMER20', 'WINTER25', 'FLASH15', 'VIP30', 'NEWCUST10']),
        'Shipping_Cost': round(random.uniform(0, 25), 2) if random.choice(sales_channels) in ['Online', 'Mobile App', 'Phone Order'] else 0,
        'Return_Status': random.choice(['No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Yes']),
        'Customer_Rating': random.randint(1, 5),
        'Inventory_Status': random.choice(['In Stock', 'In Stock', 'In Stock', 'Low Stock', 'Out of Stock'])
    }
    data.append(record)

# Write to CSV
with open('sample_data/brand_store_sales.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)

print(f'Successfully created brand_store_sales.csv with {num_records} records')
print(f'Columns: {len(data[0].keys())}')
print(f'Date range: 2022-01-01 to 2023-12-31')
