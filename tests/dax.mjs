// Checks for the Power BI course's DAX engine (src/lib/dax/) on a tiny model worked by hand, and on the
// Northbay Goods data against plain JavaScript sums. Run with `node tests/dax.mjs`.
import { run, Model, parseProgram } from '../src/lib/dax/engine.ts';
import { northbayModel } from '../src/lib/dax/northbay.ts';

let fails = 0, n = 0;
const ok = (cond, what) => { n++; if (!cond) { fails++; console.error(`✗ ${what}`); } };
const near = (got, want, what, tol = 1e-6) => { n++; if (!(typeof got === 'number' && Math.abs(got - want) <= tol)) { fails++; console.error(`✗ ${what}: got ${got}, want ${want}`); } };

// A tiny shop: 3 products in 2 categories, 6 sales over two years.
const tiny = {
  tables: [
    { name: 'Product', cols: ['ProductKey', 'Name', 'Category'], rows: [[1, 'Tea', 'Drinks'], [2, 'Coffee', 'Drinks'], [3, 'Mug', 'Home']] },
    { name: 'Date', cols: ['Date', 'Year', 'MonthNo'], rows: ['2024-01-10', '2024-02-10', '2025-01-10', '2025-02-10'].map((d) => [d, +d.slice(0, 4), +d.slice(5, 7)]) },
    { name: 'Sales', cols: ['Id', 'Date', 'ProductKey', 'Qty', 'Price'], rows: [
      [1, '2024-01-10', 1, 2, 3], [2, '2024-02-10', 2, 1, 5], [3, '2024-02-10', 3, 1, 10],
      [4, '2025-01-10', 1, 4, 3], [5, '2025-02-10', 2, 2, 5], [6, '2025-02-10', 3, 3, 10]] },
  ],
  relationships: [{ many: 'Sales', fk: 'ProductKey', one: 'Product', pk: 'ProductKey' }, { many: 'Sales', fk: 'Date', one: 'Date', pk: 'Date' }],
  dateTable: { table: 'Date', col: 'Date' },
};
const cat = [{ table: 'Product', name: 'Category' }];
const yr = [{ table: 'Date', name: 'Year' }];
const vals = (r) => (r.error ? (console.error('  error:', r.error), []) : r.visual.rows.map((x) => [...x.label, ...x.values]));

// Revenue = SUMX: 6+5+10+12+10+30 = 73; Drinks 6+5+12+10 = 33, Home 40.
let r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])', { by: cat });
ok(JSON.stringify(vals(r)) === JSON.stringify([['Drinks', 33], ['Home', 40]]), 'SUMX by category');
near(r.visual.total[0], 73, 'SUMX total');
// SUM of a column, COUNTROWS, DISTINCTCOUNT, AVERAGE.
r = run(tiny, 'Units = SUM(Sales[Qty])\nLines = COUNTROWS(Sales)\nProds = DISTINCTCOUNT(Sales[ProductKey])\nAvgPrice = AVERAGE(Sales[Price])', { by: yr });
ok(JSON.stringify(vals(r)) === JSON.stringify([[2024, 4, 3, 3, 6], [2025, 9, 3, 3, 6]]), 'basic aggregations by year');
// A bare column in a measure is an error with a helpful message.
r = run(tiny, 'Bad = Sales[Qty] * 2');
ok(/single value for column 'Sales'\[Qty\]/.test(r.error ?? ''), 'bare column error');
// CALCULATE with a condition overwrites the visual's filter on the same column.
r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])\nHome Rev = CALCULATE([Revenue], Product[Category] = "Home")', { by: cat });
ok(JSON.stringify(vals(r)) === JSON.stringify([['Drinks', 33, 40], ['Home', 40, 40]]), 'CALCULATE overwrite');
// KEEPFILTERS intersects instead: Drinks row gives blank.
r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])\nHome Keep = CALCULATE([Revenue], KEEPFILTERS(Product[Category] = "Home"))', { by: cat });
ok(r.visual.rows[0].values[1] === null && r.visual.rows[1].values[1] === 40, 'KEEPFILTERS');
// Share of all categories: ALL removes the visual filter. Drinks 33/73.
r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])\nShare = DIVIDE([Revenue], CALCULATE([Revenue], ALL(Product)))', { by: cat });
near(r.visual.rows[0].values[1], 33 / 73, 'share with ALL');
near(r.visual.total[1], 1, 'share total is 100 %');
// ALL(Sales) also removes filters on the tables Sales looks up (expanded table).
r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])\nAllSales = CALCULATE([Revenue], ALL(Sales))', { by: cat });
near(r.visual.rows[0].values[1], 73, 'ALL(Sales) removes dimension filters');
// FILTER as a table filter: big lines only (qty × price ≥ 10): lines 3,4,5,6 = 10+12+10+30 = 62.
r = run(tiny, 'Big = CALCULATE(SUMX(Sales, Sales[Qty] * Sales[Price]), FILTER(Sales, Sales[Qty] * Sales[Price] >= 10))');
near(r.visual.total[0], 62, 'FILTER table filter');
// Context transition: SUMX over Product of a measure = same total; without CALCULATE, SUM repeats the grand total.
r = run(tiny, 'Units = SUM(Sales[Qty])\nWith = SUMX(Product, [Units])\nWithout = SUMX(Product, SUM(Sales[Qty]))');
near(r.visual.total[1], 13, 'context transition through measure');
near(r.visual.total[2], 39, 'no transition: 3 × 13');
// Calculated column with RELATED, then a measure on it.
r = run(tiny, 'Sales[Cat] = RELATED(Product[Category])\nSales[Line] = Sales[Qty] * Sales[Price]\nHomeLines = CALCULATE(SUM(Sales[Line]), Sales[Cat] = "Home")');
near(r.visual.total[0], 40, 'calculated columns + RELATED');
ok(r.columns.length === 2, 'two calculated columns reported');
// Time intelligence: YTD and last year. Feb 2025 YTD = 12 + 10 + 30 = 52; SPLY of 2025 = 2024 = 21.
const ti = 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])\nYTD = TOTALYTD([Revenue], \'Date\'[Date])\nLY = CALCULATE([Revenue], SAMEPERIODLASTYEAR(\'Date\'[Date]))\nYoY = DIVIDE([Revenue] - [LY], [LY])';
r = run(tiny, ti, { by: [{ table: 'Date', name: 'Year' }, { table: 'Date', name: 'MonthNo' }] });
const feb25 = r.visual.rows.find((x) => x.label[0] === 2025 && x.label[1] === 2);
near(feb25.values[1], 52, 'TOTALYTD Feb 2025');
near(feb25.values[2], 15, 'SAMEPERIODLASTYEAR Feb 2025 = Feb 2024');
r = run(tiny, ti, { by: yr });
near(r.visual.rows[1].values[2], 21, 'last year for 2025');
near(r.visual.rows[1].values[3], (52 - 21) / 21, 'YoY %');
// VAR / RETURN, IF, SWITCH, DIVIDE by zero.
r = run(tiny, 'X = VAR a = SUM(Sales[Qty]) VAR b = 0 RETURN IF(a > 10, DIVIDE(a, b, -1), 0)\nS = SWITCH(TRUE(), SUM(Sales[Qty]) > 100, "big", "small")');
ok(r.visual.total[0] === -1 && r.visual.total[1] === 'small', 'VAR, IF, DIVIDE alternate, SWITCH TRUE');
// Queries: SUMMARIZECOLUMNS with ORDER BY, TOPN, FILTER/VALUES.
r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])\nEVALUATE SUMMARIZECOLUMNS(Product[Name], "Rev", [Revenue]) ORDER BY [Rev] DESC');
ok(JSON.stringify(r.query?.rows) === JSON.stringify([['Mug', 40], ['Tea', 18], ['Coffee', 15]]), 'SUMMARIZECOLUMNS ORDER BY');
r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])\nEVALUATE TOPN(1, VALUES(Product[Name]), [Revenue])');
ok(JSON.stringify(r.query?.rows) === JSON.stringify([['Mug']]), 'TOPN with a measure');
r = run(tiny, 'EVALUATE FILTER(Product, Product[Category] = "Drinks")');
ok(r.query?.rows.length === 2 && r.query.cols.length === 3, 'EVALUATE FILTER');
// RANKX over all products.
r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])\nRank = RANKX(ALL(Product), [Revenue])', { by: [{ table: 'Product', name: 'Name' }] });
ok(JSON.stringify(vals(r).map((x) => [x[0], x[2]])) === JSON.stringify([['Coffee', 3], ['Mug', 1], ['Tea', 2]]), 'RANKX');
// ALLSELECTED keeps a slicer, removes the visual's rows.
r = run(tiny, 'Units = SUM(Sales[Qty])\nPct = DIVIDE([Units], CALCULATE([Units], ALLSELECTED()))', { by: cat, slicers: [{ col: { table: 'Date', name: 'Year' }, values: [2025] }] });
near(r.visual.rows[0].values[1], 6 / 9, 'ALLSELECTED with slicer');
// Parser: multi-word measure names and several statements.
ok(parseProgram('Total Sales = 1\nAnother One = [Total Sales] + 1').length === 2, 'multi-word measure names');
r = run(tiny, 'Margin % = 0.5\nWest 2025 = [Margin %] * 2'); ok(r.measures.join() === 'Margin %,West 2025' && r.visual.total[1] === 1, 'names with % and numbers');
ok(/no closing/.test(run(tiny, 'A = SUM(Sales[Qty]').error ?? 'x') || /ended too soon|Expected/.test(run(tiny, 'A = SUM(Sales[Qty]').error ?? ''), 'missing bracket error');
// Trace records steps in the shared player format.
r = run(tiny, 'Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])', { by: cat, traceRow: 0 });
ok(r.trace && r.trace.steps.some((s) => s.kind === 'iterate') , 'trace has an iterate step');
r = run(tiny, 'Units = SUM(Sales[Qty])', { by: cat, traceRow: 1 });
ok(r.trace && r.trace.steps.some((s) => s.kind === 'propagate') && r.trace.steps.some((s) => s.kind === 'aggregate'), 'trace propagate + aggregate');

// Northbay Goods: engine totals equal plain sums of the generated rows.
const nb = northbayModel();
const sales = nb.tables.find((t) => t.name === 'Sales');
const ci = Object.fromEntries(sales.cols.map((c, i) => [c, i]));
const total = sales.rows.reduce((a, r) => a + r[ci.Amount], 0);
const t0 = performance.now();
const model = new Model(nb);
r = run(model, 'Total Sales = SUM(Sales[Amount])\nCheck = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])', { by: [{ table: 'Date', name: 'Year' }] });
near(r.visual.total[0], total, 'Northbay total', 0.01);
near(r.visual.total[1], total, 'Northbay SUMX check', 0.05);
const y24 = sales.rows.filter((x) => x[ci.Date] < '2025').reduce((a, x) => a + x[ci.Amount], 0);
near(r.visual.rows[0].values[0], y24, 'Northbay 2024', 0.01);
ok(sales.rows.length > 5000 && sales.rows.length < 15000, `Northbay size ${sales.rows.length}`);
r = run(new Model(nb), "Total Sales = SUM(Sales[Amount])\nPY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))\nR28 = CALCULATE([Total Sales], DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -28, DAY))", { by: [{ table: 'Date', name: 'YearMonth' }] });
ok(!r.error, 'Northbay time intelligence runs: ' + (r.error ?? ''));
const ms = performance.now() - t0;
ok(ms < 4000, `Northbay runs fast enough (${Math.round(ms)} ms)`);

console.log(`${n - fails}/${n} DAX checks passed`);
if (fails) process.exit(1);
