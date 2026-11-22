// 10.10 Sort transactions into the three cash flow activities. Tap a bucket for each item; the canvas tallies
// the net cash flow per activity for the items sorted correctly.
import { canvas, text, readout } from '../../kit.js';

export const ITEMS = [
  ['Cash received from customers', 'operating', 500000], ['Salaries paid', 'operating', -120000], ['Income tax paid', 'operating', -40000],
  ['Machinery bought', 'investing', -200000], ['Old furniture sold', 'investing', 15000], ['Interest received on investments (non-finance company)', 'investing', 8000],
  ['Shares issued for cash', 'financing', 300000], ['Dividend paid', 'financing', -60000], ['Long-term loan repaid', 'financing', -100000], ['Interest paid on debentures (non-finance company)', 'financing', -24000],
];
export default function (host) {
  const pick = new Map();
  const list = document.createElement('div'); list.style.cssText = 'display:grid;gap:.35rem;margin:.4rem 0';
  host.appendChild(list);
  const cv = canvas(host, { aspect: 0.4, max: 240, min: 170, label: 'Bars for net cash from operating, investing and financing activities' });
  const out = readout(host);
  const draw = () => {
    list.replaceChildren();
    ITEMS.forEach(([name, right, amt], i) => {
      const r = document.createElement('div'); r.style.cssText = 'display:flex;flex-wrap:wrap;gap:.3rem;align-items:center;font-size:.9rem';
      const lab = document.createElement('span'); lab.style.cssText = 'flex:1 1 14rem'; lab.textContent = `${name} (${amt > 0 ? '+' : '−'}₹${Math.abs(amt).toLocaleString('en-IN')})`;
      r.appendChild(lab);
      for (const b of ['operating', 'investing', 'financing']) {
        const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'lk-btn'; btn.textContent = b;
        const chosen = pick.get(i) === b; btn.setAttribute('aria-pressed', String(chosen));
        if (chosen) btn.style.fontWeight = '700', btn.textContent = (b === right ? '✓ ' : '✗ ') + b;
        btn.addEventListener('click', () => { pick.set(i, b); draw(); });
        r.appendChild(btn);
      }
      list.appendChild(r);
    });
    const right = [...pick].filter(([i, b]) => ITEMS[i][1] === b).length;
    out.innerHTML = `${right} of ${pick.size} sorted correctly (${ITEMS.length} in all). Rule: operating = the main business; investing = buying and selling long-term assets and investments; financing = owners and lenders (shares, loans, dividends, interest paid).`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const sums = { operating: 0, investing: 0, financing: 0 };
    for (const [i, b] of pick) if (ITEMS[i][1] === b) sums[b] += ITEMS[i][2];
    const max = 400000, mid = w / 2, rh = (h - 10) / 3;
    Object.entries(sums).forEach(([k, v], j) => {
      const y = 5 + j * rh, ww = (Math.abs(v) / max) * (w / 2 - 70);
      ctx.fillStyle = v >= 0 ? col.s[2] : col.s[1]; ctx.fillRect(v >= 0 ? mid : mid - ww, y + 6, ww, rh - 12);
      text(ctx, k, 8, y + rh / 2, { color: col.ink, size: 12, weight: 600 });
      text(ctx, `${v >= 0 ? '+' : '−'}₹${Math.abs(v).toLocaleString('en-IN')}`, w - 8, y + rh / 2, { color: col.ink, size: 12, align: 'right' });
    });
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(mid, 2); ctx.lineTo(mid, h - 2); ctx.stroke();
  };
  draw();
}
