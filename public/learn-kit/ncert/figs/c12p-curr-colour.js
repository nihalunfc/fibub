// Class 12 Current Electricity: the colour code of carbon resistors. Two digit bands, a multiplier band (power of ten) and a tolerance band (gold 5 %, silver 10 %).
// Colours: black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9. (A mnemonic: "B B ROY of Great Britain had a Very Good Wife".)
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let a = 4, b = 7, m = 2, tol = 5;
  const NAMES = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'], HEX = ['#111111', '#7b4a1e', '#d32f2f', '#f57c00', '#fbc02d', '#2e7d32', '#1565c0', '#7b1fa2', '#808080', '#f5f5f5'];
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 240, label: 'A resistor with four colour bands' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: '1st band (digit)', min: 1, max: 9, step: 1, value: a, fmt: (v) => v + ' ' + NAMES[v], oninput: (v) => { a = v; go(); } });
  slider(ctl, { label: '2nd band (digit)', min: 0, max: 9, step: 1, value: b, fmt: (v) => v + ' ' + NAMES[v], oninput: (v) => { b = v; go(); } });
  slider(ctl, { label: '3rd band (× 10ⁿ)', min: 0, max: 6, step: 1, value: m, fmt: (v) => 'n = ' + v + ' ' + NAMES[v], oninput: (v) => { m = v; go(); } });
  choice(ctl, '4th band', [[5, 'Gold 5%'], [10, 'Silver 10%']], tol, (v) => { tol = v; go(); });
  const go = () => { const R = (10 * a + b) * 10 ** m, f = R >= 1e6 ? (R / 1e6) + ' MΩ' : R >= 1e3 ? (R / 1e3) + ' kΩ' : R + ' Ω'; ro.textContent = `${NAMES[a]}, ${NAMES[b]}, ${NAMES[m]}, ${tol === 5 ? 'gold' : 'silver'}  →  (${10 * a + b}) × 10^${m} = ${f}, ±${tol}%  (between ${(R * (1 - tol / 100)).toPrecision(3)} and ${(R * (1 + tol / 100)).toPrecision(3)} Ω).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Reading a carbon resistor', col);
    const cy = h * 0.58, x0 = w * 0.18, bw = w * 0.64, bh = Math.min(70, h * 0.32);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(8, cy); ctx.lineTo(x0, cy); ctx.moveTo(x0 + bw, cy); ctx.lineTo(w - 8, cy); ctx.stroke();
    ctx.fillStyle = '#d9b68a'; ctx.beginPath(); ctx.roundRect(x0, cy - bh / 2, bw, bh, 14); ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke();
    const bands = [[0.14, HEX[a]], [0.30, HEX[b]], [0.46, HEX[m]], [0.8, tol === 5 ? '#d4af37' : '#c0c0c0']];
    bands.forEach(([p, c]) => { ctx.fillStyle = c; ctx.fillRect(x0 + bw * p, cy - bh / 2 + 1, bw * 0.08, bh - 2); });
    [['digit', 0.18], ['digit', 0.34], ['× 10ⁿ', 0.50], ['tolerance', 0.84]].forEach(([t, p]) => text(ctx, t, x0 + bw * p, cy + bh / 2 + 16, { color: col.muted, size: 10.5, align: 'center' }));
  };
  go();
}
