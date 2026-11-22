// 8.3 A sortable table, like the one on the test, with three statements to judge.
import { readout } from '../../kit.js';
import { stack, card, clear } from './_verbal.js';
const COLS = [['name', 'Store'], ['sales', 'Sales (thousand dollars)'], ['staff', 'Staff'], ['growth', 'Growth (%)']];
const ROWS = [
  { name: 'Ashford', sales: 960, staff: 24, growth: 7 }, { name: 'Belmont', sales: 750, staff: 25, growth: 2 }, { name: 'Carver', sales: 880, staff: 38, growth: 5 },
  { name: 'Dunmore', sales: 1240, staff: 30, growth: 9 }, { name: 'Elmhurst', sales: 640, staff: 18, growth: -3 }, { name: 'Fairview', sales: 1010, staff: 27, growth: 12 }, { name: 'Glenwood', sales: 590, staff: 21, growth: 1 },
];
const ST = [
  { s: 'The store with the most staff has the highest sales.', v: false, sort: 'staff', why: 'Sort by staff: Carver (38) is top. Sort by sales: Dunmore (1,240) is top. Different stores.' },
  { s: 'The median growth is above 4%.', v: true, sort: 'growth', why: 'Sort by growth: −3, 1, 2, 5, 7, 9, 12. Seven rows, so the median is the 4th: 5%.' },
  { s: 'Ashford has higher sales per staff member than Belmont.', v: true, sort: 'sales', why: 'Ashford 960 ÷ 24 = 40; Belmont 750 ÷ 25 = 30.' },
];
export default function (host) {
  let key = 'name', desc = false;
  const box = stack(host), out = readout(host);
  const wrap = document.createElement('div'); wrap.style.overflowX = 'auto'; box.appendChild(wrap);
  const draw = () => {
    const rows = ROWS.slice().sort((a, b) => (key === 'name' ? a.name.localeCompare(b.name) : a[key] - b[key]) * (desc ? -1 : 1));
    wrap.innerHTML = `<table class="qb-match"><tr>${COLS.map(([k, t]) => `<th><button type="button" class="lk-btn" data-k="${k}" aria-pressed="${k === key}">${t}${k === key ? (desc ? ' ▼' : ' ▲') : ''}</button></th>`).join('')}</tr>` +
      rows.map((x) => `<tr>${COLS.map(([k]) => `<td>${String(x[k]).replace('-', '−')}</td>`).join('')}</tr>`).join('') + '</table>';
    wrap.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.k; desc = k === key ? !desc : k !== 'name'; key = k; draw(); }));
  };
  draw();
  const sbox = document.createElement('div'); sbox.className = 'vx'; box.appendChild(sbox);
  ST.forEach((x, i) => {
    const c = card(sbox, `Statement ${i + 1}: true or false?`, x.s, '', () => { c.classList.add(x.v ? 'vx-good' : 'vx-bad'); c.querySelector('.vx-tag').textContent = `Statement ${i + 1}: ${x.v ? 'true' : 'false'}`; out.innerHTML = x.why; key = x.sort; desc = x.sort !== 'name'; draw(); });
  });
  out.textContent = 'Tap a heading to sort. Decide each statement, then tap it to check.';
}
