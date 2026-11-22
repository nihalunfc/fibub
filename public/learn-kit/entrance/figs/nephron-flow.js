// Excretion: what happens to the filtrate along a nephron. Bars show how much of the day's 180 L of filtrate is
// still in the tubule after each part; the line shows its osmolarity (mOsmol/L). Switch ADH on or off: with ADH the
// collecting duct takes back water and urine reaches about 1200 mOsmol/L; without it a large volume of dilute urine
// leaves. Volumes are rounded, illustrative values built on NCERT Class 11 figures (GFR 180 L/day, PCT 70-80%).
import { canvas, text, row, choice, readout, line, dot } from '../../kit.js';

const PARTS = ['Bowman\'s capsule', 'end of PCT', 'loop tip', 'end of ascending limb', 'end of DCT', 'urine'];
const SHORT = ['Capsule', 'PCT', 'Loop tip', 'Asc. limb', 'DCT', 'Urine'];
const DATA = {
  adh: { vol: [180, 45, 27, 27, 18, 1.5], osm: [300, 300, 1200, 100, 150, 1200] },
  none: { vol: [180, 45, 27, 27, 25, 18], osm: [300, 300, 1200, 100, 100, 70] },
};
const NOTE = [
  'Glomerular filtration: about 125 mL a minute, 180 L a day. The filtrate is plasma without its proteins, so its osmolarity matches plasma (300).',
  'PCT: brush-border cuboidal cells take back nearly all glucose and amino acids and 70 to 80% of the water and salts; the filtrate stays isotonic. H⁺, K⁺ and NH₃ are secreted, HCO₃⁻ reabsorbed.',
  'Descending limb: lets water out but almost no salt, so the filtrate becomes concentrated, up to about 1200 at the tip in the inner medulla.',
  'Ascending limb: lets salt out but no water, so the filtrate becomes dilute (hypotonic) by the time it returns to the cortex.',
  'DCT: conditional reabsorption of Na⁺ and water (aldosterone), HCO₃⁻ reabsorbed, H⁺, K⁺ and NH₃ secreted.',
  'Collecting duct: with ADH much water leaves into the salty medulla, giving about 1.5 L of urine a day, up to four times as concentrated as the filtrate. Without ADH, little water is reabsorbed: a large volume of dilute urine (as in diabetes insipidus).',
];
export default function (host) {
  let adh = 'adh', i = 5;
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'Filtrate volume and osmolarity along the nephron' });
  const ctl = row(host);
  choice(ctl, 'ADH', [['adh', 'ADH present'], ['none', 'No ADH']], adh, (v) => { adh = v; cv.redraw(); show(); });
  const ctl2 = row(host);
  choice(ctl2, 'Point', SHORT.map((s, k) => [k, s]), i, (v) => { i = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const d = DATA[adh];
    out.innerHTML = `<b>${PARTS[i]}</b>: about ${d.vol[i]} L a day left (${((d.vol[i] / 180) * 100).toFixed(d.vol[i] < 18 ? 1 : 0)}% of the filtrate), osmolarity about ${d.osm[i]} mOsmol/L. ${i === 5 && adh === 'none' ? 'Without ADH the collecting duct stays almost watertight.' : NOTE[i]}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const d = DATA[adh], L = 40, R = w - 40, top = 26, mid = h * 0.5, bot = h - 26, step = (R - L) / 6;
    text(ctx, 'osmolarity (mOsmol/L)', L, 12, { color: col.muted, size: 10 });
    const oy = (v) => mid - 8 - (v / 1300) * (mid - 8 - top);
    line(ctx, [[L, oy(300)], [R, oy(300)]], col.line, 1, [3, 3]);
    text(ctx, '300', L - 4, oy(300), { color: col.muted, size: 10, align: 'right' });
    const pts = d.osm.map((v, k) => [L + step * (k + 0.5), oy(v)]);
    line(ctx, pts, col.s[1], 2.5);
    pts.forEach(([x, y], k) => { dot(ctx, x, y, k === i ? 6 : 3.5, col.s[1]); if (k === i) text(ctx, String(d.osm[k]), x, y - 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    text(ctx, 'volume left (L/day)', L, mid + 8, { color: col.muted, size: 10 });
    const vy = (v) => bot - (v / 180) * (bot - mid - 22);
    d.vol.forEach((v, k) => {
      const x = L + step * k + 6, bw = step - 12;
      ctx.fillStyle = k === i ? col.s[0] : col.soft; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5;
      ctx.fillRect(x, vy(v), bw, bot - vy(v)); ctx.strokeRect(x, vy(v), bw, bot - vy(v));
      text(ctx, String(v), x + bw / 2, vy(v) - 8, { color: col.ink, size: 10, align: 'center' });
      text(ctx, SHORT[k], x + bw / 2, bot + 12, { color: k === i ? col.ink : col.muted, size: 10, weight: k === i ? 700 : 400, align: 'center' });
    });
  };
  cv.redraw(); show();
}
