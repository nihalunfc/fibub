# Writes the starter notebook for the pandas capstone (Lesson 9.1):
# public/data/courses/pandas/retail-capstone.ipynb. Plain JSON, no Jupyter needed to build it.
# Run: python3 scripts/courses/pandas-notebook.py
import json, pathlib

def md(s): return {'cell_type': 'markdown', 'metadata': {}, 'source': s.strip('\n').splitlines(True)}
def code(s): return {'cell_type': 'code', 'metadata': {}, 'execution_count': None, 'outputs': [], 'source': s.strip('\n').splitlines(True)}

cells = [
md('''
# Retail sales analysis: what drives revenue, and where to act

*Starter notebook from the free fibub course "Python pandas for analysis" (fibub.com/learn/courses/pandas/).
The data is made up. Replace this line with your name and the date.*

**Question from the head of retail:** "Revenue is up in the first half of 2026, but not in every store. Where is the
growth coming from, where are we slipping, and what should we do in the second half?"

**Answer first (write this last):** three bullet points with numbers.
'''),
md('## 0. Setup\nDownload the CSV files from fibub.com/data/courses/pandas/ (orders, products, stores, customers) into a `data/` folder next to this notebook.'),
code('''
import pandas as pd
import numpy as np

orders = pd.read_csv('data/orders.csv', parse_dates=['date'])
products = pd.read_csv('data/products.csv')
stores = pd.read_csv('data/stores.csv', parse_dates=['opened'])
customers = pd.read_csv('data/customers.csv', parse_dates=['signup_date'])
'''),
md('## 1. Check the data\nRows, columns, types, missing values, duplicates, date range, impossible values. Write one line on what you found.'),
code('''
# TODO: shape, dtypes, isna().sum(), duplicated().sum(), date min/max, describe()
'''),
md('## 2. One clean table\nJoin products and stores onto the order lines. Check the row count does not change (Lesson 5.3). Add revenue, cost and margin.'),
code('''
full = (orders
        .merge(products[['product_id', 'category', 'cost']], on='product_id', how='left', validate='many_to_one')
        .merge(stores[['store_id', 'store', 'province', 'size']], on='store_id', how='left', validate='many_to_one'))
assert len(full) == len(orders)
# TODO: revenue = qty * unit_price * (1 - discount); margin = revenue - qty * cost
'''),
md('## 3. The headline: first half of 2026 against first half of 2025\nRevenue, orders, customers, AOV and margin %, for the whole chain (Lesson 8.2).'),
code('# TODO\n'),
md('## 4. Where: stores and categories\nWhich stores and categories grew or shrank (H1 2026 vs H1 2025)? A table plus one chart.'),
code('# TODO\n'),
md('## 5. When: the monthly trend\nMonthly revenue with year over year growth (Lesson 7.4). Is the flat half the season or a real change?'),
code('# TODO\n'),
md('## 6. What: products (Pareto / ABC)\nHow many products make 80 % of revenue? Are any A products shrinking? (Lesson 8.3)'),
code('# TODO\n'),
md('## 7. Who: customers (RFM and cohorts)\nSegments by recency, frequency and spend (Lesson 8.4) and a retention table (Lesson 8.5). How much revenue is At risk?'),
code('# TODO\n'),
md('## 8. Discounts\nDo discounted lines sell more units? What do they cost in margin?'),
code('# TODO\n'),
md('''
## 9. Recommendations
Three actions, each with the number behind it, what it could be worth, and how you would measure it (for example an A/B test, Statistics course Module 7).

## 10. Limits
What this data cannot tell you (no store traffic, no prices from competitors, made-up data).
'''),
]
nb = {'cells': cells, 'metadata': {'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'},
      'language_info': {'name': 'python'}}, 'nbformat': 4, 'nbformat_minor': 5}
for i, c in enumerate(nb['cells']): c['id'] = f'c{i:02d}'
out = pathlib.Path(__file__).resolve().parents[2] / 'public/data/courses/pandas/retail-capstone.ipynb'
out.write_text(json.dumps(nb, indent=1) + '\n')
print('wrote', out)
