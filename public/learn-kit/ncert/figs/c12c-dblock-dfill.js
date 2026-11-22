// Class 12 Chemistry, d- and f-block: filling the 3d and 4s boxes across Sc to Zn (and their ions), with unpaired electrons and the spin-only magnetic moment.
// Hund's rule: electrons go singly into the five 3d boxes first. Cr (3d5 4s1) and Cu (3d10 4s1) are the usual exceptions. Ions lose the 4s electrons first, then 3d.
// Spin-only moment: mu = sqrt(n(n+2)) Bohr magnetons, n = number of unpaired electrons. Zero unpaired = diamagnetic.
import { canvas, text, title, arrow, row, slider, readout } from '../../kit.js';

const EL = [['Sc', 1, 2], ['Ti', 2, 2], ['V', 3, 2], ['Cr', 5, 1], ['Mn', 5, 2], ['Fe', 6, 2], ['Co', 7, 2], ['Ni', 8, 2], ['Cu', 10, 1], ['Zn', 10, 2]];
const SUP = ['', '⁺', '²⁺', '³⁺'];

export default function (host) {
  let k = 5, q = 2;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'The 4s and 3d orbital boxes of a first-row transition metal or ion, with unpaired electrons and magnetic moment' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'element', min: 0, max: 9, step: 1, value: k, fmt: (v) => EL[v][0], oninput: (v) => { k = v; go(); } });
  slider(ctl, { label: 'charge on the ion', min: 0, max: 3, step: 1, value: q, fmt: (v) => (v ? '+' + v : '0'), oninput: (v) => { q = v; go(); } });
  const state = () => {
    let d = EL[k][1], s = EL[k][2], rem = q;
    const fromS = Math.min(s, rem); s -= fromS; rem -= fromS; d -= rem;
    const du = d <= 5 ? d : 10 - d, su = s === 1 ? 1 : 0, n = du + su;
    return { d, s, du, su, n, mu: Math.sqrt(n * (n + 2)) };
  };
  const go = () => {
    const S = state(), name = EL[k][0] + SUP[q];
    ro.textContent = `${name}: 3d${S.d} 4s${S.s}. Unpaired electrons n = ${S.n}, so μ = √(n(n+2)) = ${S.mu.toFixed(2)} BM (${S.n ? 'paramagnetic' : 'diamagnetic'}).` + (S.d === 0 || S.d === 10 ? ' No partly filled d subshell: the ion is colourless.' : '');
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const S = state(), top = title(ctx, `${EL[k][0]}${SUP[q]}: electrons in 4s and 3d`, col);
    const bs = Math.min(46, (w - 36) / 7.4), x0 = (w - bs * 7.4) / 2, y0 = top + 26;
    const box = (x, label, up, dn, hi) => {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.fillStyle = col.soft; ctx.fillRect(x, y0, bs, bs); ctx.strokeRect(x, y0, bs, bs);
      if (up) arrow(ctx, x + bs * 0.3, y0 + bs * 0.85, x + bs * 0.3, y0 + bs * 0.15, hi ? col.s[0] : col.s[2], 2.4, 6);
      if (dn) arrow(ctx, x + bs * 0.7, y0 + bs * 0.15, x + bs * 0.7, y0 + bs * 0.85, hi ? col.s[0] : col.s[2], 2.4, 6);
      text(ctx, label, x + bs / 2, y0 + bs + 12, { color: col.muted, size: 11, align: 'center' });
    };
    box(x0, '4s', S.s >= 1, S.s === 2, false);
    for (let i = 0; i < 5; i++) { const up = i < S.d || false, dn = S.d > 5 && i < S.d - 5; box(x0 + bs * 2.4 + i * bs, '3d', up, dn, true); }
    text(ctx, 'Hund: one electron in each 3d box before any pairs', w / 2, y0 + bs + 32, { color: col.muted, size: 10.5, align: 'center' });
    // moment gauge
    const gy = y0 + bs + 78, gx = 26, gw = w - 52, max = 6;
    ctx.fillStyle = col.line; ctx.fillRect(gx, gy, gw, 14); ctx.fillStyle = col.s[3]; ctx.fillRect(gx, gy, gw * S.mu / max, 14);
    for (let n = 0; n <= 5; n++) { const m = Math.sqrt(n * (n + 2)), x = gx + gw * m / max; ctx.fillStyle = col.ink; ctx.fillRect(x - 0.5, gy + 14, 1.5, 5); text(ctx, String(n), x, gy + 29, { color: n === S.n ? col.ink : col.muted, size: 11, weight: n === S.n ? 700 : 400, align: 'center' }); }
    text(ctx, 'μ (BM) on the bar; the numbers are n', gx, gy - 10, { color: col.muted, size: 10.5 });
    text(ctx, `n = ${S.n}   μ = ${S.mu.toFixed(2)} BM`, w / 2, gy + 56, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, S.n ? 'paramagnetic: pulled into a magnetic field' : 'diamagnetic: pushed out of a magnetic field', w / 2, gy + 78, { color: col.muted, size: 11.5, align: 'center' });
  };
  go();
}
