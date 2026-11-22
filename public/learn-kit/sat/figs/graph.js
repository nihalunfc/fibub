// SAT course: one graphing figure for many lessons, picked by data-mode on the <figure>:
//   line        y = mx + b with slope and intercept sliders, the rise-over-run triangle and intercepts
//   system      two lines, their crossing point, and what happens when they are parallel or the same
//   inequality  a line with the half-plane shaded; solid or dashed edge
//   parabola    y = a(x − h)² + k: vertex, axis, zeros and the discriminant
//   transform   a parent graph and f(x − h) + k moved by sliders
//   exp         exponential growth or decay against a straight line with the same start
//   nonlinear   a parabola and a line: 0, 1 or 2 crossing points
//   cubic       a polynomial from its three zeros
// Plain canvas from the lesson kit (fibub.com watermark, light/dark/red modes handled). Nothing is sent anywhere.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

const f1 = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : (+v.toFixed(2)).toString()).replace('-', '−');
const lin = (m, b) => `${m === 0 ? '' : (m === 1 ? '' : m === -1 ? '−' : f1(m)) + 'x'}${b === 0 ? (m === 0 ? '0' : '') : (m === 0 ? f1(b) : (b < 0 ? ' − ' : ' + ') + f1(Math.abs(b)))}`;

export default function (host, { data }) {
  const mode = data.mode || 'line';
  const S = { m: +(data.m ?? 2), b: +(data.b ?? 1), m2: +(data.m2 ?? -1), b2: +(data.b2 ?? 4), a: +(data.a ?? 1), h: +(data.h ?? 1), k: +(data.k ?? -4),
    above: true, solid: false, parent: 'sq', P: 100, r: 10, grow: true, c: -2, z1: -2, z2: 1, z3: 3 };
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 260, label: `Graph: ${mode}` });
  const ctl = row(host);
  const out = readout(host);
  const go = () => { cv.redraw(); show(); };
  const sl = (label, key, min, max, step) => slider(ctl, { label, min, max, step, value: S[key], fmt: f1, oninput: (v) => { S[key] = v; go(); } });

  if (mode === 'line' || mode === 'inequality') { sl('Slope m', 'm', -4, 4, 0.5); sl('Intercept b', 'b', -6, 6, 1); }
  if (mode === 'inequality') {
    choice(ctl, 'Shade', [[true, 'Above (y >)'], [false, 'Below (y <)']], S.above, (v) => { S.above = v; go(); });
    choice(ctl, 'Edge', [[false, 'Dashed (< or >)'], [true, 'Solid (≤ or ≥)']], S.solid, (v) => { S.solid = v; go(); });
  }
  if (mode === 'system') { sl('Line 1 slope', 'm', -4, 4, 0.5); sl('Line 1 intercept', 'b', -6, 6, 1); sl('Line 2 slope', 'm2', -4, 4, 0.5); sl('Line 2 intercept', 'b2', -6, 6, 1); }
  if (mode === 'parabola') { sl('a (width, up or down)', 'a', -3, 3, 0.25); sl('h (left-right)', 'h', -5, 5, 0.5); sl('k (up-down)', 'k', -6, 6, 0.5); }
  if (mode === 'transform') {
    choice(ctl, 'Parent', [['sq', 'x²'], ['abs', '|x|'], ['sqrt', '√x'], ['cube', 'x³']], S.parent, (v) => { S.parent = v; go(); });
    S.h = 0; S.k = 0; sl('h: f(x − h)', 'h', -5, 5, 0.5); sl('k: + k', 'k', -5, 5, 0.5);
  }
  if (mode === 'exp') {
    choice(ctl, 'Change', [[true, 'Growth'], [false, 'Decay']], S.grow, (v) => { S.grow = v; go(); });
    sl('Rate % per step', 'r', 1, 40, 1);
  }
  if (mode === 'nonlinear') { S.m = 1; S.b = 0; sl('Parabola y = x² + c', 'c', -6, 4, 0.5); sl('Line slope', 'm', -4, 4, 0.5); sl('Line intercept', 'b', -6, 6, 0.5); }
  if (mode === 'cubic') { sl('Zero 1', 'z1', -5, 5, 0.5); sl('Zero 2', 'z2', -5, 5, 0.5); sl('Zero 3', 'z3', -5, 5, 0.5); }

  const parentF = { sq: (x) => x * x, abs: Math.abs, sqrt: (x) => (x >= 0 ? Math.sqrt(x) : NaN), cube: (x) => x * x * x };
  const parentName = { sq: 'x²', abs: '|x|', sqrt: '√x', cube: 'x³' };

  function curve(ctx, A, f, color, w = 2.5, dash) {
    const pts = []; let segs = [];
    for (let i = 0; i <= 400; i++) {
      const x = -8 + (16 * i) / 400, y = f(x);
      if (!Number.isFinite(y) || Math.abs(y) > 60) { if (pts.length) segs.push(pts.splice(0)); continue; }
      pts.push([A.X(x), A.Y(y)]);
    }
    if (pts.length) segs.push(pts);
    segs.forEach((s) => line(ctx, s, color, w, dash));
  }

  cv.draw = (ctx, w, h, col) => {
    const ext = mode === 'exp' ? null : 8;
    const A = mode === 'exp'
      ? axes(ctx, w, h, col, { x: [0, 10], y: [0, 300], xlabel: 'steps (years, months, ...)', ylabel: 'amount', l: 46 })
      : axes(ctx, w, h, col, { x: [-ext, ext], y: [-ext * (h / w) * 1.15, ext * (h / w) * 1.15], l: 34, b: 28, xt: [-8, -6, -4, -2, 0, 2, 4, 6, 8], yt: [-6, -4, -2, 0, 2, 4, 6] });
    ctx.save(); A.clip();
    if (mode !== 'exp') { // the two axes through the origin
      line(ctx, [[A.X(-8), A.Y(0)], [A.X(8), A.Y(0)]], col.muted, 1.2);
      line(ctx, [[A.X(0), A.Y(-8)], [A.X(0), A.Y(8)]], col.muted, 1.2);
    }
    if (mode === 'line' || mode === 'inequality') {
      const f = (x) => S.m * x + S.b;
      if (mode === 'inequality') {
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath();
        const yEdge = S.above ? A.Y(20) : A.Y(-20);
        ctx.moveTo(A.X(-8), A.Y(f(-8))); ctx.lineTo(A.X(8), A.Y(f(8))); ctx.lineTo(A.X(8), yEdge); ctx.lineTo(A.X(-8), yEdge); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      curve(ctx, A, f, col.s[0], 2.5, mode === 'inequality' && !S.solid ? [7, 6] : null);
      if (mode === 'line') {
        // slope triangle from the intercept: run 1 (or 2 for half slopes), rise m
        const run = Math.abs(S.m) < 1 && S.m !== 0 ? 2 : 1;
        line(ctx, [[A.X(0), A.Y(S.b)], [A.X(run), A.Y(S.b)], [A.X(run), A.Y(S.b + S.m * run)]], col.s[2], 2, [4, 3]);
        text(ctx, `run ${run}`, A.X(run / 2), A.Y(S.b) + (S.m > 0 ? 12 : -12), { color: col.s[2], size: 11, weight: 600, align: 'center', halo: col.panel });
        text(ctx, `rise ${f1(S.m * run)}`, A.X(run) + 6, A.Y(S.b + (S.m * run) / 2), { color: col.s[2], size: 11, weight: 600, halo: col.panel });
        dot(ctx, A.X(0), A.Y(S.b), 5, col.s[1]);
        if (S.m !== 0) dot(ctx, A.X(-S.b / S.m), A.Y(0), 5, col.s[3]);
      }
    }
    if (mode === 'system') {
      curve(ctx, A, (x) => S.m * x + S.b, col.s[0]);
      curve(ctx, A, (x) => S.m2 * x + S.b2, col.s[1], 2.5, S.m === S.m2 && S.b === S.b2 ? [8, 8] : null);
      if (S.m !== S.m2) { const x = (S.b2 - S.b) / (S.m - S.m2); dot(ctx, A.X(x), A.Y(S.m * x + S.b), 6, col.ink, col.panel); }
    }
    if (mode === 'parabola' || mode === 'nonlinear') {
      const a = mode === 'parabola' ? S.a : 1, hh = mode === 'parabola' ? S.h : 0, kk = mode === 'parabola' ? S.k : S.c;
      const f = (x) => a * (x - hh) ** 2 + kk;
      if (mode === 'parabola') line(ctx, [[A.X(hh), A.Y(-9)], [A.X(hh), A.Y(9)]], col.line, 1.5, [5, 4]);
      curve(ctx, A, f, col.s[0]);
      dot(ctx, A.X(hh), A.Y(kk), 5, col.s[1]);
      if (mode === 'parabola' && a !== 0 && -kk / a >= 0) { const d = Math.sqrt(-kk / a); [hh - d, hh + d].forEach((x) => dot(ctx, A.X(x), A.Y(0), 5, col.s[3])); }
      if (mode === 'nonlinear') {
        curve(ctx, A, (x) => S.m * x + S.b, col.s[2]);
        const D = S.m * S.m - 4 * (S.c - S.b);
        if (D >= 0) [(S.m + Math.sqrt(D)) / 2, (S.m - Math.sqrt(D)) / 2].forEach((x) => dot(ctx, A.X(x), A.Y(S.m * x + S.b), 6, col.ink, col.panel));
      }
    }
    if (mode === 'transform') {
      const p = parentF[S.parent];
      curve(ctx, A, p, col.muted, 2, [6, 5]);
      curve(ctx, A, (x) => p(x - S.h) + S.k, col.s[0]);
      dot(ctx, A.X(S.h), A.Y(S.k), 5, col.s[1]);
    }
    if (mode === 'exp') {
      const b = S.grow ? 1 + S.r / 100 : 1 - S.r / 100, step = S.P * S.r / 100;
      const pts = [], lpts = [];
      for (let i = 0; i <= 200; i++) { const t = (10 * i) / 200; pts.push([A.X(t), A.Y(S.P * b ** t)]); lpts.push([A.X(t), A.Y(S.P + (S.grow ? 1 : -1) * step * t)]); }
      line(ctx, lpts, col.s[2], 2, [6, 5]);
      line(ctx, pts, col.s[0], 2.5);
      for (let t = 0; t <= 10; t++) dot(ctx, A.X(t), A.Y(S.P * b ** t), 3, col.s[0]);
    }
    if (mode === 'cubic') {
      const f = (x) => ((x - S.z1) * (x - S.z2) * (x - S.z3)) / 6;
      curve(ctx, A, f, col.s[0]);
      [S.z1, S.z2, S.z3].forEach((z) => dot(ctx, A.X(z), A.Y(0), 5, col.s[3]));
    }
    ctx.restore();
  };

  function show() {
    let s = '';
    if (mode === 'line') s = `<b>y = ${lin(S.m, S.b)}</b>. The line ${S.m > 0 ? 'rises' : S.m < 0 ? 'falls' : 'stays level'}: every step of 1 to the right changes y by ${f1(S.m)}. It crosses the y-axis at (0, ${f1(S.b)})${S.m !== 0 ? ` and the x-axis at (${f1(-S.b / S.m)}, 0)` : ''}.`;
    if (mode === 'inequality') s = `<b>y ${S.above ? (S.solid ? '≥' : '>') : S.solid ? '≤' : '<'} ${lin(S.m, S.b)}</b>. Every point in the shaded part is a solution. A ${S.solid ? 'solid' : 'dashed'} edge means the line itself ${S.solid ? 'is' : 'is not'} included.`;
    if (mode === 'system') {
      if (S.m !== S.m2) { const x = (S.b2 - S.b) / (S.m - S.m2); s = `Different slopes, so the lines cross once at <b>(${f1(x)}, ${f1(S.m * x + S.b)})</b>: exactly one solution.`; }
      else s = S.b === S.b2 ? 'Same slope and same intercept: it is the same line twice, so <b>infinitely many</b> solutions.' : 'Same slope, different intercepts: the lines are parallel and never meet, so <b>no solution</b>.';
    }
    if (mode === 'parabola') {
      const B = -2 * S.a * S.h, C = S.a * S.h * S.h + S.k, D = B * B - 4 * S.a * C;
      const c1 = (v) => (v === 1 ? '' : v === -1 ? '−' : f1(v));
      s = S.a === 0 ? 'With a = 0 it is not a parabola any more, just the flat line y = k.' : `<b>y = ${c1(S.a)}(x − ${f1(S.h)})² + ${f1(S.k)}</b> = ${c1(S.a)}x² + ${f1(B)}x + ${f1(C)}. Vertex (${f1(S.h)}, ${f1(S.k)}), opens ${S.a > 0 ? 'up' : 'down'}. Discriminant b² − 4ac = ${f1(D)}: <b>${D > 1e-9 ? 'two' : Math.abs(D) < 1e-9 ? 'one' : 'no'}</b> x-intercept${Math.abs(D) < 1e-9 ? '' : 's'}.`;
    }
    if (mode === 'transform') s = `<b>y = f(x − ${f1(S.h)}) + ${f1(S.k)}</b> with f(x) = ${parentName[S.parent]}: the dashed parent graph moves ${S.h >= 0 ? 'right' : 'left'} ${f1(Math.abs(S.h))} and ${S.k >= 0 ? 'up' : 'down'} ${f1(Math.abs(S.k))}. Notice the minus inside the brackets moves it right.`;
    if (mode === 'exp') { const b = S.grow ? 1 + S.r / 100 : 1 - S.r / 100; s = `Solid: <b>100 × ${f1(b)}<sup>t</sup></b> (the same <i>percent</i> each step). Dashed: 100 ${S.grow ? '+' : '−'} ${f1(S.r)}t (the same <i>amount</i> each step). After 10 steps: ${fmt(100 * b ** 10)} against ${fmt(100 + (S.grow ? 1 : -1) * S.r * 10)}.`; }
    if (mode === 'nonlinear') { const D = S.m * S.m - 4 * (S.c - S.b); s = `Setting x² + ${f1(S.c)} = ${lin(S.m, S.b)} gives x² ${S.m <= 0 ? '+' : '−'} ${f1(Math.abs(S.m))}x + ${f1(S.c - S.b)} = 0, with discriminant ${f1(D)}: <b>${D > 1e-9 ? 'two' : Math.abs(D) < 1e-9 ? 'one' : 'no'}</b> crossing point${Math.abs(D) < 1e-9 ? '' : 's'}.`; }
    if (mode === 'cubic') s = `<b>p(x) = (x − ${f1(S.z1)})(x − ${f1(S.z2)})(x − ${f1(S.z3)}) ÷ 6</b>. Each factor that is zero makes the whole product zero, so the graph crosses the x-axis at ${[S.z1, S.z2, S.z3].map(f1).join(', ')}. Put two zeros together and the graph only touches the axis there.`;
    out.innerHTML = s.replace(/x − −/g, 'x + ').replace(/\+ −/g, '− ').replace(/ \+ 0x/g, '').replace(/ \+ 0([^.\d])/g, '$1');
  }
  go();
}
