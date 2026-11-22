// Table Analysis: a table of made-up figures and statements to mark true or not (select every true statement).
import { int, choose, shuffle, fmt, D } from '../grad-quant/_q.js';
const E = ['gmat'];
const NAMES = ['Ashford', 'Belmont', 'Carver', 'Dunmore', 'Elmhurst', 'Fairview', 'Glenwood', 'Hartley'];
const neg = (v) => String(v).replace('-', '−');
const median = (a) => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
function table(r) {
  const n = int(r, 6, 7), names = shuffle(r, NAMES).slice(0, n);
  const sales = shuffle(r, Array.from({ length: 131 }, (_, i) => (i + 30) * 10)).slice(0, n), staff = shuffle(r, Array.from({ length: 33 }, (_, i) => i + 8)).slice(0, n);
  const rows = names.map((name, i) => ({ name, sales: sales[i], staff: staff[i], growth: int(r, -6, 14) }));
  return rows;
}
const html = (rows) => `<table class="qb-match"><tr><th>Store</th><th>Sales (thousand dollars)</th><th>Staff</th><th>Growth from last year (%)</th></tr>${rows.map((x) => `<tr><td>${x.name}</td><td>${x.sales}</td><td>${x.staff}</td><td>${neg(x.growth)}</td></tr>`).join('')}</table>`;
// Each statement: text, truth, and the one-line reason shown in the solution.
function statements(r, rows) {
  const by = (k) => rows.slice().sort((a, b) => b[k] - a[k]);
  const top = by('sales')[0], most = by('staff')[0], perStaff = rows.slice().sort((a, b) => b.sales / b.staff - a.sales / a.staff)[0];
  const [a, b] = shuffle(r, rows), t = int(r, 0, 8), ms = median(rows.map((x) => x.staff)), m = int(r, 15, 30);
  const grew = rows.filter((x) => x.growth > t).length, tot = rows.reduce((s, x) => s + x.sales, 0), k = choose(r, [2, 1.5, 3]);
  const mean = tot / rows.length;
  const mg = median(rows.map((x) => x.growth));
  return [
    { s: 'The store with the highest sales also has the most staff.', v: top === most, why: `Highest sales: ${top.name} (${top.sales}); most staff: ${most.name} (${most.staff}).` },
    { s: `More than half of the stores grew by more than ${t}%.`, v: grew > rows.length / 2, why: `${grew} of ${rows.length} stores grew by more than ${t}%; more than half means at least ${Math.floor(rows.length / 2) + 1}.` },
    { s: `The median number of staff is greater than ${m}.`, v: ms > m, why: `Sort the staff column: the median is ${fmt(ms)}.` },
    { s: `${perStaff === a ? b.name : a.name} has the highest sales per staff member.`, v: false, why: `Highest sales per staff member: ${perStaff.name}, ${fmt(perStaff.sales / perStaff.staff, 1)} thousand dollars each.` },
    { s: `${perStaff.name} has the highest sales per staff member.`, v: true, why: `${perStaff.name}: ${perStaff.sales} ÷ ${perStaff.staff} = ${fmt(perStaff.sales / perStaff.staff, 1)}, the largest ratio in the table.` },
    { s: `${a.name}'s sales are at least ${k} times ${b.name}'s sales.`, v: a.sales >= k * b.sales, why: `${a.sales} ÷ ${b.sales} = ${fmt(a.sales / b.sales, 2)}.` },
    { s: `The average (arithmetic mean) sales per store is more than ${int(r, 60, 120) * 10} thousand dollars.`, v: null, why: '' },
    { s: `The median growth is higher than the growth of ${a.name}.`, v: mg > a.growth, why: `Median growth: ${neg(fmt(mg))}%; ${a.name}: ${neg(a.growth)}%.` },
  ].map((x) => {
    if (x.v === null) { const lim = +x.s.match(/(\d+) thousand/)[1]; x.v = mean > lim; x.why = `Total sales ${tot} ÷ ${rows.length} stores = ${fmt(mean, 1)} thousand dollars.`; }
    return x;
  });
}
const gen = (id, sub, n) => ({ id, type: 'msq', level: 3, exams: E, format: 'table', sub,
      make(r) {
        const rows = table(r); let S;
        for (let i = 0; i < 30; i++) { S = shuffle(r, statements(r, rows).filter((x, j, all) => !(j === 3 && all[4] && r() < 0.5))).slice(0, n); const t = S.filter((x) => x.v).length; if (t >= 1 && t < n) break; }
        const answer = S.map((x, i) => (x.v ? i : -1)).filter((i) => i >= 0);
        return { q: `<p>The table shows figures for the stores of a small chain last year. Select <b>every</b> statement that is true based on the table. Sorting a column in your head (or on paper) is the fastest way.</p>${html(rows)}`,
          options: S.map((x) => x.s), answer,
          sol: '<ol>' + S.map((x) => `<li><b>${x.v ? 'True' : 'Not true'}:</b> ${x.s} ${x.why}</li>`).join('') + '</ol><p><b>Tip:</b> on the real test the table can be sorted by any column. Sort first, then read off the top, the bottom or the middle (the median).</p>',
          hint: 'Sort by the column each statement talks about.', _rows: rows, _S: S };
      } });
export default {
  topic: 'tables',
  gens: [gen('ta-g01', 'table analysis', 4), gen('ta-g02', 'table analysis: three statements', 3)],
};
