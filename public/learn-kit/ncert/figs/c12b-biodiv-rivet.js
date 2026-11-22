// Class 12 Biology, Biodiversity and Conservation: Paul Ehrlich's rivet-popper hypothesis against the redundant-species view. Every species in an ecosystem is like a rivet holding an
// aeroplane together: losing a few may do no harm, but the loss of key rivets (species) can suddenly damage the whole. The "redundant species" view says many species do the same job,
// so function holds until many are gone. Both are drawn as illustrative curves.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let lost = 5, mode = 'rivet';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A wing with rivets, and a curve of how well the ecosystem works as species are lost under two hypotheses' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'species lost', min: 0, max: 20, step: 1, value: 5, fmt: (v) => v.toFixed(0) + ' of 20', oninput: (v) => { lost = v; go(); } });
  choice(ctl, 'View', [['rivet', 'Rivet popper'], ['redund', 'Redundant species']], 'rivet', (v) => { mode = v; go(); });
  const fn = (x) => (mode === 'rivet' ? Math.max(0, 100 * (1 - Math.pow(x / 20, 1.4))) : 100 * (1 - Math.pow(x / 20, 3.2)));
  const go = () => { ro.textContent = `${lost} of 20 species lost: the ecosystem works at about ${fn(lost).toFixed(0)} % in the ${mode === 'rivet' ? 'rivet-popper' : 'redundant-species'} view. ${mode === 'rivet' ? 'Ehrlich: every species matters, and we cannot tell in advance which loss will be the one that brings the wing down.' : 'Many species do the same work, so early losses are covered by the others; but past a point the function collapses.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Rivets and species', col) + 6, wy = top + 20, ww = w - 40;
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(20, wy + 46); ctx.lineTo(20 + ww, wy + 16); ctx.lineTo(20 + ww, wy + 36); ctx.lineTo(20, wy + 66); ctx.closePath(); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    for (let i = 0; i < 20; i++) { const x = 34 + (i % 10) * (ww - 28) / 9, y = wy + 50 - (x - 20) * 30 / ww + (i < 10 ? -4 : 10), gone = i < lost; dot(ctx, x, y, 4, gone ? col.panel : col.ink, gone ? col.bad : null); }
    const a = axes(ctx, w, h, col, { x: [0, 20], y: [0, 105], xlabel: 'species lost (out of 20)', ylabel: 'ecosystem function (%)', l: 46, t: wy + 92, xt: [0, 5, 10, 15, 20] });
    const P = []; for (let x = 0; x <= 20; x += 0.5) P.push([a.X(x), a.Y(fn(x))]); line(ctx, P, col.s[2], 2.5); dot(ctx, a.X(lost), a.Y(fn(lost)), 5.5, col.s[0], col.panel);
  };
  go();
}
