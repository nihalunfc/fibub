"""Make the made-up retail datasets for the pandas course (public/data/courses/pandas/).

Run: python3 scripts/courses/pandas-data.py
Everything is invented with a fixed seed, so the files (and the numbers quoted in lessons) never change.
"""
import csv, os, random, datetime as dt

random.seed(2026)
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'data', 'courses', 'pandas')
os.makedirs(OUT, exist_ok=True)

def write(name, header, rows):
    with open(os.path.join(OUT, name), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)

# Stores: a small chain in made-up places.
stores = [
    ('S01', 'Harbourview', 'Ontario', 'large', '2015-04-01'),
    ('S02', 'Maple Ridge', 'Ontario', 'medium', '2017-09-15'),
    ('S03', 'Cedar Falls', 'Ontario', 'small', '2019-03-01'),
    ('S04', 'Pine Lake', 'Quebec', 'medium', '2018-06-01'),
    ('S05', 'Riverside', 'British Columbia', 'large', '2016-11-01'),
    ('S06', 'Elm Grove', 'Alberta', 'small', '2021-02-01'),
    ('WEB', 'Online', 'All', 'online', '2020-05-01'),
]
write('stores.csv', ['store_id', 'store', 'province', 'size', 'opened'], stores)

# Products: category, name, price and cost.
cats = {
    'Grocery': [('Coffee beans 1 kg', 18.99), ('Olive oil 1 L', 12.49), ('Pasta 500 g', 2.29), ('Granola 750 g', 6.99), ('Tea 100 bags', 7.49), ('Rice 2 kg', 5.99), ('Maple syrup 500 ml', 11.99), ('Dark chocolate', 3.49)],
    'Household': [('Laundry pods 40', 16.99), ('Paper towels 6', 9.99), ('Dish soap', 3.99), ('Trash bags 50', 8.49), ('Sponges 6', 4.29), ('All-purpose cleaner', 4.99)],
    'Electronics': [('USB-C cable', 14.99), ('Wireless earbuds', 59.99), ('Phone charger', 24.99), ('Bluetooth speaker', 49.99), ('Power bank', 34.99), ('Smart bulb', 19.99)],
    'Home': [('Bath towel', 17.99), ('Throw blanket', 29.99), ('Mug set 4', 24.99), ('Candle', 12.99), ('Cushion', 19.99), ('Storage box', 14.99)],
    'Personal care': [('Shampoo', 7.99), ('Toothpaste', 3.49), ('Body wash', 6.49), ('Sunscreen', 13.99), ('Hand cream', 5.99), ('Razor pack', 15.99)],
}
products = []
pid = 100
for cat, items in cats.items():
    margin = {'Grocery': 0.28, 'Household': 0.33, 'Electronics': 0.38, 'Home': 0.52, 'Personal care': 0.45}[cat]
    for name, price in items:
        pid += 1
        products.append((f'P{pid}', name, cat, price, round(price * (1 - margin), 2)))
write('products.csv', ['product_id', 'product', 'category', 'price', 'cost'], products)

# Customers.
segs = ['Regular', 'Regular', 'Regular', 'Bargain', 'Premium']
customers = []
start = dt.date(2023, 1, 1)
for i in range(1, 1201):
    s = stores[random.randrange(len(stores))]
    signup = start + dt.timedelta(days=random.randrange(0, 1000))
    customers.append((f'C{i:04d}', signup.isoformat(), s[0], random.choice(segs), random.choice(['email', 'email', 'none', 'app'])))
write('customers.csv', ['customer_id', 'signup_date', 'home_store', 'segment', 'contact'], customers)

# Orders, one row per order line, 2025-01-01 to 2026-06-30, with weekly and yearly patterns.
orders = []
oid = 50000
d0, d1 = dt.date(2025, 1, 1), dt.date(2026, 6, 30)
weights = [1.0, 0.9, 0.95, 1.0, 1.15, 1.45, 1.25]
day = d0
while day <= d1:
    season = 1.0 + (0.6 if day.month == 12 else 0.25 if day.month == 11 else -0.15 if day.month in (1, 2) else 0.0)
    growth = 1 + 0.15 * (day - d0).days / 545
    n = int(round(9 * weights[day.weekday()] * season * growth + random.gauss(0, 1.5)))
    for _ in range(max(1, n)):
        oid += 1
        c = customers[random.randrange(len(customers))]
        if dt.date.fromisoformat(c[1]) > day:
            c = customers[random.randrange(len(customers) // 3)]
        store = c[2] if random.random() < 0.7 else random.choice(stores)[0]
        for _line in range(random.choice([1, 1, 1, 2, 2, 3])):
            p = random.choice(products)
            qty = random.choice([1, 1, 1, 1, 2, 2, 3])
            disc = random.choice([0, 0, 0, 0, 0.1, 0.2]) if c[3] != 'Premium' else random.choice([0, 0, 0, 0.1])
            if day.month == 11 and 21 <= day.day <= 30:
                disc = max(disc, 0.25)
            orders.append((oid, day.isoformat(), c[0], store, p[0], qty, p[3], disc))
    day += dt.timedelta(days=1)
write('orders.csv', ['order_id', 'date', 'customer_id', 'store_id', 'product_id', 'qty', 'unit_price', 'discount'], orders)

# A messy export of 400 order lines for the cleaning module.
messy = []
fmts = ['%Y-%m-%d', '%d/%m/%Y', '%b %d %Y']
for r in random.sample(orders, 400):
    oid_, date, cid, sid, pid_, qty, price, disc = r
    d = dt.date.fromisoformat(date)
    date_s = d.strftime(random.choice(fmts)) if random.random() < 0.3 else date
    price_s = f'${price}' if random.random() < 0.25 else str(price)
    store_name = next(s[1] for s in stores if s[0] == sid)
    store_s = random.choice([store_name, store_name.upper(), f' {store_name} ', store_name.lower()]) if random.random() < 0.35 else store_name
    qty_s = '' if random.random() < 0.04 else str(-qty if random.random() < 0.03 else qty)
    disc_s = '' if random.random() < 0.08 else f'{int(disc * 100)}%'
    cid_s = '' if random.random() < 0.03 else cid
    messy.append((oid_, date_s, cid_s, store_s, pid_, qty_s, price_s, disc_s))
messy += random.sample(messy, 12)  # duplicate rows
random.shuffle(messy)
write('orders_messy.csv', ['order_id', 'order date', 'Customer ID', 'Store', 'product', 'Qty', 'Unit Price', 'Discount'], messy)
print(len(orders), 'order lines;', len(messy), 'messy rows')
