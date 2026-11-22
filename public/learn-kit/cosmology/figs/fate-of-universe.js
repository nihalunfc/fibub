// 9.5 How will the universe end? The size of a flat universe (Ωm = 0.31, dark energy 0.69, H0 = 67.7) from the
// Big Bang into the far future, found by stepping the acceleration equation
// ä = −(H0²/2) a Σ ρ_i (1 + 3w_i) (densities in units of today's critical density) forwards and backwards from
// today. Constant w: ρ_DE = 0.69 a^(−3(1+w)). w = −1 gives the Big Freeze (endless exponential growth);
// w < −1 ("phantom") reaches infinite size at a finite time, the Big Rip, at t_rip found by integrating
// dt = d(ln a)/H to infinity (compared with Caldwell et al.'s estimate (2/3)|1+w|⁻¹ H0⁻¹ (1 − Ωm)^(−1/2)).
// The Big Crunch preset is a toy, not a measured model: dark energy that fades and turns negative,
// ρ_DE = 0.69 (2 − a), so that gravity wins and the universe falls back.
import { canvas, axes, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';
import { hubbleTimeGyr, simpson } from '../phys.js';

const OM = 0.31, ODE = 0.69, H0 = 67.7, TH = hubbleTimeGyr(H0);

function history(mode, w) {
  const rho = mode === 'crunch' ? (a) => ODE * (2 - a) : (a) => ODE * Math.pow(a, -3 * (1 + w));
  // ρ + 3p for dark energy: constant w gives ρ(1 + 3w); the toy gives ODE(3a − 4) (from its continuity equation)
  const rp3 = mode === 'crunch' ? (a) => ODE * (3 * a - 4) : (a) => rho(a) * (1 + 3 * w);
  const acc = (a) => -0.5 * (OM / (a * a) + a * rp3(a));
  const run = (dir, tEnd, aMax) => {
    let a = 1, v = 1, t = 0; const out = [];
    while (Math.abs(t) * TH < tEnd && a > 0.004 && a < aMax) {
      const h = dir * Math.min(0.004, 0.004 * a / Math.max(1e-9, Math.abs(v)), 0.004 / Math.max(1, Math.abs(v)));
      const k1a = v, k1v = acc(a), k2a = v + 0.5 * h * k1v, k2v = acc(a + 0.5 * h * k1a);
      const k3a = v + 0.5 * h * k2v, k3v = acc(a + 0.5 * h * k2a), k4a = v + h * k3v, k4v = acc(a + h * k3a);
      a += (h / 6) * (k1a + 2 * k2a + 2 * k3a + k4a); v += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v); t += h;
      out.push({ t: t * TH, a: Math.max(0, a), v });
    }
    return out;
  };
  const past = run(-1, 20, 1e9).reverse(), fut = run(1, 110, 300);
  const pts = [...past, { t: 0, a: 1, v: 1 }, ...fut];
  const res = { pts, start: past.length ? past[0].t : 0 };
  if (mode === 'crunch') {
    const top = fut.reduce((m, p) => (p.a > m.a ? p : m), { a: 0 });
    res.turn = top; res.end = fut[fut.length - 1].a < 0.01 ? fut[fut.length - 1].t : null;
  } else if (w < -1) {
    const k = -1.5 * (1 + w); // H/H0 = √(Ωm a⁻³ + ΩDE a^(2k)), dt = d(ln a) / H
    res.rip = simpson((x) => 1 / Math.sqrt(OM * Math.exp(-3 * x) + ODE * Math.exp(2 * k * x)), 0, 60 / k, 6000) * TH;
    res.ripEst = (2 / 3) / Math.abs(1 + w) * TH / Math.sqrt(1 - OM);
  }
  return res;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 320, label: 'The size of the universe from the Big Bang to the far future for three possible endings' });
  let mode = 'freeze', w = -1, H = history(mode, w);
  const ctl = row(host);
  const pick = choice(ctl, 'Ending', [['freeze', 'Big Freeze'], ['rip', 'Big Rip'], ['crunch', 'Big Crunch (toy)']], mode, (m) => set(m, m === 'freeze' ? -1 : m === 'rip' ? -1.5 : w));
  const sw = slider(ctl, { label: 'Dark energy w (constant)', min: -2, max: -0.5, step: 0.01, value: w, fmt: (v) => v.toFixed(2), oninput: (v) => { w = v; mode = v < -1 ? 'rip' : 'freeze'; upd(); } });
  const out = readout(host);
  const sync = () => ctl.querySelectorAll('.lk-choice button').forEach((b, i) => b.setAttribute('aria-pressed', String(['freeze', 'rip', 'crunch'][i] === mode)));
  const set = (m, wv) => { mode = m; w = wv; sw.set(w); upd(); };
  const upd = () => { H = history(mode, w); sync(); show(); cv.redraw(); };
  const show = () => {
    if (mode === 'crunch') {
      out.innerHTML = `<b>Toy model:</b> dark energy fades and turns negative. The universe stops growing <b>${H.turn.t.toFixed(0)} billion years</b> from now at ${H.turn.a.toFixed(2)} times today's size, then falls back${H.end ? ` to a <b>Big Crunch ${H.end.toFixed(0)} billion years</b> from now` : ''}. Nothing we measure says this will happen; it shows what would be needed.`;
    } else if (w < -1) {
      const gal = (230e6 * Math.sqrt(2 * Math.abs(1 + 3 * w))) / (6 * Math.PI * Math.abs(1 + w)) / 1e6;
      out.innerHTML = `w = ${w.toFixed(2)} is phantom: <b>Big Rip ${H.rip.toFixed(0)} billion years from now</b> (the rough formula gives ${H.ripEst.toFixed(0)}). The Milky Way would be torn apart about ${gal.toFixed(0)} million years before the end; atoms in the last fraction of a second.`;
    } else {
      out.innerHTML = Math.abs(w + 1) < 0.005
        ? '<b>Big Freeze</b>: growth for ever, doubling about every 12 billion years. Other galaxies slip over the horizon, stars burn out, and everything grows cold and dark.'
        : `w = ${w.toFixed(2)}: dark energy slowly thins, so growth is ${w < -1 / 3 ? 'still speeding up, but more gently' : 'slowing'}. Still a <b>Big Freeze</b>: endless, ever colder expansion.`;
    }
  };
  cv.draw = (ctx, w0, h, col) => {
    const top = title(ctx, { freeze: 'Big Freeze: growing for ever', rip: 'Big Rip: infinite size in a finite time', crunch: 'Big Crunch: gravity wins (a toy model)' }[mode], col);
    const A = axes(ctx, w0, h, col, { x: [-15, 100], y: [0.05, 100], ylog: true, fy: (v) => (v < 1 ? String(+v.toFixed(2)) : String(v)), t: top + 10, l: 44, xlabel: 'Time from today (billion years)', ylabel: 'Size a (today = 1)', xt: [0, 25, 50, 75, 100] });
    ctx.save(); A.clip();
    line(ctx, H.pts.map((p) => [A.X(p.t), A.Y(Math.max(1e-3, p.a))]), col.s[mode === 'rip' ? 3 : mode === 'crunch' ? 2 : 0], 3);
    if (H.rip != null && H.rip < 100) line(ctx, [[A.X(H.rip), A.T], [A.X(H.rip), A.B]], col.s[3], 1.5, [6, 4]);
    ctx.restore();
    dot(ctx, A.X(0), A.Y(1), 5, col.ink, col.panel);
    text(ctx, 'today', A.X(0) + 7, A.Y(1) + 12, { color: col.ink, size: 11.5, weight: 600, halo: col.panel });
    text(ctx, 'Big Bang', A.X(H.start), A.B - 10, { color: col.ink, size: 11, halo: col.panel });
    if (H.rip != null && H.rip < 100) text(ctx, 'rip', A.X(H.rip) + 5, A.T + 12, { color: col.s[3], size: 11.5, weight: 700, halo: col.panel });
    if (mode === 'crunch' && H.end) { text(ctx, 'crunch ↓', A.X(H.end) - 4, A.B - 10, { color: col.s[2], size: 11.5, weight: 700, align: 'right', halo: col.panel }); }
  };
  upd();
  return { step(i) { const m = ['freeze', 'rip', 'crunch', 'freeze'][Math.min(3, i)]; set(m, [-1, -1.5, w, -0.85][Math.min(3, i)]); } };
}
