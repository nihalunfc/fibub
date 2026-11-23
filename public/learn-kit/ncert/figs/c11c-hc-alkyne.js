// Class 11 Chemistry, Hydrocarbons: how hybridisation changes ethane, ethene and ethyne. More s-character in the carbon hybrid orbital (sp3 25%, sp2 33%, sp 50%) holds electrons closer to the nucleus:
// shorter and stronger C-C bonds (154, 134, 120 pm; 346, 614, 839 kJ/mol) and a more acidic C-H (pKa about 50, 44, 25), so the sp C-H of a terminal alkyne is the only one removed by NaNH2 or Ag+ / Cu+ (ammoniacal AgNO3 gives a white ppt).
import { canvas, text, title, choice, readout, row } from '../../kit.js';

const M = {
  a: { n: 'ethane', f: 'H₃C–CH₃', hy: 'sp³', s: 25, len: 154, e: 346, pk: 50, ang: '109.5°' },
  e: { n: 'ethene', f: 'H₂C=CH₂', hy: 'sp²', s: 33, len: 134, e: 614, pk: 44, ang: '120°' },
  y: { n: 'ethyne', f: 'HC≡CH', hy: 'sp', s: 50, len: 120, e: 839, pk: 25, ang: '180°' },
};
export default function (host) {
  let k = 'y';
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 380, label: 'Bars comparing s character, bond length, bond energy and acidity of ethane, ethene and ethyne' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'molecule', [['a', 'ethane'], ['e', 'ethene'], ['y', 'ethyne']], k, (v) => { k = v; go(); });
  const go = () => { const m = M[k]; ro.textContent = `${m.n} (${m.f}): carbon is ${m.hy}, ${m.s}% s-character, bond angle ${m.ang}. More s-character pulls electrons nearer the nucleus, so the C–C bond is ${m.len} pm and ${m.e} kJ/mol, and the C–H bond is more acidic (pKa ≈ ${m.pk}). ` + (k === 'y' ? 'That is why only terminal alkynes react with sodium or ammoniacal silver nitrate to give metal acetylides.' : ''); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const m = M[k], top = title(ctx, `${m.n}: carbon is ${m.hy}`, col) + 10, bw = w - 150;
    const rows = [['s-character (%)', 'ss', 50, (x) => x.s + '%'], ['C–C length (pm)', 'len', 160, (x) => x.len + ' pm'], ['C–C energy (kJ/mol)', 'e', 900, (x) => x.e + ''], ['C–H acidity (lower pKa = more acidic)', 'pk', 52, (x) => 'pKa ' + x.pk]];
    rows.forEach(([lab, key, mx, f], r) => {
      const y = top + 14 + r * 76; text(ctx, lab, 12, y, { color: col.muted, size: 10.5 });
      Object.entries(M).forEach(([kk, d], i) => { const v = key === 'ss' ? d.s : d[key], yy = y + 14 + i * 16, on = kk === k; ctx.fillStyle = on ? col.s[3] : col.line; ctx.fillRect(66, yy, bw * v / mx, 12); text(ctx, d.n, 12, yy + 6, { color: on ? col.ink : col.muted, size: 9.5, weight: on ? 700 : 400 }); if (on) text(ctx, f(d), 70 + bw * v / mx, yy + 6, { color: col.ink, size: 10, weight: 700 }); });
    });
    text(ctx, 'selected molecule: orange bars', w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
