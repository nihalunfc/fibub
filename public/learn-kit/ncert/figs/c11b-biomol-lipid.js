// Class 11 Biomolecules: fatty acids. A saturated fatty acid has only single C-C bonds, so the chain is straight and packs tightly (solid fats such as ghee). Each cis double bond puts a kink
// in the chain, so the molecules pack less well and the oil stays liquid (groundnut, sunflower). Slide the number of double bonds and read the melting point of the matching 18-carbon acid.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const NAME = ['stearic acid (18:0, saturated)', 'oleic acid (18:1, mono-unsaturated)', 'linoleic acid (18:2, poly-unsaturated)', 'linolenic acid (18:3, poly-unsaturated)'];
const MP = [69.6, 13.4, -5, -11];
const DB = [[], [8], [8, 11], [8, 11, 14]];       // double bond between carbon k and k+1 (1-based index in chain)
export default function (host) {
  let n = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A fatty acid of 18 carbons with a chosen number of double bonds, drawn straight or kinked, with its melting point' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Double bonds (cis)', min: 0, max: 3, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); go(); } });
  const go = () => { ro.textContent = `${NAME[n]}: melts at about ${MP[n]} °C, so at a room temperature of 30 °C it is a ${MP[n] > 30 ? 'solid (a fat)' : 'liquid (an oil)'}. ${n === 0 ? 'The straight chains stack like pencils in a box.' : 'The kinks stop the chains stacking, so less heat is needed to melt it.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Fatty acid shape and melting point', col), fy = footer(ctx, w, h, col, 'Fats and oils are triglycerides: glycerol with three fatty acids joined by ester bonds. Saturated fats raise the risk of heart disease more than unsaturated oils.');
    const N = 18, ys = t0 + 56, x0 = 34, sx = (w - 60) / (N + 0.5);
    const pts = []; let x = x0, y = ys, dir = 1;
    for (let i = 1; i <= N; i++) { pts.push([x, y]); x += sx; y += dir * 12; dir = -dir; }
    // kinks: a cis double bond shifts the following chain down
    const ptsK = []; let off = 0;
    for (let i = 0; i < N; i++) { const isDB = DB[n].includes(i + 1); if (isDB) off += 0; ptsK.push([pts[i][0], pts[i][1] + (DB[n].filter((d) => d < i + 1).length) * 14]); }
    ctx.lineWidth = 3; ctx.lineJoin = 'round';
    for (let i = 0; i < N - 1; i++) {
      const [a, b] = [ptsK[i], ptsK[i + 1]], isDB = DB[n].includes(i + 1);
      ctx.strokeStyle = isDB ? col.s[4] : col.s[3]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      if (isDB) { ctx.beginPath(); ctx.moveTo(a[0] + 3, a[1] + 5); ctx.lineTo(b[0] + 3, b[1] + 5); ctx.stroke(); }
    }
    ellipse(ctx, ptsK[0][0] - 8, ptsK[0][1], 9, 9, col.s[0], col.panel, 1.5); text(ctx, 'COOH', ptsK[0][0] - 8, ptsK[0][1] - 16, { color: col.s[0], size: 10, weight: 700, align: 'center', fit: false });
    text(ctx, 'CH₃', ptsK[N - 1][0] + 2, ptsK[N - 1][1] - 14, { color: col.muted, size: 10, weight: 700, align: 'center', fit: false });
    DB[n].forEach((k) => text(ctx, 'C=C', (ptsK[k - 1][0] + ptsK[k][0]) / 2, ptsK[k - 1][1] - 18, { color: col.s[4], size: 10, weight: 700, align: 'center', fit: false }));
    // melting thermometer bar
    const bx = 22, bw = w - 44, by = fy - 46;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, bw, 12);
    const X = (t) => bx + (t + 20) / 100 * bw; ctx.fillStyle = col.s[4]; ctx.fillRect(X(-20), by, X(MP[n]) - X(-20), 12);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(30), by - 6); ctx.lineTo(X(30), by + 18); ctx.stroke();
    text(ctx, 'room 30 °C', X(30), by + 28, { color: col.ink, size: 10, align: 'center' }); text(ctx, `melts at ${MP[n]} °C`, Math.max(60, Math.min(w - 60, X(MP[n]))), by - 12, { color: col.s[4], size: 10.5, weight: 700, align: 'center' });
    text(ctx, '-20 °C', bx, by + 28, { color: col.muted, size: 10, fit: false }); text(ctx, '80 °C', bx + bw, by + 28, { color: col.muted, size: 10, align: 'right', fit: false });
  };
  go();
}
