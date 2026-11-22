// A pulse on a string meets the end. Fixed end: the pulse comes back upside down. Free end: it comes back the same way
// up. Join the string to a heavier one and part of the pulse reflects inverted, the rest goes on, slower and bigger
// in size; join it to a lighter one and the reflected part is the right way up. The faint pulses are the incident and reflected parts.
import { canvas, axes, line, text, title, row, choice, button, readout, loop } from '../kit.js';

const CASES = { fixed: ['Fixed end', -1, 0], free: ['Free end', 1, 0], heavy: ['Into heavier string', null, 0.5], light: ['Into lighter string', null, 2] };
const V1 = 1;
const g = (s) => Math.exp(-s * s / 0.18);
export default function (host) {
  let cs = 'fixed', t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 300, label: 'A pulse on a string reflecting from a fixed end, a free end or a change of string' });
  const ctl = row(host);
  choice(ctl, 'At x = 0', Object.entries(CASES).map(([k, v]) => [k, v[0]]), cs, (v) => { cs = v; t = 0; upd(); });
  const c2 = row(host);
  const lp = loop(host, (dt) => { t += dt * 0.9; if (t > 6) t = 0; upd(); }); lp.button(c2); button(c2, 'Restart', () => { t = 0; upd(); });
  const out = readout(host);
  const co = () => { const [, r, v2f] = CASES[cs]; if (r !== null) return { r, tt: 0, v2: 0 }; const v2 = v2f * V1; return { r: (v2 - V1) / (v2 + V1), tt: (2 * v2) / (v2 + V1), v2 }; };
  function upd() {
    const c = co();
    out.innerHTML = cs === 'fixed' || cs === 'free' ? `${CASES[cs][0]}: reflected pulse = ${c.r < 0 ? '<b>inverted</b> (the wall pulls the string down as the pulse arrives, so it comes back as a trough)' : '<b>same way up</b> (a free end flicks up and sends the pulse straight back)'}. No energy is lost, so it has the same height.` : `Reflection coefficient r = (v₂ − v₁)/(v₂ + v₁) = <b>${c.r.toFixed(2)}</b>, transmission t = 2v₂/(v₂ + v₁) = <b>${c.tt.toFixed(2)}</b>; the wave on the other string moves at v₂ = ${c.v2.toFixed(1)} v₁ (heavier string: slower). ${c.r < 0 ? 'Reflected pulse is inverted.' : 'Reflected pulse is the right way up.'} Check: 1 + r = t.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const c = co(), s0 = -3 + V1 * t * 1; title(ctx, CASES[cs][0], col);
    const A = axes(ctx, w, h, col, { x: [-4, 4], y: [-1.4, 1.4], xlabel: 'position x (string; boundary at x = 0)', ylabel: '', t: 30, b: 34, l: 12, yt: [], xt: [-4, -2, 0, 2, 4], fx: (v) => v });
    const pts = (f, x0, x1) => { const a = []; for (let i = 0; i <= 160; i++) { const x = x0 + ((x1 - x0) * i) / 160; a.push([A.X(x), A.Y(f(x))]); } return a; };
    const inc = (x) => g(x - V1 * t + 3), refl = (x) => c.r * g(-x - V1 * t + 3), tr = (x) => c.tt * g((V1 * x) / (c.v2 || 1) - V1 * t + 3);
    const free = cs === 'free' || cs === 'fixed';
    ctx.save(); A.clip();
    line(ctx, pts(inc, -4, 0), col.s[0], 1.5, [4, 4]); line(ctx, pts(refl, -4, 0), col.s[2], 1.5, [4, 4]);
    line(ctx, pts((x) => inc(x) + refl(x), -4, 0), col.s[0], 3);
    if (!free) { line(ctx, pts(tr, 0, 4), col.s[1], 3); }
    ctx.restore();
    const bx = A.X(0);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3;
    if (cs === 'fixed') { ctx.beginPath(); ctx.moveTo(bx, A.Y(-1.2)); ctx.lineTo(bx, A.Y(1.2)); ctx.stroke(); }
    else if (cs === 'free') { ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(bx, A.Y(-1.2)); ctx.lineTo(bx, A.Y(1.2)); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'free ring on a rod', bx - 6, A.Y(-1.15), { color: col.muted, size: 10, align: 'right' }); }
    else { ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(bx, A.Y(-1.2)); ctx.lineTo(bx, A.Y(1.2)); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'joint', bx + 4, A.Y(-1.15), { color: col.muted, size: 10 }); text(ctx, cs === 'heavy' ? 'heavier string' : 'lighter string', A.X(2), A.Y(1.15), { color: col.muted, size: 10, align: 'center' }); }
  };
  upd();
}
