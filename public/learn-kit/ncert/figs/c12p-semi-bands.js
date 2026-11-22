// Class 12 Semiconductors: energy bands of a conductor, semiconductors and an insulator. Electrons sit in the valence band; to conduct they need to reach the conduction band.
// A band gap Eg stops them unless heat (or light) lifts them: the share of electrons that make it is about exp(-Eg / 2kT). Silicon (1.1 eV) and germanium (0.67 eV) gain carriers quickly as T rises;
// diamond (about 5.5 eV) keeps none; copper's bands overlap so it always conducts. The dots show the relative number on a log scale (illustrative, not an exact count).
import { canvas, text, title, row, slider, choice, readout, loop, rng } from '../../kit.js';

const MAT = { cu: ['Copper', 0, 'conductor'], si: ['Silicon', 1.1, 'semiconductor'], ge: ['Germanium', 0.67, 'semiconductor'], di: ['Diamond', 5.5, 'insulator'] };

export default function (host) {
  let mat = 'si', T = 300, t = 0;
  const kB = 8.617e-5, r = rng(5);
  const seeds = Array.from({ length: 24 }, () => [r(), r(), r() * 6.28]);
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Energy bands with a gap for copper, silicon, germanium and diamond, and electrons lifted by heat' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Material', [['cu', 'Copper'], ['si', 'Silicon'], ['ge', 'Germanium'], ['di', 'Diamond']], mat, (v) => { mat = v; go(); });
  slider(ctl, { label: 'temperature T (K)', min: 50, max: 700, step: 10, value: T, fmt: (v) => v + ' K', oninput: (v) => { T = v; go(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const frac = () => (MAT[mat][1] === 0 ? 1 : Math.exp(-MAT[mat][1] / (2 * kB * T)));
  const dots = () => (mat === 'cu' ? 24 : Math.round(Math.max(0, Math.min(24, (Math.log10(frac()) + 20) * 1.5))));
  const go = () => { const [n, eg, kind] = MAT[mat]; ro.textContent = eg === 0 ? `${n} (${kind}): the bands overlap, so plenty of free electrons at any temperature.` : `${n} (${kind}): Eg = ${eg} eV. Thermal energy kT = ${(kB * T).toFixed(3)} eV at ${T} K, so only a share of about e^(−Eg/2kT) = ${frac() < 1e-3 ? frac().toExponential(1) : frac().toFixed(4)} of the electrons are lifted across. ${kind === 'insulator' ? 'Almost none: it does not conduct.' : 'Hotter means more carriers, so resistance FALLS.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Energy bands (' + MAT[mat][2] + ')', col), x0 = 70, x1 = w - 30, cb = top + 12, gap = MAT[mat][1], gp = gap === 0 ? -20 : 14 + Math.min(gap, 5.5) * 13, cbH = 46, vbTop = cb + cbH + gp, vbH = 56;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(x0, cb, x1 - x0, cbH); ctx.fillRect(x0, vbTop, x1 - x0, vbH); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.strokeRect(x0, cb, x1 - x0, cbH); ctx.strokeRect(x0, vbTop, x1 - x0, vbH);
    text(ctx, 'conduction band', x1 - 6, cb + 12, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'valence band', x1 - 6, vbTop + vbH - 12, { color: col.muted, size: 10.5, align: 'right' });
    text(ctx, 'E', 20, cb + 24, { color: col.ink, size: 13, weight: 700 });
    if (gap > 0) { const y = cb + cbH; ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(x0 - 14, y); ctx.lineTo(x0 - 14, vbTop); ctx.stroke(); ctx.setLineDash([]); text(ctx, `Eg = ${gap} eV`, x0 - 18, (y + vbTop) / 2, { color: col.s[2], size: 11, weight: 700, align: 'right' }); }
    const n = dots(); let ci = 0;
    for (let i = 0; i < 24; i++) {
      const [a, b, ph] = seeds[i], x = x0 + 10 + a * (x1 - x0 - 90) + Math.sin(t * 2 + ph) * 5;
      if (i < n) { const y = cb + 12 + b * (cbH - 24) + Math.cos(t * 2.4 + ph) * 4; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); ci++; }
      const yv = vbTop + 12 + b * (vbH - 24);
      ctx.beginPath(); ctx.arc(x + 5, yv, 5, 0, 7); if (i < n && mat !== 'cu') { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke(); } else { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1; }
    }
    text(ctx, mat === 'cu' ? 'Free electrons everywhere: conducts' : `${n} of 24 dots lifted (log scale)`, w / 2, h - 36, { color: col.s[7], size: 12, weight: 700, align: 'center' });
    text(ctx, 'filled dot: electron;  orange ring: hole left behind', w / 2, h - 16, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
