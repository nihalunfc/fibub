// 12.4 The record for the most distant galaxy confirmed with a spectrum, year by year (selected records):
// RD1 z = 5.34 (Dey et al. 1998); HCM-6A 6.56 (Hu et al. 2002); IOK-1 6.96 (Iye et al. 2006); SXDF-NB1006-2 7.215
// (Shibuya et al. 2012); z8_GND_5296 7.51 (Finkelstein et al. 2013); EGSY8p7 8.68 (Zitrin et al. 2015); GN-z11 11.09
// (Oesch et al. 2016, Hubble grism; JWST later measured 10.60, Bunker et al. 2023); JADES-GS-z13-0 13.20 (Curtis-Lake
// et al. 2023, announced Dec 2022); JADES-GS-z14-0 14.32 (Carniani et al. 2024); MoM-z14 14.44 (Naidu et al. 2025).
// Age of the universe at each redshift from the Planck-like model in phys.js.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { ageGyr, lookbackGyr, PLANCK18 as P } from '../phys.js';

const REC = [
  [1998, 5.34, 'RD1', 'Keck'], [2002, 6.56, 'HCM-6A', 'Keck'], [2006, 6.96, 'IOK-1', 'Subaru'],
  [2012, 7.215, 'SXDF-NB1006-2', 'Subaru'], [2013, 7.51, 'z8_GND_5296', 'Hubble + Keck'], [2015, 8.68, 'EGSY8p7', 'Hubble + Keck'],
  [2016, 11.09, 'GN-z11', 'Hubble (JWST later: 10.60)'], [2022.95, 13.2, 'JADES-GS-z13-0', 'JWST'],
  [2024.4, 14.32, 'JADES-GS-z14-0', 'JWST'], [2025.4, 14.44, 'MoM-z14', 'JWST'],
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 320, label: 'Record redshift of the most distant confirmed galaxy against year, from Hubble to JWST' });
  let k = REC.length - 1;
  const ctl = row(host);
  slider(ctl, { label: 'Record', min: 0, max: REC.length - 1, step: 1, value: k, fmt: (v) => REC[Math.round(v)][2], oninput: (v) => { k = Math.round(v); upd(); } });
  const out = readout(host);
  const ages = REC.map(([, z]) => ageGyr(z, P) * 1000);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Farthest confirmed galaxy, by year', col) + 4;
    const A = axes(ctx, w, h, col, { x: [1995, 2027], y: [4, 16], t: top + 8, l: 44, r: 16, xlabel: 'Year', ylabel: 'Redshift z', xt: [2000, 2010, 2020], yt: [4, 6, 8, 10, 12, 14, 16], fx: (v) => String(v) });
    ctx.save(); A.clip();
    // JWST launch
    line(ctx, [[A.X(2021.98), A.T], [A.X(2021.98), A.B]], col.s[3], 1.5, [5, 4]);
    // staircase of records
    const st = [];
    REC.forEach(([y, z], i) => { if (i) st.push([A.X(y), A.Y(REC[i - 1][1])]); st.push([A.X(y), A.Y(z)]); });
    st.push([A.X(2027), A.Y(REC[REC.length - 1][1])]);
    line(ctx, st, col.s[0], 2);
    REC.forEach(([y, z], i) => dot(ctx, A.X(y), A.Y(z), i === k ? 7 : 4.5, i >= 7 ? col.s[3] : col.s[0], i === k ? col.ink : col.panel));
    // GN-z11 revised value
    dot(ctx, A.X(2023.4), A.Y(10.6), 3.5, col.muted);
    line(ctx, [[A.X(2016), A.Y(11.09)], [A.X(2023.4), A.Y(10.6)]], col.muted, 1, [2, 3]);
    ctx.restore();
    text(ctx, 'JWST launch', A.X(2021.98) - 6, A.B - 12, { color: col.s[3], size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'Hubble era', A.X(2003), A.T + 12, { color: col.muted, size: 11, weight: 700, align: 'center', halo: col.panel });
    const [y, z, name] = REC[k];
    const right = A.X(y) > w * 0.6;
    text(ctx, `${name}: z = ${z}`, A.X(y) + (right ? -12 : 12), A.Y(z) + (k >= 7 ? 18 : -14), { color: col.ink, size: 11.5, weight: 700, align: right ? 'right' : 'left', halo: col.panel });
  };
  const upd = () => {
    const [y, z, name, tel] = REC[k];
    out.innerHTML = `<b>${name}</b> (${Math.floor(y)}, ${tel}): z = ${z}. Its light left when the universe was <b>${Math.round(ages[k])} million years</b> old (${(100 * ages[k] / 13800).toFixed(1)}% of its age now) and travelled for ${lookbackGyr(z, P).toFixed(2)} billion years. Its light is stretched ${(1 + z).toFixed(2)} times.`;
    cv.redraw();
  };
  upd();
}
