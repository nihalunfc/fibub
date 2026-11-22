// Class 12 Electric Charges and Fields: electric field lines you can drag. Lines are traced step by step along the field
// E = sum of k q r / r^3 (2-D picture of the 3-D field). They start on positive charges (more lines for a bigger charge),
// never cross, end on negative charges or run off to infinity, and are packed densely where the field is strong.
import { canvas, text, title, dot, arrow, row, button, choice, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let Q = [];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Electric field lines of charges that can be dragged with a finger or mouse' });
  const ctl = row(host), ro = readout(host);
  const preset = (k) => { Q = k === 'dip' ? [{ x: 0.33, y: 0.5, q: 1 }, { x: 0.67, y: 0.5, q: -1 }] : k === 'same' ? [{ x: 0.33, y: 0.5, q: 1 }, { x: 0.67, y: 0.5, q: 1 }] : k === 'plates' ? [{ x: 0.5, y: 0.3, q: 1 }, { x: 0.5, y: 0.7, q: -1 }, { x: 0.35, y: 0.3, q: 1 }, { x: 0.65, y: 0.3, q: 1 }, { x: 0.35, y: 0.7, q: -1 }] : [{ x: 0.5, y: 0.5, q: 1 }]; cv.redraw(); };
  choice(ctl, 'Start with', [['dip', '+ and −'], ['same', '+ and +'], ['one', 'one +'], ['plates', 'two rows']], 'dip', preset);
  button(ctl, 'Add +', () => { if (Q.length < 6) Q.push({ x: 0.5 + (Math.random() - 0.5) * 0.3, y: 0.5 + (Math.random() - 0.5) * 0.3, q: 1 }); cv.redraw(); });
  button(ctl, 'Add −', () => { if (Q.length < 6) Q.push({ x: 0.5 + (Math.random() - 0.5) * 0.3, y: 0.5 + (Math.random() - 0.5) * 0.3, q: -1 }); cv.redraw(); });
  button(ctl, 'Add +2', () => { if (Q.length < 6) Q.push({ x: 0.5 + (Math.random() - 0.5) * 0.3, y: 0.5 + (Math.random() - 0.5) * 0.3, q: 2 }); cv.redraw(); });
  button(ctl, 'Remove last', () => { Q.pop(); cv.redraw(); });
  const field = (x, y, w, h) => { let ex = 0, ey = 0; for (const c of Q) { const dx = x - c.x * w, dy = y - c.y * h, r2 = dx * dx + dy * dy + 4, r3 = r2 * Math.sqrt(r2); ex += c.q * dx / r3; ey += c.q * dy / r3; } return [ex, ey]; };
  cv.draw = (ctx, w, h, col) => {
    const net = Q.reduce((a, c) => a + c.q, 0);
    const trace = (sx, sy, sgn, from) => {
      const pts = [[sx, sy]]; let x = sx, y = sy;
      for (let i = 0; i < 500; i++) {
        const [ex, ey] = field(x, y, w, h), m = Math.hypot(ex, ey); if (m < 1e-9) break;
        x += sgn * 3 * ex / m; y += sgn * 3 * ey / m; pts.push([x, y]);
        if (x < 0 || y < 0 || x > w || y > h) break;
        if (Q.some((c) => c !== from && c.q * sgn < 0 && Math.hypot(x - c.x * w, y - c.y * h) < 7)) break;
      }
      return pts;
    };
    const lines = [];
    const useNeg = Q.every((c) => c.q <= 0);
    for (const c of Q) {
      if ((c.q > 0 && !useNeg) || (c.q < 0 && useNeg)) {
        const n = Math.round(8 * Math.abs(c.q)) + (Math.abs(c.q) > 1 ? 0 : 0);
        for (let k = 0; k < n; k++) { const a = (k + 0.5) / n * 2 * Math.PI; lines.push({ pts: trace(c.x * w + 8 * Math.cos(a), c.y * h + 8 * Math.sin(a), useNeg ? -1 : 1, c), rev: useNeg }); }
      }
    }
    ctx.lineWidth = 1.4; ctx.strokeStyle = col.ink; ctx.fillStyle = col.ink;
    for (const L of lines) {
      ctx.beginPath(); L.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      let acc = 0;
      for (let i = 1; i < L.pts.length; i++) {
        acc += 3; if (acc > 70) { acc = 0; const [x0, y0] = L.pts[i - 1], [x1, y1] = L.pts[i]; const a = Math.atan2(y1 - y0, x1 - x0) + (L.rev ? Math.PI : 0); ctx.save(); ctx.translate(x1, y1); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-4, -3); ctx.lineTo(-4, 3); ctx.closePath(); ctx.fill(); ctx.restore(); }
      }
    }
    for (const c of Q) { const r = 8 + 2 * Math.abs(c.q); dot(ctx, c.x * w, c.y * h, r, c.q > 0 ? col.s[2] : col.s[0], col.panel); text(ctx, c.q > 0 ? (c.q > 1 ? '+' + c.q : '+') : '−', c.x * w, c.y * h, { color: col.panel, size: 13, weight: 700, align: 'center' }); }
    ctx.fillStyle = col.panel; ctx.fillRect(0, 0, w, 28); title(ctx, 'Drag the charges. Lines go from + to −', col, 14);
    ro.textContent = `${Q.length} charge${Q.length === 1 ? '' : 's'}, net charge ${net > 0 ? '+' : ''}${net}. ${net === 0 ? 'Every line that leaves a + arrives at a −.' : 'Far away the lines look like those of one charge of ' + (net > 0 ? '+' : '−') + Math.abs(net) + '.'}`;
  };
  let drag = null;
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  cv.c.style.cursor = 'grab';
  const near = (px, py) => Q.some((c) => Math.hypot(c.x * cv.w - px, c.y * cv.h - py) < 0.09 * cv.w);
  touchGuard(cv.c, near);
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = pos(e); let best = null, bd = 0.09; for (const c of Q) { const d = Math.hypot(c.x - x, (c.y - y) * (cv.h / cv.w)); if (d < bd) { bd = d; best = c; } } if (best) { drag = best; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; const [x, y] = pos(e); drag.x = Math.min(0.97, Math.max(0.03, x)); drag.y = Math.min(0.95, Math.max(0.1, y)); cv.redraw(); });
  const up = () => { drag = null; }; cv.c.addEventListener('pointerup', up); cv.c.addEventListener('pointercancel', up);
  preset('dip');
}
