// 8.5 Two-Part grid: choose one value per column; checks show whether the pair meets both conditions.
import { readout } from '../../kit.js';
import { stack, card } from './_verbal.js';
const VALS = [20, 30, 40, 50, 60, 70];
export default function (host) {
  let a = null, c = null;
  const box = stack(host);
  card(box, 'The story', 'A theatre sold 80 tickets: adults at 15 dollars and children at 8 dollars, for 1,060 dollars in total. Choose the number of adult tickets and the number of child tickets.');
  const wrap = document.createElement('div'); wrap.style.overflowX = 'auto'; box.appendChild(wrap);
  const out = readout(host);
  const draw = () => {
    wrap.innerHTML = `<table class="qb-match"><tr><th>Adult</th><th>Child</th><th>Value</th></tr>${VALS.map((v) => `<tr><td><button type="button" class="lk-btn" data-c="a" data-v="${v}" aria-pressed="${a === v}" aria-label="Adult ${v}">○</button></td><td><button type="button" class="lk-btn" data-c="c" data-v="${v}" aria-pressed="${c === v}" aria-label="Child ${v}">○</button></td><td>${v}</td></tr>`).join('')}</table>`;
    wrap.querySelectorAll('button').forEach((b) => { if (b.getAttribute('aria-pressed') === 'true') b.textContent = '●'; b.addEventListener('click', () => { if (b.dataset.c === 'a') a = +b.dataset.v; else c = +b.dataset.v; draw(); }); });
    if (a === null || c === null) { out.textContent = 'Pick one value in each column.'; return; }
    const n = a + c === 80, m = 15 * a + 8 * c === 1060;
    out.innerHTML = `Tickets: ${a} + ${c} = ${a + c} ${n ? '✓' : '✗ (needs 80)'}. Money: 15 × ${a} + 8 × ${c} = ${(15 * a + 8 * c).toLocaleString('en-US')} ${m ? '✓' : '✗ (needs 1,060)'}. ` + (n && m ? '<b>Both conditions hold: this pair scores.</b>' : n || m ? '<b>Only one condition holds.</b> Trap pairs are built to pass one check.' : '');
  };
  draw();
}
