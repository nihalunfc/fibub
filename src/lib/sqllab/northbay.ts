// Northbay Retail: the fictional store chain behind the SQL and data modelling courses. Made up in the
// browser from a fixed seed, so every learner gets exactly the same rows (and the answers always match),
// with nothing to download. Two years of sales (2024-2025) with real-looking patterns: busy Decembers and
// weekends, online growth, returns, guests without accounts, and a few planted data-quality problems
// (blank emails, stray spaces, duplicate customers) for the cleaning lessons. Plus tiny mini_ tables for
// pictures. Names, stores and brands are invented.
export type Col = { name: string; type: 'INTEGER' | 'REAL' | 'TEXT'; about: string };
export type Table = { name: string; about: string; cols: Col[]; rows: (string | number | null)[][]; key?: string; refs?: Record<string, string> };

function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const C = (name: string, type: Col['type'], about: string): Col => ({ name, type, about });
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const r2 = (x: number) => Math.round(x * 100) / 100;

export function northbay(): Table[] {
  const R = rng(20261122);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(R() * a.length)];
  const int = (a: number, b: number) => a + Math.floor(R() * (b - a + 1));

  const regions = [[1, 'Ontario South'], [2, 'Ontario North'], [3, 'Prairies'], [4, 'West Coast']];
  const stores: (string | number | null)[][] = [
    [1, 'Northbay Downtown', 'Toronto', 'ON', 1, '2015-03-14', 18000], [2, 'Northbay Lakeshore', 'Mississauga', 'ON', 1, '2016-06-01', 22000],
    [3, 'Northbay Falls', 'Niagara Falls', 'ON', 1, '2018-09-20', 14000], [4, 'Northbay Bytown', 'Ottawa', 'ON', 1, '2017-04-08', 16000],
    [5, 'Northbay Harbour', 'Hamilton', 'ON', 1, '2019-11-02', 15000], [6, 'Northbay Sudbury', 'Sudbury', 'ON', 2, '2020-02-15', 12000],
    [7, 'Northbay Thunder Bay', 'Thunder Bay', 'ON', 2, '2021-05-10', 11000], [8, 'Northbay Prairie', 'Winnipeg', 'MB', 3, '2019-08-30', 17000],
    [9, 'Northbay Stampede', 'Calgary', 'AB', 3, '2022-03-19', 20000], [10, 'Northbay River Valley', 'Edmonton', 'AB', 3, '2023-07-01', 16500],
    [11, 'Northbay Pacific', 'Vancouver', 'BC', 4, '2020-10-24', 19000], [12, 'Northbay Online', null, null, null, '2019-01-01', null],
  ];
  const cats = [[1, 'Fresh produce', 'Grocery'], [2, 'Bakery', 'Grocery'], [3, 'Dairy', 'Grocery'], [4, 'Pantry', 'Grocery'], [5, 'Snacks', 'Grocery'],
    [6, 'Kitchen', 'Home'], [7, 'Bedding', 'Home'], [8, 'Cleaning', 'Home'], [9, 'Toys', 'Kids'], [10, 'Electronics', 'Tech']];
  const items: Record<number, [string, number][]> = {
    1: [['Apples 1 kg', 4.99], ['Bananas bunch', 1.99], ['Baby spinach', 3.49], ['Avocados 4 pack', 5.99], ['Tomatoes on the vine', 4.29], ['Carrots 2 lb', 2.49], ['Strawberries', 5.49], ['Red onions', 2.99]],
    2: [['Sourdough loaf', 5.49], ['Croissants 6 pack', 6.99], ['Bagels 6 pack', 4.49], ['Whole wheat bread', 3.99], ['Blueberry muffins', 6.49], ['Naan 4 pack', 3.79]],
    3: [['Milk 2% 4 L', 6.29], ['Greek yogurt', 5.99], ['Cheddar block', 7.49], ['Butter 454 g', 6.79], ['Eggs dozen', 4.99], ['Paneer 350 g', 6.49]],
    4: [['Basmati rice 4 kg', 14.99], ['Pasta 900 g', 2.99], ['Olive oil 1 L', 12.99], ['Canned tomatoes', 1.89], ['Peanut butter', 5.49], ['Maple syrup 500 ml', 9.99], ['Lentils 2 kg', 7.99], ['Coffee beans 1 kg', 19.99]],
    5: [['Potato chips', 3.99], ['Dark chocolate bar', 3.49], ['Trail mix', 7.99], ['Popcorn 6 pack', 4.99], ['Granola bars', 4.79], ['Salted cashews', 9.49]],
    6: [['Chef knife', 39.99], ['Non-stick pan', 34.99], ['Glass storage set', 24.99], ['Kettle', 44.99], ['Cutting board', 19.99], ['Mixing bowls', 22.99]],
    7: [['Queen sheet set', 59.99], ['Pillow 2 pack', 34.99], ['Duvet', 89.99], ['Bath towel set', 39.99], ['Throw blanket', 29.99]],
    8: [['Dish soap', 3.49], ['Laundry detergent', 14.99], ['Paper towels 6 roll', 9.99], ['All-purpose cleaner', 4.99], ['Sponges 6 pack', 3.99]],
    9: [['Building blocks set', 49.99], ['Puzzle 1000 pieces', 19.99], ['Plush bear', 17.99], ['Board game', 34.99], ['Art kit', 24.99]],
    10: [['Wireless earbuds', 79.99], ['Phone charger', 24.99], ['Bluetooth speaker', 59.99], ['Smart bulb', 19.99], ['USB-C cable', 12.99], ['Power bank', 39.99]],
  };
  const brands: Record<string, string[]> = { Grocery: ['Northbay Basics', 'Green Field', 'Maple Lane', 'Harvest Moon'], Home: ['Hearth & Co', 'Northbay Home', 'Cedar House'], Kids: ['Little Comet', 'Play Harbour'], Tech: ['Volt North', 'Pixel Pine'] };
  const products: (string | number | null)[][] = []; let pid = 0;
  for (const [cid, , dept] of cats) for (const [nm, price] of items[cid as number]) {
    pid++; const margin = dept === 'Grocery' ? 0.62 + R() * 0.12 : 0.45 + R() * 0.15;
    products.push([pid, nm, cid, pick(brands[dept as string]), price, r2(price * margin), iso(new Date(Date.UTC(2018 + int(0, 6), int(0, 11), int(1, 28))))]);
  }
  const first = ['Asha', 'Ben', 'Chen', 'Dina', 'Elijah', 'Fatima', 'Gurpreet', 'Hana', 'Isaac', 'Jasmine', 'Kofi', 'Leila', 'Mateo', 'Nadia', 'Owen', 'Priya', 'Quinn', 'Rahul', 'Sofia', 'Tariq', 'Uma', 'Victor', 'Wei', 'Ximena', 'Yusuf', 'Zoe', 'Arjun', 'Bella', 'Carlos', 'Divya', 'Ethan', 'Grace', 'Hiro', 'Ines', 'Jonah', 'Kiran', 'Liam', 'Maya', 'Noah', 'Olivia', 'Pierre', 'Rosa', 'Sam', 'Tanvi', 'Yara'];
  const last = ['Patel', 'Nguyen', 'Smith', 'Singh', 'Tremblay', 'Chen', 'Khan', 'Martin', 'Roy', 'Gagnon', 'Brown', 'Wilson', 'Li', 'Kumar', 'Lee', 'Bouchard', 'Okafor', 'Garcia', 'Ahmed', 'Campbell', 'Murphy', 'Das', 'Fraser', 'Lam', 'Rossi', 'Mensah', 'Novak', 'Sato', 'Haddad', 'Morin'];
  const cityProv = stores.filter((s) => s[2]).map((s) => [s[2], s[3]] as [string, string]);
  const tiers = ['Bronze', 'Silver', 'Gold'];
  const customers: (string | number | null)[][] = [];
  for (let id = 1; id <= 600; id++) {
    const f = pick(first), l = pick(last); const [city, prov] = pick(cityProv);
    const joined = new Date(Date.UTC(2021, 0, 1) + Math.floor(R() * 1825) * 86400000);
    const email = R() < 0.06 ? null : `${f}.${l}${id}@example.com`.toLowerCase();
    const tier = R() < 0.08 ? null : R() < 0.6 ? 'Bronze' : R() < 0.75 ? 'Silver' : 'Gold';
    customers.push([id, f, l, email, R() < 0.03 ? `${city} ` : city, prov, iso(joined), tier]);
  }
  // Planted duplicates: the same person signed up twice (email in capitals).
  for (const src of [17, 142, 388]) { const c = customers[src - 1]; customers.push([customers.length + 1, c[1], c[2], typeof c[3] === 'string' ? c[3].toUpperCase() : `${String(c[1]).toLowerCase()}@example.com`, c[4], c[5], '2025-08-1' + (src % 9), pick(tiers)]); }

  const employees: (string | number | null)[][] = [[1, 'Morgan Ellis', null, 'CEO', null, '2014-01-06', 210000], [2, 'Riya Sethi', null, 'VP Operations', 1, '2015-02-02', 165000], [3, 'Tom Becker', null, 'VP Online', 1, '2018-11-12', 158000]];
  for (const s of stores.slice(0, 11)) {
    const mgr = employees.length + 1; employees.push([mgr, `${pick(first)} ${pick(last)}`, s[0], 'Store manager', 2, s[5], 82000 + int(0, 18) * 1000]);
    for (let k = 0; k < 2; k++) employees.push([employees.length + 1, `${pick(first)} ${pick(last)}`, s[0], pick(['Supervisor', 'Associate', 'Associate']), mgr, iso(new Date(Date.UTC(2020 + int(0, 5), int(0, 11), int(1, 28)))), 39000 + int(0, 20) * 1000]);
  }
  employees.push([employees.length + 1, `${pick(first)} ${pick(last)}`, 12, 'Online lead', 3, '2019-03-04', 98000], [employees.length + 2, `${pick(first)} ${pick(last)}`, 12, 'Data analyst', 3, '2024-05-21', 72000]);

  const promos = [[1, 'Winter warm-up', '2024-01-08', '2024-01-21', 0.1], [2, 'Back to school', '2024-08-19', '2024-09-01', 0.15], [3, 'Black Friday', '2024-11-25', '2024-12-01', 0.25],
    [4, 'Spring clean', '2025-04-07', '2025-04-20', 0.1], [5, 'Summer savings', '2025-07-14', '2025-07-27', 0.12], [6, 'Black Friday', '2025-11-24', '2025-11-30', 0.25], [7, 'Boxing week', '2025-12-26', '2025-12-31', 0.2]];
  const promoOn = (d: string) => promos.find((p) => d >= (p[2] as string) && d <= (p[3] as string));

  const orders: (string | number | null)[][] = []; const lines: (string | number | null)[][] = []; const returns: (string | number | null)[][] = [];
  const season = [0.85, 0.8, 0.9, 0.95, 1, 1, 1.05, 1.05, 1, 1, 1.25, 1.6];
  const prodByCat = new Map<number, (string | number | null)[][]>(); for (const p of products) { const k = p[2] as number; (prodByCat.get(k) ?? prodByCat.set(k, []).get(k)!).push(p); }
  const catWeight = [3, 2, 3, 3, 2, 1, 0.6, 1.5, 0.8, 1]; const cw = catWeight.reduce((a, b) => a + b, 0);
  const pickCat = () => { let x = R() * cw; for (let i = 0; i < catWeight.length; i++) { x -= catWeight[i]; if (x < 0) return i + 1; } return 1; };
  let oid = 1000, rid = 0;
  for (let day = Date.UTC(2024, 0, 1); day <= Date.UTC(2025, 11, 31); day += 86400000) {
    const d = new Date(day); const ds = iso(d); const yr = d.getUTCFullYear(); const wk = d.getUTCDay();
    const promo = promoOn(ds);
    const n = Math.round((4.2 + (yr === 2025 ? 0.9 : 0)) * season[d.getUTCMonth()] * (wk === 0 || wk === 6 ? 1.35 : 1) * (promo ? 1.5 : 1) + (R() - 0.5) * 3);
    for (let k = 0; k < n; k++) {
      oid++;
      const online = R() < (yr === 2024 ? 0.22 : 0.31);
      let store = online ? 12 : int(1, 11);
      if (store === 10 && ds < '2023-07-01') store = 9;
      const cust = R() < 0.12 ? null : int(1, 600);
      const status = R() < 0.03 ? 'cancelled' : 'completed';
      orders.push([oid, cust, store, ds, online ? 'online' : 'store', status, promo ? promo[0] : null]);
      const nl = 1 + Math.floor(R() * R() * 5);
      const used = new Set<number>();
      for (let l = 0; l < nl; l++) {
        const p = pick(prodByCat.get(pickCat())!); if (used.has(p[0] as number)) continue; used.add(p[0] as number);
        const q = R() < 0.75 ? 1 : int(2, 4); const disc = promo ? promo[4] as number : R() < 0.05 ? 0.05 : 0;
        lines.push([oid, p[0], q, p[4], disc]);
        if (status === 'completed' && R() < ((p[2] as number) >= 6 ? 0.06 : 0.012)) {
          const back = new Date(day + int(1, 25) * 86400000);
          if (back <= new Date(Date.UTC(2025, 11, 31))) returns.push([++rid, oid, p[0], iso(back), pick(['Damaged', 'Changed mind', 'Wrong size', 'Not as described', 'Arrived late'])]);
        }
      }
    }
  }
  const mini_customers = [[1, 'Asha', 'Toronto'], [2, 'Ben', 'Ottawa'], [3, 'Chen', 'Toronto'], [4, 'Dina', 'Hamilton'], [5, 'Eli', 'Ottawa']];
  const mini_orders = [[101, 1, 'Kettle', 45], [102, 1, 'Bagels', 5], [103, 2, 'Puzzle', 20], [104, 3, 'Duvet', 90], [105, 3, 'Kettle', 45], [106, 9, 'Speaker', 60]];

  return [
    { name: 'regions', about: 'Sales regions.', key: 'region_id', cols: [C('region_id', 'INTEGER', 'region number'), C('region_name', 'TEXT', 'name')], rows: regions },
    { name: 'stores', about: 'Every store, plus one row for the online shop (no city).', key: 'store_id', refs: { region_id: 'regions' }, cols: [C('store_id', 'INTEGER', 'store number'), C('store_name', 'TEXT', 'name'), C('city', 'TEXT', 'city (NULL for online)'), C('province', 'TEXT', 'two-letter province'), C('region_id', 'INTEGER', 'region'), C('opened_on', 'TEXT', 'opening date'), C('size_sqft', 'INTEGER', 'floor space in square feet')], rows: stores },
    { name: 'categories', about: 'Product categories and their department.', key: 'category_id', cols: [C('category_id', 'INTEGER', 'category number'), C('category_name', 'TEXT', 'name'), C('department', 'TEXT', 'Grocery, Home, Kids or Tech')], rows: cats },
    { name: 'products', about: 'What Northbay sells, with today\'s shelf price and unit cost.', key: 'product_id', refs: { category_id: 'categories' }, cols: [C('product_id', 'INTEGER', 'product number'), C('product_name', 'TEXT', 'name'), C('category_id', 'INTEGER', 'category'), C('brand', 'TEXT', 'brand'), C('unit_price', 'REAL', 'shelf price, $'), C('unit_cost', 'REAL', 'what Northbay pays, $'), C('launched_on', 'TEXT', 'first sold')], rows: products },
    { name: 'customers', about: 'Loyalty members. Some emails and tiers are missing, a few cities have stray spaces, and three people signed up twice.', key: 'customer_id', cols: [C('customer_id', 'INTEGER', 'customer number'), C('first_name', 'TEXT', ''), C('last_name', 'TEXT', ''), C('email', 'TEXT', 'may be NULL'), C('city', 'TEXT', 'home city'), C('province', 'TEXT', ''), C('joined_on', 'TEXT', 'sign-up date'), C('loyalty_tier', 'TEXT', 'Bronze, Silver, Gold or NULL')], rows: customers },
    { name: 'employees', about: 'Staff, each with a manager (for self-joins and org charts).', key: 'employee_id', refs: { store_id: 'stores', manager_id: 'employees' }, cols: [C('employee_id', 'INTEGER', ''), C('name', 'TEXT', ''), C('store_id', 'INTEGER', 'NULL for head office'), C('role', 'TEXT', ''), C('manager_id', 'INTEGER', 'their manager (NULL for the CEO)'), C('hired_on', 'TEXT', ''), C('salary', 'INTEGER', 'yearly, $')], rows: employees },
    { name: 'promotions', about: 'Sale periods.', key: 'promo_id', cols: [C('promo_id', 'INTEGER', ''), C('promo_name', 'TEXT', ''), C('start_date', 'TEXT', ''), C('end_date', 'TEXT', ''), C('discount', 'REAL', 'fraction off, e.g. 0.25')], rows: promos },
    { name: 'orders', about: 'One row per checkout, 2024-2025. customer_id is NULL for guests.', key: 'order_id', refs: { customer_id: 'customers', store_id: 'stores', promo_id: 'promotions' }, cols: [C('order_id', 'INTEGER', ''), C('customer_id', 'INTEGER', 'NULL = guest'), C('store_id', 'INTEGER', '12 = online'), C('order_date', 'TEXT', 'YYYY-MM-DD'), C('channel', 'TEXT', 'store or online'), C('status', 'TEXT', 'completed or cancelled'), C('promo_id', 'INTEGER', 'sale running that day, if any')], rows: orders },
    { name: 'order_items', about: 'One row per product in an order. Line value = quantity × unit_price × (1 − discount).', refs: { order_id: 'orders', product_id: 'products' }, cols: [C('order_id', 'INTEGER', ''), C('product_id', 'INTEGER', ''), C('quantity', 'INTEGER', ''), C('unit_price', 'REAL', 'price paid per unit, $'), C('discount', 'REAL', 'fraction off')], rows: lines },
    { name: 'returns', about: 'Products brought back.', key: 'return_id', refs: { order_id: 'orders', product_id: 'products' }, cols: [C('return_id', 'INTEGER', ''), C('order_id', 'INTEGER', ''), C('product_id', 'INTEGER', ''), C('return_date', 'TEXT', ''), C('reason', 'TEXT', '')], rows: returns },
    { name: 'mini_customers', about: 'Five customers, small enough to see every row.', cols: [C('id', 'INTEGER', ''), C('name', 'TEXT', ''), C('city', 'TEXT', '')], rows: mini_customers },
    { name: 'mini_orders', about: 'Six orders for the mini customers (customer 9 does not exist).', cols: [C('order_id', 'INTEGER', ''), C('customer_id', 'INTEGER', ''), C('item', 'TEXT', ''), C('amount', 'INTEGER', '$')], rows: mini_orders },
  ];
}

/** SQL that creates the tables (types only; keys are described, not enforced, as in many warehouses). */
export const createSql = (t: Table) => `CREATE TABLE ${t.name} (${t.cols.map((c) => `${c.name} ${c.type}`).join(', ')})`;
