// Class 12 Chemistry, Haloalkanes: chirality of a carbon with four groups. If all four groups are different the carbon is a stereocentre and the molecule is chiral: its mirror image
// cannot be placed on top of it (a pair of enantiomers, like left and right hands). If two groups are the same there is a mirror plane through the carbon and the molecule is achiral.
// Pick the groups; drag to turn both models together; use the switch to hide or show the mirror image.
import { canvas, text, title, line, row, choice, button, readout, loop, touchGuard } from '../../kit.js';

const T = 1 / Math.sqrt(3), POS = [[T, T, T], [T, -T, -T], [-T, T, -T], [-T, -T, T]];
const SET = {
  a: { n: '2-bromobutane: H, CH₃, C₂H₅, Br', g: ['H', 'CH₃', 'C₂H₅', 'Br'], ch: true },
  b: { n: '2-bromopropane: H, CH₃, CH₃, Br', g: ['H', 'CH₃', 'CH₃', 'Br'], ch: false },
  c: { n: 'bromochloroiodomethane: H, Cl, Br, I', g: ['H', 'Cl', 'Br', 'I'], ch: true },
  d: { n: 'dichloromethane: H, H, Cl, Cl', g: ['H', 'H', 'Cl', 'Cl'], ch: false },
};
const FILL = { H: 3, 'CH₃': 4, 'C₂H₅': 5, Br: 6, Cl: 2, I: 7 };
export default function (host) {
  let key = 'a', ax = 0.6, ay = 0.3, drag = null, auto = true, show = true;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A carbon with four groups and its mirror image' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'groups', [['a', 'CH₃CHBrC₂H₅'], ['b', 'CH₃CHBrCH₃'], ['c', 'CHBrClI'], ['d', 'CH₂Cl₂']], key, (v) => { key = v; go(); });
  button(ctl, 'Mirror image on / off', () => { show = !show; go(); });
  loop(host, (dt) => { if (auto && !drag) { ax += dt * 0.45; cv.redraw(); } });
  const c = cv.c;
  c.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY, ax, ay]; auto = false; c.setPointerCapture(e.pointerId); });
  c.addEventListener('pointermove', (e) => { if (!drag) return; ax = drag[2] + (e.clientX - drag[0]) * 0.012; ay = drag[3] + (e.clientY - drag[1]) * 0.012; cv.redraw(); });
  c.addEventListener('pointerup', () => { drag = null; });
  touchGuard(c, () => true);
  const go = () => { const s = SET[key]; ro.textContent = `${s.n}. ` + (s.ch ? 'Four different groups: the carbon is a stereocentre (marked *), the molecule is chiral and exists as two enantiomers. The mirror image does not fit on the original.' : 'Two groups are the same: there is a mirror plane through the carbon, so the molecule is achiral and its mirror image is the same molecule.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = SET[key], top = title(ctx, s.ch ? 'Chiral: C* has four different groups' : 'Achiral: two groups the same', col), S = Math.min(w / 5.2, (h - top) * 0.3), cy = top + (h - top) * 0.52;
    const one = (cx, mir) => {
      const P = (p) => { let [x, y, z] = [mir ? -p[0] : p[0], p[1], p[2]], co = Math.cos(ax), si = Math.sin(ax); [x, z] = [co * x + si * z, -si * x + co * z]; co = Math.cos(ay); si = Math.sin(ay); [y, z] = [co * y - si * z, si * y + co * z]; const f = 1 / (1 - z * 0.12); return [cx + x * S * f, cy - y * S * f, z]; };
      const m = P([0, 0, 0]), items = POS.map((p, i) => ({ p: P(p), i }));
      items.push({ p: m, i: -1 }); items.sort((a, b) => a.p[2] - b.p[2]);
      items.forEach(({ p, i }) => { if (i < 0) { ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, 7); ctx.fill(); text(ctx, s.ch ? 'C*' : 'C', p[0], p[1], { color: col.panel, size: 9.5, weight: 700, align: 'center' }); return; } line(ctx, [m, p], col.muted, 2.5); const g = s.g[i]; ctx.fillStyle = col.s[(FILL[g] ?? 1) % 8]; ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p[0], p[1], g === 'H' ? 8 : 13, 0, 7); ctx.fill(); ctx.stroke(); text(ctx, g, p[0], p[1], { color: col.panel, size: g.length > 2 ? 8.5 : 10, weight: 700, align: 'center' }); });
    };
    if (show) { one(w * 0.25, false); one(w * 0.75, true); ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w / 2, top + 6); ctx.lineTo(w / 2, h - 28); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'mirror', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'molecule', w * 0.25, h - 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, 'mirror image', w * 0.75, h - 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); }
    else one(w / 2, false);
  };
  go();
}
