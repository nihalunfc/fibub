// Levers in the body. Choose the class: first (fulcrum in the middle: nodding the head), second (load in the middle: rising
// on tiptoe), third (effort in the middle: biceps curl, the commonest in the body). Slide the load and the position of the
// effort and read the force the muscle must make from the balance of moments: effort × effort arm = load × load arm.
import { canvas, row, choice, slider, readout, text, title, arrow } from '../kit.js';

const C = {
  one: { n: '1st class: fulcrum between', ex: 'head on the atlas vertebra (nodding), seesaw', order: ['E', 'F', 'L'] },
  two: { n: '2nd class: load between', ex: 'rising on tiptoe, wheelbarrow', order: ['F', 'L', 'E'] },
  three: { n: '3rd class: effort between', ex: 'biceps lifting the forearm, most limbs', order: ['F', 'E', 'L'] },
};
export default function (host) {
  let cls = 'three', load = 5, pos = 0.25;
  const cv = canvas(host, { aspect: 0.72, max: 360, min: 270, label: 'A lever with fulcrum, load and effort and the muscle force needed' });
  const c = row(host), c2 = row(host);
  choice(c, 'Lever', Object.entries(C).map(([k, v]) => [k, v.n]), cls, (v) => { cls = v; show(); });
  slider(c2, { label: 'Load', min: 1, max: 20, step: 1, value: load, fmt: (v) => `${v} kg`, oninput: (v) => { load = v; show(); } });
  slider(c2, { label: 'Effort position', min: 0.1, max: 0.45, step: 0.01, value: pos, fmt: (v) => `${(v * 100).toFixed(0)}% from the fulcrum`, oninput: (v) => { pos = v; show(); } });
  const out = readout(host);
  // positions along the bar from 0 to 1; two of E, F, L are fixed, effort position is slider
  const geom = () => { const o = C[cls].order; const P = {}; if (cls === 'one') { P.F = 0.5; P.E = 0.5 - pos; P.L = 0.5 + 0.4; } else if (cls === 'two') { P.F = 0.05; P.L = 0.05 + pos * 1.2 + 0.1; P.E = 0.95; } else { P.F = 0.05; P.E = 0.05 + pos; P.L = 0.95; } return P; };
  const eff = () => { const P = geom(); return (load * 9.81 * Math.abs(P.L - P.F)) / Math.abs(P.E - P.F); };
  function show() { const P = geom(), E = eff(), MA = (load * 9.81) / E; out.innerHTML = `<b>${C[cls].n}</b> (${C[cls].ex}). Load arm ${(Math.abs(P.L - P.F) * 100).toFixed(0)}, effort arm ${(Math.abs(P.E - P.F) * 100).toFixed(0)} (units along the bar). Effort needed = <b>${E.toFixed(0)} N</b> for a load of ${(load * 9.81).toFixed(0)} N, so mechanical advantage = <b>${MA.toFixed(2)}</b>. ${MA < 1 ? 'Less than 1: the muscle works harder than the load, but the hand moves far and fast (speed and range gained).' : MA > 1 ? 'Greater than 1: a small effort lifts a larger load.' : 'Equal arms: effort equals load.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, C[cls].n, col);
    const P = geom(), X0 = 24, X1 = w - 24, y = h * 0.55, X = (f) => X0 + f * (X1 - X0), tilt = 0;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X0, y); ctx.lineTo(X1, y); ctx.stroke();
    // fulcrum
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(X(P.F), y + 4); ctx.lineTo(X(P.F) - 14, y + 34); ctx.lineTo(X(P.F) + 14, y + 34); ctx.fill(); text(ctx, 'F fulcrum', X(P.F), y + 48, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    // load (down), effort (arrow)
    const Ls = 18 + load * 1.6; ctx.fillStyle = col.s[1]; ctx.fillRect(X(P.L) - Ls / 2, y - 6 - Ls, Ls, Ls); text(ctx, `L ${load} kg`, X(P.L), y - 14 - Ls, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    const dirUp = cls !== 'one' ? 1 : -1, ey = y, len = Math.min(70, 16 + eff() / 8);
    if (cls === 'one') arrow(ctx, X(P.E), y - len, X(P.E), y - 2, col.bad, 4, 11); else arrow(ctx, X(P.E), y + len, X(P.E), y + 2, col.bad, 4, 11);
    text(ctx, `E ${eff().toFixed(0)} N`, X(P.E), cls === 'one' ? y - len - 10 : y + len + 12, { color: col.bad, size: 11, weight: 700, align: 'center' });
    // arm brackets
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(X(P.F), h - 26); ctx.lineTo(X(P.E), h - 26); ctx.stroke(); ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(X(P.F), h - 12); ctx.lineTo(X(P.L), h - 12); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'effort arm', X(P.F) + 2, h - 34, { color: col.muted, size: 9.5, fit: false }); text(ctx, 'load arm', X(P.L), h - 19, { color: col.s[1], size: 9.5, align: 'right', fit: false });
  };
  show();
}
