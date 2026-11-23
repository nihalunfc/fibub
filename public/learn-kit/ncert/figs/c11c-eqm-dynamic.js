// Class 11 Chemistry, Equilibrium: why equilibrium is dynamic. A <=> B with forward rate kf[A] and reverse rate kr[B]. Start with only A (or only B): the forward (or reverse) rate starts high and falls, the other rises, until the two rates are equal.
// [A](t) = Aeq + (A0 - Aeq) e^{-(kf+kr)t}, Aeq = kr/(kf+kr) of the total (1.0 mol/L). K = kf/kr = [B]eq/[A]eq. Nothing stops at equilibrium: both reactions keep going at the same speed.
import { canvas, text, title, row, slider, choice, readout, loop, line, dot } from '../../kit.js';

export default function (host) {
  let kf = 0.6, kr = 0.3, start = 'A', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Concentrations of A and B against time reaching equilibrium with forward and reverse rates' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'start with', [['A', 'only A'], ['B', 'only B']], start, (v) => { start = v; t = 0; go(); });
  slider(ctl, { label: 'forward rate constant kf', min: 0.1, max: 1, step: 0.05, value: kf, fmt: (v) => v.toFixed(2), oninput: (v) => { kf = v; t = 0; go(); } });
  slider(ctl, { label: 'reverse rate constant kr', min: 0.1, max: 1, step: 0.05, value: kr, fmt: (v) => v.toFixed(2), oninput: (v) => { kr = v; t = 0; go(); } });
  const tmax = () => 6 / (kf + kr), Aeq = () => kr / (kf + kr);
  const A = (x) => Aeq() + ((start === 'A' ? 1 : 0) - Aeq()) * Math.exp(-(kf + kr) * x);
  const anim = loop(host, (dt) => { t += dt * tmax() / 6; if (t > tmax() * 1.25) t = 0; cv.redraw(); });
  anim.button(ctl);
  const go = () => { ro.textContent = `At equilibrium [A] = ${Aeq().toFixed(2)} and [B] = ${(1 - Aeq()).toFixed(2)}, so K = kf/kr = ${(kf / kr).toFixed(2)}. Both reactions are still running, at the same speed (${(kf * Aeq()).toFixed(2)} each).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const tt = Math.min(t, tmax()), a = A(tt), b = 1 - a, T0 = title(ctx, 'A ⇌ B: both reactions run until the rates match', col), L = 40, R = w - 14, Tp = T0 + 16, B = h * 0.62;
    const X = (x) => L + x / tmax() * (R - L), Y = (c) => B - c * (B - Tp);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Tp); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    text(ctx, 'conc.', L + 6, Tp + 4, { color: col.muted, size: 10 }); text(ctx, 'time', R - 2, B + 12, { color: col.muted, size: 10, align: 'right' });
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L, Y(Aeq())); ctx.lineTo(R, Y(Aeq())); ctx.moveTo(L, Y(1 - Aeq())); ctx.lineTo(R, Y(1 - Aeq())); ctx.stroke(); ctx.setLineDash([]);
    const pa = [], pb = []; for (let i = 0; i <= 60; i++) { const x = tmax() * i / 60; pa.push([X(x), Y(A(x))]); pb.push([X(x), Y(1 - A(x))]); }
    line(ctx, pa, col.s[0], 2.5); line(ctx, pb, col.s[2], 2.5);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(tt), Tp); ctx.lineTo(X(tt), B); ctx.stroke(); dot(ctx, X(tt), Y(a), 5, col.s[0]); dot(ctx, X(tt), Y(b), 5, col.s[2]);
    text(ctx, '[A]', R - 4, Y(A(tmax())) + (A(tmax()) > 0.5 ? -10 : 10), { color: col.s[0], size: 11, weight: 700, align: 'right' }); text(ctx, '[B]', R - 4, Y(1 - A(tmax())) + (A(tmax()) > 0.5 ? 10 : -10), { color: col.s[2], size: 11, weight: 700, align: 'right' });
    // rates
    const rf = kf * a, rr = kr * b, by = B + 38, bw = R - L - 70;
    text(ctx, 'rate →', L, by, { color: col.s[0], size: 11, weight: 700 }); ctx.fillStyle = col.s[0]; ctx.fillRect(L + 56, by - 7, bw * rf / 0.7, 14); text(ctx, rf.toFixed(2), L + 60 + bw * rf / 0.7, by, { color: col.s[0], size: 10.5 });
    text(ctx, 'rate ←', L, by + 24, { color: col.s[2], size: 11, weight: 700 }); ctx.fillStyle = col.s[2]; ctx.fillRect(L + 56, by + 17, bw * rr / 0.7, 14); text(ctx, rr.toFixed(2), L + 60 + bw * rr / 0.7, by + 24, { color: col.s[2], size: 10.5 });
    text(ctx, Math.abs(rf - rr) < 0.01 ? 'rates equal: EQUILIBRIUM (still moving!)' : 'rates unequal: still changing', w / 2, h - 12, { color: Math.abs(rf - rr) < 0.01 ? col.good : col.muted, size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
