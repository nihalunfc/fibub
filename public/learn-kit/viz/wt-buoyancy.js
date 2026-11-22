// Float or sink? A 10 cm cube is dropped into a liquid. Set the cube's density and pick the liquid: the buoyant force
// is the weight of the liquid pushed aside, rho_liquid g V_submerged. It bobs and settles where the two forces are equal,
// so the fraction submerged is rho_object / rho_liquid (or it sinks if that is above 1). Arrows show weight and buoyancy.
import { canvas, text, title, arrow, row, slider, choice, button, readout, loop } from '../kit.js';

const LIQ = { oil: ['Oil', 800], water: ['Water', 1000], brine: ['Salt water', 1025], glyc: ['Glycerine', 1260], hg: ['Mercury', 13600] };
const S = 0.1, D = 0.4, G = 9.8; // cube side, tank depth
export default function (host) {
  let liq = 'water', rho = 600, b = -0.25, v = 0; // b = depth of the cube's bottom below the surface (m)
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 290, label: 'A cube floating or sinking in a liquid with weight and buoyancy arrows' });
  const ctl = row(host);
  choice(ctl, 'Liquid', Object.entries(LIQ).map(([k, x]) => [k, x[0]]), liq, (x) => { liq = x; drop(); });
  slider(ctl, { label: 'Cube density', min: 100, max: 14000, value: rho, log: true, fmt: (x) => `${Math.round(x)} kg/m³`, oninput: (x) => { rho = x; drop(); } });
  const c2 = row(host);
  button(c2, 'Drop again', () => drop());
  const sub = () => Math.min(S, Math.max(0, b));
  const lp = loop(host, (dt) => {
    const rl = LIQ[liq][1];
    for (let i = 0; i < 4; i++) {
      const h = dt / 4, a = G * (1 - (rl * sub()) / (rho * S)) - (b > 0 ? 7 : 0.4) * v;
      v += a * h; b += v * h;
      if (b >= D) { b = D; v = 0; }
    }
    cv.redraw(); show();
  });
  lp.button(c2);
  const out = readout(host);
  function drop() { b = -0.25; v = 0; cv.redraw(); show(); }
  function show() {
    const rl = LIQ[liq][1], f = rho / rl, W = rho * S ** 3 * G, B = rl * sub() * S * S * G;
    out.innerHTML = `Weight ${W.toFixed(1)} N, buoyancy ${B.toFixed(1)} N. ρ_object/ρ_liquid = <b>${f.toFixed(2)}</b>: ${f < 1 ? `it floats with <b>${(f * 100).toFixed(0)} %</b> submerged` : f === 1 ? 'neutral' : '<b>it sinks</b> (even fully under, buoyancy ' + (rl * S ** 3 * G).toFixed(1) + ' N is less than the weight)'}.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const rl = LIQ[liq][1], top = 60, pix = (h - top - 14) / (D + 0.28), surf = top + 0.28 * pix, bx = w * 0.4, s = S * pix;
    title(ctx, `${LIQ[liq][0]}: ${rl} kg/m³`, col);
    ctx.fillStyle = col.soft; ctx.fillRect(10, surf, w - 20, D * pix);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(10, top); ctx.lineTo(10, surf + D * pix); ctx.lineTo(w - 10, surf + D * pix); ctx.lineTo(w - 10, top); ctx.stroke();
    const yb = surf + b * pix, yt = yb - s;
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, yt, s, s);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fillRect(bx, yt, s, s); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, yt, s, s);
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(10, surf); ctx.lineTo(w - 10, surf); ctx.stroke(); ctx.setLineDash([]);
    const cy = yt + s / 2, W = rho * S ** 3 * G, B = rl * sub() * S * S * G, k = 0.9;
    arrow(ctx, bx + s * 0.3, cy, bx + s * 0.3, cy + W * k, col.bad, 3);
    arrow(ctx, bx + s * 0.7, cy, bx + s * 0.7, cy - B * k, col.good, 3);
    text(ctx, 'weight', bx + s + 8, cy + 14, { color: col.bad, size: 11, weight: 600 });
    text(ctx, 'buoyancy', bx + s + 8, cy - 14, { color: col.good, size: 11, weight: 600 });
  };
  drop();
}
