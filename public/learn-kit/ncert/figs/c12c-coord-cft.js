// Class 12 Chemistry, Coordination Compounds: crystal field splitting. In an octahedral field the five d orbitals split into t2g (three, lower, -0.4 delta_o each) and eg (two, higher,
// +0.6 delta_o each). Electrons fill the lower level first (Aufbau); for d4 to d7 they either pair up in t2g (if delta_o is larger than the pairing energy P: strong field, low spin) or go
// up into eg (if delta_o < P: weak field, high spin). In a tetrahedral field the order flips (e below t2) and delta_t = 4/9 delta_o is small, so tetrahedral complexes are always high spin.
// CFSE = (-0.4 n(t2g) + 0.6 n(eg)) delta_o for octahedral and (-0.6 n(e) + 0.4 n(t2)) delta_t for tetrahedral; the pairing energy is not included.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let d = 6, mode = 'strong';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Splitting of the d orbitals in octahedral and tetrahedral crystal fields, with the electrons placed' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'd electrons', min: 1, max: 10, step: 1, value: d, fmt: (v) => 'd' + v, oninput: (v) => { d = v; go(); } });
  choice(ctl, 'field', [['weak', 'octahedral, weak'], ['strong', 'octahedral, strong'], ['tet', 'tetrahedral']], mode, (v) => { mode = v; go(); });
  const place = () => {
    // returns {low:[3 or 2 boxes], high:[...], lowN, highN}
    const nl = mode === 'tet' ? 2 : 3, nh = mode === 'tet' ? 3 : 2, low = Array(nl).fill(0), high = Array(nh).fill(0);
    const add = (arr) => { const i = arr.indexOf(Math.min(...arr)); arr[i]++; };
    if (mode === 'strong') { let r = d; while (r > 0 && low.reduce((a, b) => a + b, 0) < 6) { add(low); r--; } while (r > 0) { add(high); r--; } }
    else { // Hund across both levels, then pair, lowest first
      let r = d; const slots = [...low.map((_, i) => ['l', i]), ...high.map((_, i) => ['h', i])];
      slots.forEach(([k, i]) => { if (r > 0) { (k === 'l' ? low : high)[i] = 1; r--; } });
      slots.forEach(([k, i]) => { if (r > 0) { (k === 'l' ? low : high)[i] = 2; r--; } });
    }
    return { low, high };
  };
  const st = () => {
    const { low, high } = place(), nl = low.reduce((a, b) => a + b, 0), nh = high.reduce((a, b) => a + b, 0), un = [...low, ...high].filter((v) => v === 1).length;
    const cfse = mode === 'tet' ? -0.6 * nl + 0.4 * nh : -0.4 * nl + 0.6 * nh;
    return { low, high, nl, nh, un, cfse, mu: Math.sqrt(un * (un + 2)) };
  };
  const go = () => {
    const s = st(), spinTxt = (d >= 4 && d <= 7 && mode !== 'tet') ? (mode === 'strong' ? 'low spin' : 'high spin') : mode === 'tet' ? 'high spin' : 'only one way to fill';
    ro.textContent = `d${d}, ${mode === 'tet' ? 'tetrahedral' : 'octahedral ' + mode + ' field'}: ${s.un} unpaired, μ = ${s.mu.toFixed(2)} BM (${spinTxt}). CFSE = ${s.cfse.toFixed(2)} ${mode === 'tet' ? 'Δt' : 'Δo'}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'tet' ? 'Tetrahedral: e below t₂' : 'Octahedral: t₂g below e_g', col), s = st(), tet = mode === 'tet';
    const T = top + 24, B = h - 34, mid = (T + B) / 2, D = Math.min(130, (B - T) * 0.62) * (tet ? 0.55 : mode === 'strong' ? 1 : 0.62);
    const frac = tet ? [-0.6, 0.4] : [-0.4, 0.6], yl = mid - frac[0] * D, yh = mid - frac[1] * D;
    const lx = w * 0.14, ls = 30;
    line(ctx, [[lx, mid], [lx + ls, mid]], col.muted, 2); text(ctx, 'free ion', lx + ls / 2, mid + 14, { color: col.muted, size: 10.5, align: 'center' });
    ctx.setLineDash([3, 4]); line(ctx, [[lx + ls, mid], [w * 0.34, yl]], col.line, 1.2); line(ctx, [[lx + ls, mid], [w * 0.34, yh]], col.line, 1.2); ctx.setLineDash([]);
    const bx = w * 0.34, bw = 34, gap = 8;
    const levelRow = (arr, y, label) => {
      const n = arr.length, x0 = bx + (w * 0.66 - 10 - (n * bw + (n - 1) * gap)) / 2 + 12;
      arr.forEach((e, i) => { const x = x0 + i * (bw + gap); line(ctx, [[x, y], [x + bw, y]], col.ink, 3); if (e >= 1) arrow(ctx, x + bw * 0.3, y - 3, x + bw * 0.3, y - 30, col.s[2], 2.2, 6); if (e === 2) arrow(ctx, x + bw * 0.7, y - 30, x + bw * 0.7, y - 3, col.s[2], 2.2, 6); });
      text(ctx, label, bx - 8, y - 2, { color: col.ink, size: 12, weight: 700, align: 'right' });
    };
    levelRow(s.low, yl, tet ? 'e' : 't₂g'); levelRow(s.high, yh, tet ? 't₂' : 'e_g');
    // delta bracket
    const ax = w - 24; arrow(ctx, ax, yl, ax, yh + 2, col.s[3], 2, 7); arrow(ctx, ax, yh, ax, yl - 2, col.s[3], 2, 7); text(ctx, tet ? 'Δt' : 'Δo', ax - 6, (yl + yh) / 2, { color: col.s[3], size: 13, weight: 700, align: 'right' });
    text(ctx, tet ? 'Δt = 4/9 Δo: small, so electrons spread out (always high spin)' : mode === 'strong' ? 'Δo larger than pairing energy P: fill t₂g first' : 'Δo smaller than P: electrons go up to e_g before pairing', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
