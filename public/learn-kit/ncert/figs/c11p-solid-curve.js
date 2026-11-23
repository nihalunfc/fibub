// Class 11 Mechanical Properties of Solids: the stress-strain curve. Ductile metal: straight line to the proportional limit (Hooke's law), elastic limit, yield, plastic flow,
// ultimate strength, neck and fracture. Brittle glass breaks almost at the elastic limit. Rubber is elastic over huge strain but not linear. "Release" draws the path back:
// from the plastic region the unloading line is parallel to the original slope and leaves a permanent set. Shapes are drawn from simplified formulas, values are typical.
import { canvas, text, title, axes, line, dot, row, slider, choice, button, readout, loop, ease } from '../../kit.js';

export default function (host) {
  let kind = 'steel', p = 0.5, rel = null;
  const MAXE = { steel: 0.24, glass: 0.004, rubber: 6 };
  const strain = () => MAXE[kind] * (kind === 'steel' ? p ** 3 : p);
  let e = strain();
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Stress against strain for steel, glass and rubber with the regions marked' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Material', [['steel', 'ductile (steel)'], ['glass', 'brittle (glass)'], ['rubber', 'rubber']], kind, (v) => { kind = v; e = strain(); rel = null; go(); });
  slider(ctl, { label: 'pull (towards breaking)', min: 0.03, max: 1, step: 'any', value: p, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { p = v; e = strain(); rel = null; go(); } });
  button(ctl, 'Release', () => { rel = { from: e, t: 0 }; });
  const S = {
    steel: (x) => x < 0.012 ? 18000 * x : x < 0.03 ? 216 + (x - 0.012) * 1700 : x < 0.14 ? 247 + 253 * Math.sin((x - 0.03) / 0.11 * Math.PI / 2) : 500 - (x - 0.14) * 1200,
    glass: (x) => 50000 * x, rubber: (x) => 3 * (x + 0.08 * x * x * x),
  };
  const lim = { steel: [0.012, 0.016, 0.03, 0.14, 0.24], glass: [0.004], rubber: [6] };
  const names = { steel: ['Hooke’s law region', 'elastic limit', 'yield: it flows', 'strain hardening', 'neck forms, then it breaks'] };
  const region = () => { const l = lim[kind]; if (kind === 'glass') return 'Straight line all the way: glass snaps with no warning (brittle).'; if (kind === 'rubber') return 'Elastic up to huge strains but the curve is not straight, and unloading takes a different path.'; const i = l.findIndex((v) => e <= v); return names.steel[i < 0 ? 4 : i] ?? ''; };
  const go = () => { ro.textContent = `Strain ${e.toPrecision(2)}: ${region()}${kind === 'steel' && e > 0.016 ? ' Release now and it keeps a permanent stretch.' : ''}`; cv.redraw(); };
  const lp = loop(host, (dt) => { if (rel) { rel.t += dt / 1.6; if (rel.t >= 1) { rel.t = 1; } cv.redraw(); } }, { autoplay: true });
  const cur = () => { if (!rel) return [e, S[kind](e)]; const t = ease(rel.t), s0 = S[kind](rel.from); if (kind === 'steel' && rel.from > 0.016) { const set = rel.from - s0 / 18000, x = rel.from - (rel.from - set) * t; return [x, 18000 * (x - set)]; } if (kind === 'rubber') { const x = rel.from * (1 - t); return [x, S.rubber(x) * (0.8 + 0.2 * (1 - t) ** 3)]; } const x = rel.from * (1 - t); return [x, S[kind](x)]; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Stress–strain curve: ' + { steel: 'ductile metal', glass: 'brittle glass', rubber: 'rubber (elastomer)' }[kind], col);
    const xm = MAXE[kind] * 1.05, ym = kind === 'steel' ? 560 : kind === 'glass' ? 220 : 24;
    const A = axes(ctx, w, h, col, { x: [0, xm], y: [0, ym], xlabel: 'strain (no unit)', ylabel: 'stress (MPa)', l: 48, t: top + 10, fx: (v) => +v.toPrecision(2), fy: (v) => v });
    ctx.save(); A.clip();
    const pts = []; for (let i = 0; i <= 200; i++) { const x = (MAXE[kind] * i) / 200, y = S[kind](x); if (kind === 'steel' && x > 0.24) break; pts.push([A.X(x), A.Y(Math.max(0, y))]); }
    line(ctx, pts, col.s[0], 3);
    if (kind === 'steel') line(ctx, [[A.X(0), A.Y(0)], [A.X(0.016), A.Y(288)]], col.muted, 1.5, [4, 4]);
    ctx.restore();
    if (kind === 'steel') { [[0.01, 'proportional'], [0.03, 'yield'], [0.1, 'ultimate']].forEach(([x, t]) => { const y = S.steel(x); dot(ctx, A.X(x), A.Y(y), 3.5, col.s[2]); }); text(ctx, 'yield', A.X(0.035), A.Y(190), { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'ultimate', A.X(0.12), A.Y(S.steel(0.12)) - 12, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'breaks', A.X(0.235), A.Y(330), { color: col.s[1], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'straight part', A.X(0.02), A.Y(60), { color: col.muted, size: 10.5 }); }
    const [x, y] = cur(); dot(ctx, A.X(x), A.Y(Math.max(0, y)), 6, col.s[3], col.panel);
    if (rel && kind === 'steel') { const set = rel.from - S.steel(rel.from) / 18000; line(ctx, [[A.X(rel.from), A.Y(S.steel(rel.from))], [A.X(set), A.Y(0)]], col.s[3], 1.5, [4, 3]); if (rel.t > 0.99) text(ctx, 'permanent set', A.X(set) + 6, A.Y(0) - 12, { color: col.s[3], size: 10.5, weight: 700 }); }
  };
  go();
}
