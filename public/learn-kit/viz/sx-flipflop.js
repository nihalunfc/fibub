// Flip-flops with a timing diagram. Pick D, T, JK or clocked SR, set the inputs, then press "Clock pulse" (or let it
// auto-clock). The state Q changes only at the rising edge of the clock, using the inputs it sees at that instant; changing an
// input between clocks does nothing to Q. The strip chart records the clock, the inputs and Q for the last few slots.
// Try JK = 11 (toggle: it divides the clock by 2), or SR = 11 (forbidden).
import { canvas, line, text, row, button, choice, readout, loop, title } from '../kit.js';

const KINDS = { d: ['D', ['D']], t: ['T', ['T']], jk: ['JK', ['J', 'K']], sr: ['SR', ['S', 'R']] };
export default function (host) {
  let kind = 'd', Q = 0, inp = { D: 1, T: 1, J: 1, K: 0, S: 1, R: 0 }, hist = [], msg = '';
  const cv = canvas(host, { aspect: 0.72, max: 340, min: 260, label: 'A flip-flop with a clock and a timing diagram' });
  const ctl = row(host);
  choice(ctl, 'Type', Object.entries(KINDS).map(([k, v]) => [k, v[0] + ' flip-flop']), kind, (v) => { kind = v; Q = 0; hist = []; msg = ''; mkIn(); push(0); show(); });
  const inRow = row(host), ctl2 = row(host);
  let auto = false;
  function mkIn() { inRow.innerHTML = ''; KINDS[kind][1].forEach((n) => { const b = button(inRow, `${n} = ${inp[n]}`, () => { inp[n] ^= 1; b.textContent = `${n} = ${inp[n]}`; b.setAttribute('aria-pressed', String(!!inp[n])); push(0); show(); }); b.setAttribute('aria-pressed', String(!!inp[n])); }); }
  const snap = (clk) => ({ clk, Q, v: KINDS[kind][1].map((n) => inp[n]) });
  function push(clk) { hist.push(snap(clk)); if (hist.length > 24) hist.shift(); }
  function next(q) {
    const { D, T, J, K, S, R } = inp;
    if (kind === 'd') return [D, `Q takes D = ${D}`];
    if (kind === 't') return T ? [q ^ 1, 'T = 1: Q toggles'] : [q, 'T = 0: Q holds'];
    if (kind === 'jk') return J && K ? [q ^ 1, 'J = K = 1: toggle'] : J ? [1, 'J = 1, K = 0: set'] : K ? [0, 'J = 0, K = 1: reset'] : [q, 'J = K = 0: hold'];
    return S && R ? [q, 'S = R = 1 is forbidden: both outputs would be forced high; the result is undefined (Q left unchanged here)'] : S ? [1, 'S = 1: set'] : R ? [0, 'R = 1: reset'] : [q, 'S = R = 0: hold'];
  }
  function pulse() { const [q2, m] = next(Q); const old = Q; Q = q2; msg = `Rising edge: ${m}. Q: ${old} → ${Q}.`; push(1); push(1); hist[hist.length - 2].Q = old; hist[hist.length - 1].Q = Q; push(0); show(); }
  button(ctl2, 'Clock pulse ↑', () => pulse());
  let acc = 0; loop(host, (dt) => { acc += dt; if (acc > 0.9) { acc = 0; pulse(); } }, { autoplay: false }).button(ctl2);
  button(ctl2, 'Clear', () => { Q = 0; hist = []; msg = 'Cleared to Q = 0.'; push(0); show(); });
  const out = readout(host);
  function show() { out.innerHTML = `<b>Q = ${Q}, Q̄ = ${Q ^ 1}.</b> ${msg || 'Set the inputs and press Clock pulse.'} The next edge would give Q = ${next(Q)[0]} (${next(Q)[1]}).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, KINDS[kind][0] + ' flip-flop timing (edge-triggered)', col);
    const names = ['CLK', ...KINDS[kind][1], 'Q'], rows = names.length, L = 44, R = w - 8, T = 40, rh = Math.min(48, (h - T - 8) / rows), n = 24, sw = (R - L) / n, off = n - hist.length;
    names.forEach((nm, r) => {
      const y0 = T + r * rh + rh - 8, y1 = T + r * rh + 8, c = nm === 'Q' ? col.s[1] : nm === 'CLK' ? col.ink : col.s[0];
      text(ctx, nm, 6, (y0 + y1) / 2, { color: c, size: 11.5, weight: 700 });
      const pts = [];
      hist.forEach((hs, i) => { const v = nm === 'CLK' ? hs.clk : nm === 'Q' ? hs.Q : hs.v[KINDS[kind][1].indexOf(nm)], x0 = L + (off + i) * sw, y = v ? y1 : y0; pts.push([x0, y], [x0 + sw, y]); });
      line(ctx, pts, c, 2.4);
      ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y0 + 4); ctx.lineTo(R, y0 + 4); ctx.stroke();
    });
    hist.forEach((hs, i) => { if (hs.clk && (i === 0 || !hist[i - 1].clk)) { const x = L + (off + i) * sw; line(ctx, [[x, T], [x, T + rows * rh]], col.s[1], 1, [3, 3]); text(ctx, '↑', x + 2, T - 4, { color: col.s[1], size: 11, weight: 700 }); } });
  };
  mkIn(); push(0); show();
  return { step(i) { if (i === 0) { Q = 0; hist = []; msg = ''; push(0); show(); } else pulse(); } };
}
