// Class 12 Maths, Integrals: four properties of definite integrals you can see. (1) Splitting at c: the area from a to b
// is the area a to c plus c to b. (2) Odd and even: over [−a, a] an odd function cancels (area 0), an even function
// doubles. (3) Reflection: ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a − x)dx, the same shape flipped left to right has the same area.
// (4) The 2a rule: if f(2a − x) = f(x) then ∫₀²ᵃ f = 2∫₀ᵃ f. Choose a property and move its slider.
import { canvas, axes, row, slider, choice, readout, line, text, title } from '../../kit.js';

export default function (host) {
  let k = 'split', p = 1.2;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A curve with shaded areas showing a property of definite integrals' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  const sl = slider(c2, { label: 'c', min: 0.2, max: 2.8, step: 0.05, value: p, fmt: (v) => v.toFixed(2), oninput: (v) => { p = Math.min(v, SET[k][3]); re(); } });
  const SET = { split: ['split at c', 'c', 0.2, 2.8, 1.2], oddeven: ['odd / even', 'a', 0.3, 2, 1.2], flip: ['reflect', 'a', 0.3, 2.4, 1.5], twoa: ['2a rule', 'a', 0.3, 1.5, 0.8] };
  choice(c1, 'property', Object.entries(SET).map(([i, v]) => [i, v[0]]), k, (v) => { k = v; p = SET[v][4]; sl.set(p); host.querySelector('.lk-slider span').textContent = SET[v][1]; re(); });
  const I = (f, a, b) => { const n = 400; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * (b - a) / n) * (b - a) / n; return s; };
  const fs = (x) => 0.5 * x * x + 0.3 * x + 0.4, fo = (x) => x ** 3 / 2, fe = (x) => x * x / 1.5 + 0.2, ff = (x) => 0.4 + x * x / 2, fc = (x) => x * (2 * p - x) / 2;
  const fill = (ctx, g, f, a, b, c) => { ctx.globalAlpha = 0.3; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(g.X(a), g.Y(0)); for (let i = 0; i <= 60; i++) { const x = a + (b - a) * i / 60; ctx.lineTo(g.X(x), g.Y(f(x))); } ctx.lineTo(g.X(b), g.Y(0)); ctx.fill(); ctx.globalAlpha = 1; };
  const draw = (ctx, g, f, a, b, c, w = 2.5) => { const pts = []; for (let i = 0; i <= 100; i++) { const x = a + (b - a) * i / 100; pts.push([g.X(x), g.Y(f(x))]); } line(ctx, pts, c, w); };
  const re = () => {
    cv.redraw();
    if (k === 'split') out.innerHTML = `∫₀³ f = ${I(fs, 0, 3).toFixed(3)}. Left part ∫₀ᶜ = <b>${I(fs, 0, p).toFixed(3)}</b>, right part ∫ᶜ³ = <b>${I(fs, p, 3).toFixed(3)}</b>. They add to ${(I(fs, 0, p) + I(fs, p, 3)).toFixed(3)}.`;
    if (k === 'oddeven') out.innerHTML = `Odd f(x) = x³/2: ∫₋ₐᵃ = <b>${I(fo, -p, p).toFixed(3)}</b> (left area is negative and cancels the right). Even f: ∫₋ₐᵃ = <b>${I(fe, -p, p).toFixed(3)}</b> = 2 × ${I(fe, 0, p).toFixed(3)}.`;
    if (k === 'flip') out.innerHTML = `∫₀ᵃ f(x)dx = <b>${I(ff, 0, p).toFixed(3)}</b> and ∫₀ᵃ f(a − x)dx = <b>${I((x) => ff(p - x), 0, p).toFixed(3)}</b>: the same.`;
    if (k === 'twoa') out.innerHTML = `f(x) = x(2a − x)/2 is symmetric about x = a, so f(2a − x) = f(x). ∫₀²ᵃ = <b>${I(fc, 0, 2 * p).toFixed(3)}</b> and 2∫₀ᵃ = <b>${(2 * I(fc, 0, p)).toFixed(3)}</b>: equal for every a. (For a curve not symmetric about x = a the rule fails.)`;
  };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, { split: '∫ₐᵇ f = ∫ₐᶜ f + ∫ᶜᵇ f', oddeven: 'Odd functions cancel, even ones double', flip: '∫₀ᵃ f(x)dx = ∫₀ᵃ f(a − x)dx', twoa: 'The 2a rule (only if f(2a − x) = f(x))' }[k], col);
    if (k === 'split') { const g = axes(ctx, w, h, col, { x: [0, 3], y: [0, 6], l: 34, b: 24, t: t + 4, r: 10 }); ctx.save(); g.clip(); fill(ctx, g, fs, 0, p, col.s[0]); fill(ctx, g, fs, p, 3, col.s[1]); draw(ctx, g, fs, 0, 3, col.ink); line(ctx, [[g.X(p), g.Y(0)], [g.X(p), g.Y(fs(p))]], col.ink, 1.5, [4, 3]); ctx.restore(); text(ctx, 'c', g.X(p), g.B + 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    if (k === 'oddeven') { const g = axes(ctx, w, h, col, { x: [-2.2, 2.2], y: [-4, 4], l: 34, b: 24, t: t + 4, r: 10 }); ctx.save(); g.clip(); fill(ctx, g, fo, -p, 0, col.s[3]); fill(ctx, g, fo, 0, p, col.s[0]); draw(ctx, g, fo, -2.2, 2.2, col.ink); draw(ctx, g, (x) => fe(x) - 3.2, -2.2, 2.2, col.muted, 1.5); ctx.restore(); text(ctx, 'odd: red below, blue above', g.L + 6, g.T + 10, { color: col.ink, size: 11 }); text(ctx, 'grey: an even curve (shifted down)', g.L + 6, g.B - 8, { color: col.muted, size: 10.5 }); }
    if (k === 'flip') { const g = axes(ctx, w, h, col, { x: [0, 2.4], y: [0, 3.6], l: 34, b: 24, t: t + 4, r: 10 }); ctx.save(); g.clip(); fill(ctx, g, ff, 0, p, col.s[0]); fill(ctx, g, (x) => ff(p - x), 0, p, col.s[1]); draw(ctx, g, ff, 0, p, col.s[0]); draw(ctx, g, (x) => ff(p - x), 0, p, col.s[1]); ctx.restore(); text(ctx, 'f(x)', g.X(p * 0.9), g.Y(ff(p)) - 8, { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, 'f(a − x)', g.X(0.12), g.Y(ff(p)) - 8, { color: col.s[1], size: 11.5, weight: 700 }); }
    if (k === 'twoa') { const g = axes(ctx, w, h, col, { x: [0, 3.2], y: [0, 1.6], l: 34, b: 24, t: t + 4, r: 10 }); ctx.save(); g.clip(); fill(ctx, g, fc, 0, p, col.s[0]); fill(ctx, g, fc, p, 2 * p, col.s[1]); draw(ctx, g, fc, 0, 2 * p, col.ink); ctx.restore(); text(ctx, 'blue: 0 to a, orange: a to 2a', g.R - 4, g.T + 10, { color: col.ink, size: 11, align: 'right' }); }
  };
  re();
}
