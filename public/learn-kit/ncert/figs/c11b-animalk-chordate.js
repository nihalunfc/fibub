// Class 11 Biology, Animal Kingdom: the four chordate characters and how a chordate differs from a non-chordate. All chordates have, at some stage: a notochord (a firm rod), a dorsal hollow nerve cord,
// pharyngeal gill slits and a post-anal tail. Non-chordates have a ventral solid nerve cord, no notochord and a dorsal heart. In humans most of the four are present only in the embryo.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { ell, rr, note } from '../c11b-lib.js';

const FEAT = ['Notochord', 'Dorsal hollow nerve cord', 'Pharyngeal gill slits', 'Post-anal tail'];
const ST = {
  emb: ['Chordate embryo', [1, 1, 1, 1], 'In every chordate embryo all four characters are present.'],
  fish: ['Adult fish', [0.5, 1, 1, 1], 'Adult fish keep gill slits (gills), the nerve cord and a tail; the notochord is replaced by the backbone.'],
  man: ['Adult human', [0.5, 1, 0, 0.5], 'In the adult human the notochord is replaced by the backbone; the gill slits are gone; the tail is reduced to the tail-bone.'],
  worm: ['Earthworm (non-chordate)', [0, 0, 0, 0], 'A non-chordate: no notochord, a solid nerve cord on the belly side, no gill slits.'],
};
export default function (host) {
  let k = 'emb';
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Four chordate characters present or absent in an embryo, a fish, an adult human and an earthworm' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Animal', Object.entries(ST).map(([v, a]) => [v, a[0]]), k, (v) => { k = v; ro.textContent = ST[k][2]; cv.redraw(); });
  ro.textContent = ST[k][2];
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, ST[k][0], col), cx = w / 2 - 70, cy = y0 + 66, f = ST[k][1], worm = k === 'worm';
    // cross-section
    ell(ctx, cx, cy, 52, 46, col.s[0], col.ink, 2, 0.25);
    text(ctx, 'dorsal (back)', cx, cy - 58, { color: col.muted, size: 10, align: 'center' }); text(ctx, worm ? 'ventral: solid nerve cord' : 'ventral (belly)', cx, cy + 62, { color: col.muted, size: 10, align: 'center' });
    ell(ctx, cx, cy + 6, 18, 14, col.s[3], col.ink, 1.3, 0.4); text(ctx, 'gut', cx, cy + 6, { color: col.ink, size: 10, align: 'center' });
    if (!worm) { ell(ctx, cx, cy - 34, 8, 8, col.s[1], col.ink, 1.5, 0.35); ell(ctx, cx, cy - 34, 3, 3, col.panel, col.ink, 1); ell(ctx, cx, cy - 16, 7, 7, col.s[2], col.ink, 1.5, f[0] === 0 ? 0.1 : f[0] === 0.5 ? 0.4 : 0.9); ell(ctx, cx, cy + 32, 7, 7, col.s[4], col.ink, 1, 0.8);  }
    else { ell(ctx, cx, cy + 32, 8, 8, col.s[1], col.ink, 1.5, 0.8); ell(ctx, cx, cy - 32, 7, 7, col.s[4], col.ink, 1, 0.8);  }
    // tags beside
    const lx = w - 148;
    FEAT.forEach((nm, i) => { const y = y0 + 22 + i * 34, v = f[i], c = v === 1 ? col.s[1] : v === 0.5 ? col.s[4] : col.line; rr(ctx, lx, y - 12, 140, 28, 7, v ? c : col.soft, col.line); text(ctx, nm, lx + 7, y - 2, { color: v === 1 ? col.panel : col.ink, size: 10, weight: 700 }); text(ctx, v === 1 ? 'present' : v === 0.5 ? 'replaced / reduced' : 'absent', lx + 7, y + 9, { color: v === 1 ? col.panel : col.muted, size: 9 }); });
    // side-view bar
    const by = y0 + 168; text(ctx, 'Side view', 14, by - 8, { color: col.muted, size: 10.5, weight: 700 });
    rr(ctx, 14, by, w - 28, 44, 20, col.soft, col.ink, 1.5);
    if (!worm) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = f[0] === 1 ? 5 : f[0] === 0.5 ? 3 : 0; ctx.setLineDash(f[0] === 0.5 ? [6, 4] : []); if (f[0]) { ctx.beginPath(); ctx.moveTo(40, by + 24); ctx.lineTo(w - 50, by + 24); ctx.stroke(); } ctx.setLineDash([]); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(40, by + 12); ctx.lineTo(w - 36, by + 12); ctx.stroke(); for (let g = 0; g < 4; g++) { ctx.strokeStyle = f[2] ? col.s[3] : col.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(60 + g * 10, by + 28); ctx.lineTo(60 + g * 10, by + 40); ctx.stroke(); } if (f[3]) { ctx.strokeStyle = col.ink; ctx.lineWidth = f[3] === 1 ? 3 : 1.5; ctx.beginPath(); ctx.moveTo(w - 40, by + 22); ctx.lineTo(w - 16, by + 34); ctx.stroke(); } }
    else { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(30, by + 34); ctx.lineTo(w - 30, by + 34); ctx.stroke(); text(ctx, 'ventral nerve cord, no notochord', w / 2, by + 20, { color: col.muted, size: 10.5, align: 'center' }); }
    note(ctx, 'Chordates: nerve cord on the back and hollow, notochord below it.', 12, h - 40, w - 24, col, { size: 10.5, color: col.muted });
  };
}
