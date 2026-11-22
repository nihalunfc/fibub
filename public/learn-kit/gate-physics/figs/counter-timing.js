// 9.6 Counter timing diagram. Clock and flip-flop outputs of a 3- or 4-bit counter, simulated event by event:
// ripple (each flip-flop toggles one delay after the falling edge of the stage before) or synchronous (all bits
// change one delay after the clock edge). Optional mod-N: ripple counters clear asynchronously when the count reaches
// N (so N appears briefly as a glitch), synchronous ones load 0 at the next edge. The bottom row shows the count, with
// short-lived wrong states shaded.
import { canvas, row, slider, choice, readout, text, title, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 470, min: 330, label: 'Timing diagram of a ripple or synchronous counter with propagation delays and transient states' });
  let kind = 'ripple', bits = 3, mod = 0, d = 0.12;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Counter', [['ripple', 'Ripple'], ['sync', 'Synchronous']], kind, (v) => { kind = v; re(); });
  choice(ctl, 'Bits', [[3, '3'], [4, '4']], bits, (v) => { bits = v; if (mod >= 2 ** bits) mod = 0; re(); });
  slider(ctl, { label: 'Count to N (0 = full binary)', min: 0, max: 15, step: 1, value: mod, fmt: (v) => (v < 2 ? 'full' : `mod-${v}`), oninput: (v) => { mod = v < 2 ? 0 : Math.min(v, 2 ** bits - 1); re(); } });
  slider(ctl, { label: 'Flip-flop delay (fraction of clock period)', min: 0.02, max: 0.3, step: 0.01, value: d, fmt: (v) => fmt(v, 2), oninput: (v) => { d = v; re(); } });
  const simulate = (cycles) => {
    const n = bits, N = mod || 2 ** n, q = new Array(n).fill(0), tr = q.map(() => [[0, 0]]), counts = [[0, 0]];
    const ev = []; // [time, kind, arg]
    for (let k = 1; k <= cycles; k++) ev.push([k, 'clk', 0]);
    const push = (e) => { ev.push(e); ev.sort((a, b) => a[0] - b[0]); };
    const val = () => q.reduce((s, b, i) => s | (b << i), 0);
    const set = (t, i, v) => { if (q[i] === v) return false; q[i] = v; tr[i].push([t, v]); return true; };
    let clearPending = false;
    while (ev.length) {
      const [t, kindE, arg] = ev.shift();
      if (t > cycles + 1) break;
      if (kindE === 'clk') {
        if (kind === 'ripple') push([t + d, 'tog', 0]);
        else { const nx = (val() + 1) % N; push([t + d, 'load', nx]); }
      } else if (kindE === 'tog') {
        const was = q[arg]; set(t, arg, 1 - was); counts.push([t, val()]);
        if (was === 1 && arg + 1 < n) push([t + d, 'tog', arg + 1]);
        if (mod && (val() & N) === N && !clearPending) { clearPending = true; push([t + d * 0.6, 'clear', 0]); }
      } else if (kindE === 'load') {
        for (let i = 0; i < n; i++) set(t, i, (arg >> i) & 1); counts.push([t, val()]);
      } else if (kindE === 'clear') {
        for (let i = 0; i < n; i++) set(t, i, 0); counts.push([t, 0]); clearPending = false;
        for (let j = ev.length - 1; j >= 0; j--) if (ev[j][1] === 'tog' && ev[j][0] - t < d * 1.01) ev.splice(j, 1);
      }
    }
    return { tr, counts };
  };
  const show = () => {
    const N = mod || 2 ** bits;
    out.innerHTML = kind === 'ripple'
      ? `Ripple counter: the last bit settles up to ${bits} delays (${fmt(bits * d, 2)} clock periods) after the edge, passing through wrong counts on the way (shaded). ${mod ? `The NAND clear fires when the count reaches ${N}, so ${N} flashes briefly before 0: mod-${N}.` : ''} Maximum clock ≈ 1/(${bits}·t_pd) if every output must settle.`
      : `Synchronous counter: all bits change together one delay after the edge, so there are no wrong intermediate counts. ${mod ? `It loads 0 at the edge after ${N - 1}: mod-${N}, with no glitch.` : ''} Maximum clock ≈ 1/(t_cq + t_logic + t_setup), independent of the number of bits.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const cycles = Math.min(18, (mod || 2 ** bits) + 3), sim = simulate(cycles);
    title(ctx, `${kind === 'ripple' ? 'Ripple' : 'Synchronous'} ${bits}-bit counter${mod ? `, mod-${mod}` : ''}`, col);
    const L = 44, R = W - 10, top = 34, rows = bits + 2, rh = (H - top - 12) / rows, X = (t) => L + (t / (cycles + 1)) * (R - L);
    const wave = (pts, r, color) => {
      const yHi = top + r * rh + rh * 0.2, yLo = top + r * rh + rh * 0.75;
      ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
      let v = pts[0][1]; ctx.moveTo(X(0), v ? yHi : yLo);
      for (let i = 1; i < pts.length; i++) { const [t, nv] = pts[i]; ctx.lineTo(X(t), v ? yHi : yLo); ctx.lineTo(X(t), nv ? yHi : yLo); v = nv; }
      ctx.lineTo(X(cycles + 1), v ? yHi : yLo); ctx.stroke(); ctx.restore();
    };
    // clock falls at integers (active edge): high on (k, k+0.5)
    const clkF = [[0, 0]]; for (let k = 0; k <= cycles; k++) { clkF.push([k + 0.5, 1]); clkF.push([k + 1, 0]); }
    text(ctx, 'CLK', 6, top + rh * 0.48, { color: col.ink, size: 11, weight: 700 });
    wave(clkF, 0, col.muted);
    for (let i = 0; i < bits; i++) { text(ctx, `Q${i}`, 8, top + (i + 1) * rh + rh * 0.48, { color: col.ink, size: 11, weight: 700 }); wave(sim.tr[i], i + 1, col.s[i % 8]); }
    // count row
    const r = bits + 1, y0 = top + r * rh + rh * 0.15, y1 = top + r * rh + rh * 0.85;
    text(ctx, 'count', 2, (y0 + y1) / 2, { color: col.ink, size: 10.5, weight: 700 });
    const cs = sim.counts;
    for (let i = 0; i < cs.length; i++) {
      const t0 = cs[i][0], t1 = i + 1 < cs.length ? cs[i + 1][0] : cycles + 1, short = t1 - t0 < 0.45;
      if (t1 <= t0) continue;
      ctx.save(); ctx.globalAlpha = short ? 0.35 : 0.08; ctx.fillStyle = short ? (col.warn || col.s[3]) : col.ink; ctx.fillRect(X(t0), y0, X(t1) - X(t0), y1 - y0); ctx.restore();
      ctx.save(); ctx.strokeStyle = col.line; ctx.strokeRect(X(t0), y0, X(t1) - X(t0), y1 - y0); ctx.restore();
      if (X(t1) - X(t0) > 9) text(ctx, String(cs[i][1]), (X(t0) + X(t1)) / 2, (y0 + y1) / 2, { color: col.ink, size: 10.5, align: 'center', fit: false });
    }
    for (let k = 1; k <= cycles; k++) { ctx.save(); ctx.strokeStyle = col.line; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(X(k), top); ctx.lineTo(X(k), H - 10); ctx.stroke(); ctx.restore(); }
  };
  re();
}
