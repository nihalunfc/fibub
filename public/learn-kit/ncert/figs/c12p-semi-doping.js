// Class 12 Semiconductors: doping silicon. Each Si atom shares its 4 valence electrons in 4 bonds. Replace one atom by phosphorus/arsenic (5 valence electrons, a donor) and one electron is spare:
// n-type, free electrons are the majority carriers. Replace one by boron/aluminium (3 valence electrons, an acceptor) and one bond has a missing electron, a hole: p-type, holes are the
// majority carriers. Apply a field and watch electrons drift one way, holes (electrons hopping into holes) the other. The sample as a whole stays neutral.
import { canvas, text, title, row, slider, choice, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let kind = 'n', nd = 2, field = false, t = 0;
  const r = rng(11);
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A silicon lattice doped n-type or p-type with free electrons or holes moving' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Crystal', [['i', 'Pure Si'], ['n', 'n-type (As)'], ['p', 'p-type (B)']], kind, (v) => { kind = v; go(); });
  slider(ctl, { label: 'dopant atoms', min: 1, max: 6, step: 1, value: nd, fmt: (v) => String(v), oninput: (v) => { nd = Math.round(v); go(); } });
  choice(ctl, 'Electric field', [[false, 'Off'], [true, 'On']], field, (v) => { field = v; go(); });
  const SP = [[1, 1], [4, 2], [2, 3], [5, 0], [0, 3], [3, 0]], pos = Array.from({ length: 6 }, () => [r(), r(), r() * 6.28]);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const go = () => { ro.textContent = kind === 'i' ? 'Pure silicon: very few free electrons and holes (about 1.5 × 10¹⁶ per m³ at room temperature), equal in number: n = p = nᵢ.' : kind === 'n' ? `${nd} donor atom${nd > 1 ? 's give' : ' gives'} ${nd} free electron${nd > 1 ? 's' : ''} here: n ≫ p. The donor atoms become fixed + ions, so the crystal stays neutral. Majority: electrons. Minority: holes. n·p = nᵢ².` : `${nd} acceptor atom${nd > 1 ? 's each leave' : ' leaves'} one hole: p ≫ n. The acceptors become fixed − ions. Majority: holes. Minority: electrons. n·p = nᵢ².`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'i' ? 'Intrinsic silicon' : kind === 'n' ? 'n-type: donor adds a free electron' : 'p-type: acceptor adds a hole', col), cols = 6, rows = 4, gx = (w - 40) / (cols - 1), gy = Math.min(60, (h - top - 90) / (rows - 1)), ox = 20, oy = top + 30;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { if (i < cols - 1) { ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox + i * gx, oy + j * gy); ctx.lineTo(ox + (i + 1) * gx, oy + j * gy); ctx.stroke(); } if (j < rows - 1) { ctx.beginPath(); ctx.moveTo(ox + i * gx, oy + j * gy); ctx.lineTo(ox + i * gx, oy + (j + 1) * gy); ctx.stroke(); } }
    const dop = kind === 'i' ? [] : SP.slice(0, nd);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const d = dop.some((s) => s[0] === i && s[1] === j), x = ox + i * gx, y = oy + j * gy; ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fillStyle = d ? (kind === 'n' ? col.s[2] : col.s[3]) : col.panel; ctx.fill(); ctx.strokeStyle = d ? col.ink : col.muted; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, d ? (kind === 'n' ? 'As' : 'B') : 'Si', x, y, { color: d ? col.panel : col.muted, size: 10.5, weight: 700, align: 'center' }); }
    const n = kind === 'i' ? 1 : nd, ew = (w - 40), eh = gy * (rows - 1), drift = field ? t * 24 : 0;
    for (let k = 0; k < n; k++) {
      const [a, b, ph] = pos[k];
      if (kind !== 'p') { const x = ox + ((a * ew + Math.sin(t * 1.7 + ph) * 12 - drift * 1 + 4000 * ew) % ew), y = oy + b * eh + Math.cos(t * 2.1 + ph) * 8; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); text(ctx, '−', x, y - 0.5, { color: col.panel, size: 10, weight: 700, align: 'center' }); }
      if (kind !== 'n') { const x = ox + ((pos[(k + 3) % 6][0] * ew + Math.sin(t * 1.3 + ph) * 12 + drift + 4000 * ew) % ew), y = oy + pos[(k + 3) % 6][1] * eh + Math.cos(t * 1.9 + ph) * 8; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.stroke(); text(ctx, '+', x, y - 0.5, { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
    }
    if (field) text(ctx, '← electrons drift     holes drift →', w / 2, h - 34, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
    text(ctx, 'blue −: free electron;  orange ring +: hole;  field points to the right on →', w / 2, h - 14, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
