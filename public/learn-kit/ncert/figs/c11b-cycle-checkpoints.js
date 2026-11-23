// Class 11 Cell Cycle: checkpoints. A cell moves along G1 -> S -> G2 -> M and may be stopped at three gates: G1/S (is the cell big enough and the DNA undamaged?), G2/M (is all the DNA copied?)
// and the spindle checkpoint in metaphase (is every chromosome attached to the spindle?). Cyclin-CDK proteins push the cell forward. A cell that has lost its checkpoints can divide without control: cancer.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const CASES = { ok: 'All fine', dmg: 'DNA damaged', unc: 'DNA not fully copied', spi: 'Chromosome not attached', can: 'Checkpoints lost (cancer)' };
const GATES = [['G1/S', 0.22, 'dmg'], ['G2/M', 0.62, 'unc'], ['spindle', 0.82, 'spi']];
const MSG = {
  ok: 'All conditions are met, so the cell passes every gate and divides into two normal cells.',
  dmg: 'At the G1/S checkpoint, the protein p53 senses the damaged DNA and stops the cell so that the DNA can be repaired. If the repair fails the cell self-destructs (apoptosis).',
  unc: 'At the G2/M checkpoint the cell waits until all the DNA has been copied without mistakes. Cyclin-CDK stays inactive until then.',
  spi: 'At the spindle checkpoint in metaphase, anaphase does not begin until every chromosome is attached to spindle fibres from both poles.',
  can: 'Mutations in genes such as p53 remove the brakes. The cell passes every gate even with damaged DNA and keeps dividing: a tumour. Anti-cancer drugs often target dividing cells.',
};
export default function (host) {
  let k = 'ok', x = 0, stopped = -1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A cell moving along the cell cycle track and stopping at a checkpoint gate when a problem is present' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Situation', Object.entries(CASES), k, (v) => { k = v; x = 0; stopped = -1; go(); });
  const anim = loop(host, (dt) => { if (stopped < 0) { x += dt * 0.12; GATES.forEach(([n, g, c], i) => { if (x >= g - 0.005 && x < g + 0.05 && k === c && k !== 'can') { stopped = i; x = g - 0.005; } }); if (x > 1.05) x = 0; } cv.redraw(); });
  anim.button(ctl);
  const go = () => { ro.textContent = MSG[k]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Checkpoints guard the cell cycle', col), fy = footer(ctx, w, h, col, 'Cyclins rise and fall; they switch on CDK enzymes (cyclin-dependent kinases) that drive the cell on. Cells that need not divide rest in G0.');
    const L = 24, R = w - 24, y = (t0 + fy) / 2 + 10, X = (f) => L + f * (R - L);
    const ph = [['G1', 0, 0.45, col.s[0]], ['S', 0.45, 0.62, col.s[2]], ['G2', 0.62, 0.8, col.s[3]], ['M', 0.8, 1, col.s[4]]];
    ph.forEach(([n, a, b, c]) => { ctx.fillStyle = c; ctx.fillRect(X(a), y - 8, X(b) - X(a), 16); text(ctx, n, (X(a) + X(b)) / 2, y, { color: col.panel, size: 11, weight: 700, align: 'center', fit: false }); });
    GATES.forEach(([n, g, c], i) => { const gx = X(g === 0.22 ? 0.45 : g === 0.62 ? 0.8 : 0.9), blocked = stopped === i; ctx.strokeStyle = blocked ? col.bad ?? col.s[4] : col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx, y - 30); ctx.lineTo(gx, y + 30); ctx.stroke(); ctx.fillStyle = blocked ? col.bad ?? col.s[4] : col.ink; ctx.fillRect(gx - 7, y - 30, 14, 6); text(ctx, n, gx, y - 42 - (i === 2 ? 14 : 0), { color: blocked ? col.bad ?? col.s[4] : col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); });
    const f = Math.min(1, x), pos = f < 0.22 ? X(f / 0.22 * 0.45) : f < 0.62 ? X(0.45 + (f - 0.22) / 0.4 * 0.35) : X(0.8 + (f - 0.62) / 0.38 * 0.2);
    const px = stopped >= 0 ? X(GATES[stopped][1] === 0.22 ? 0.44 : GATES[stopped][1] === 0.62 ? 0.79 : 0.89) : pos;
    ellipse(ctx, px, y + 54, 14, 14, k === 'ok' || k === 'can' ? col.s[2] : col.s[1], col.panel, 2); text(ctx, stopped >= 0 ? 'STOP' : 'cell', px, y + 54, { color: col.panel, size: 8.5, weight: 700, align: 'center', fit: false });
    if (stopped >= 0) text(ctx, `stopped: ${CASES[k].toLowerCase()}`, w / 2, y + 86, { color: col.bad ?? col.s[4], size: 11, weight: 700, align: 'center', fit: false });
    if (k === 'can') text(ctx, 'gates open: dividing out of control', w / 2, y + 86, { color: col.s[4], size: 11, weight: 700, align: 'center', fit: false });
  };
  go();
}
