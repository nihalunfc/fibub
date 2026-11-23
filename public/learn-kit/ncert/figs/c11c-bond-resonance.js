// Class 11 Chemistry, Chemical Bonding: resonance in the carbonate ion CO3(2-) and ozone O3. No single Lewis structure is right; the real ion is the hybrid.
// CO3(2-): three equivalent forms, each with one C=O and two C-O(-). Measured: all three C-O bonds are equal, 129 pm (C-O single about 143, C=O about 120). Bond order 4/3, each O carries 2/3 of the charge.
// O3: two forms, both O-O bonds 128 pm (single 148, double 121). Bond order 1.5. The forms are not real, nothing flips back and forth.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mol = 'CO3', view = 'cycle', t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Resonance forms of carbonate or ozone cycling and the hybrid with equal bonds' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'ion or molecule', [['CO3', 'carbonate CO₃²⁻'], ['O3', 'ozone O₃']], mol, (v) => { mol = v; go(); });
  choice(ctl, 'view', [['cycle', 'forms in turn'], ['hybrid', 'real hybrid']], view, (v) => { view = v; go(); });
  const anim = loop(host, (dt) => { t += dt; if (view === 'cycle') cv.redraw(); });
  anim.button(ctl);
  const go = () => { ro.textContent = view === 'hybrid' ? (mol === 'CO3' ? 'The real carbonate ion: three identical C–O bonds of 129 pm, bond order 1⅓, each O with −⅔ charge.' : 'The real ozone: two identical O–O bonds of 128 pm, bond order 1.5, the end O atoms each −½ and the middle +1.') : 'The forms are on-paper pictures. The real molecule never sits in one of them: it is the blend of all.'; cv.redraw(); };
  const bond = (ctx, x0, y0, x1, y1, order, col, dashed) => {
    const nx = (y1 - y0), ny = -(x1 - x0), L = Math.hypot(nx, ny) || 1;
    const offs = order === 2 ? [-3, 3] : [0];
    offs.forEach((o) => { ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0 + nx / L * o, y0 + ny / L * o); ctx.lineTo(x1 + nx / L * o, y1 + ny / L * o); ctx.stroke(); });
    if (dashed) { ctx.setLineDash([5, 4]); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0 + nx / L * 4, y0 + ny / L * 4); ctx.lineTo(x1 + nx / L * 4, y1 + ny / L * 4); ctx.stroke(); ctx.setLineDash([]); }
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, view === 'cycle' ? 'Resonance forms (the real molecule is none of them)' : 'The resonance hybrid: equal bonds, charge shared', col);
    const cx = w / 2, cy = t0 + (h - t0) * 0.4, R = Math.min(w, h) * 0.27;
    const isC = mol === 'CO3', n = isC ? 3 : 2, k = Math.floor(t / 1.3) % n;
    const pos = isC ? [[cx, cy - R], [cx - R * 0.87, cy + R * 0.5], [cx + R * 0.87, cy + R * 0.5]] : [[cx - R * 0.9, cy + R * 0.45], [cx + R * 0.9, cy + R * 0.45]];
    const c0 = isC ? [cx, cy] : [cx, cy - R * 0.45];
    const ends = pos.map((p, i) => ({ p, dbl: view === 'cycle' && i === (isC ? k : k), i }));
    ends.forEach((e) => bond(ctx, c0[0], c0[1], e.p[0], e.p[1], e.dbl ? 2 : 1, col.ink, view === 'hybrid'));
    const node = (x, y, s, c) => { ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, s, x, y, { color: c, size: 13, weight: 700, align: 'center' }); };
    node(c0[0], c0[1], isC ? 'C' : 'O', isC ? col.ink : col.s[0]);
    ends.forEach((e) => {
      node(e.p[0], e.p[1], 'O', col.s[0]);
      let ch = '', c = col.muted;
      if (view === 'hybrid') { ch = isC ? '−⅔' : '−½'; c = col.bad; } else if (isC) { ch = e.dbl ? '0' : '−1'; c = e.dbl ? col.good : col.bad; } else { ch = e.dbl ? '0' : '−1'; c = e.dbl ? col.good : col.bad; }
      const a = Math.atan2(e.p[1] - c0[1], e.p[0] - c0[0]); text(ctx, ch, e.p[0] + Math.cos(a) * 28, e.p[1] + Math.sin(a) * 28, { color: c, size: 12.5, weight: 700, align: 'center' });
    });
    if (!isC) text(ctx, view === 'hybrid' ? '+1' : '+1', c0[0], c0[1] - 28, { color: col.good, size: 12.5, weight: 700, align: 'center' });
    const msg = view === 'hybrid' ? (isC ? 'all three C–O: 129 pm, bond order 4/3' : 'both O–O: 128 pm, bond order 3/2') : (isC ? `form ${k + 1} of 3: C=O (120 pm) and two C–O (143 pm)` : `form ${k + 1} of 2: O=O (121 pm) and O–O (148 pm)`);
    text(ctx, msg, w / 2, h - 30, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    text(ctx, view === 'hybrid' ? 'measured: no short bond, no long bond' : 'measured bonds are all equal and in between', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
