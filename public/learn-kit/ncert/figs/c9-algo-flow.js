// Class 9 Algorithms: a flowchart that runs. Ovals start and stop, parallelograms take input or give output, rectangles do a calculation,
// diamonds ask a yes/no question and send you one of two ways. Choose a program and a number n, then Step (or Play) and follow the
// highlighted box. The loop in "sum of 1 to n" shows how an algorithm repeats a step until a test fails.
import { canvas, text, title, row, slider, choice, button, readout, loop } from '../../kit.js';

const PROGS = {
  sum: {
    name: 'Sum of 1 to n',
    nodes: { st: ['oval', 'Start', 0.5, 0.07], init: ['rect', 'S = 0, i = 1', 0.5, 0.21], dec: ['dia', 'i ≤ n ?', 0.5, 0.42], body: ['rect', 'S = S + i,  i = i + 1', 0.5, 0.64], out: ['para', 'Print S', 0.17, 0.64], en: ['oval', 'Stop', 0.17, 0.86] },
    edges: { 'st>init': [[0.5, 0.07], [0.5, 0.21]], 'init>dec': [[0.5, 0.21], [0.5, 0.42]], 'dec>body': [[0.5, 0.42], [0.5, 0.64]], 'dec>out': [[0.5, 0.42], [0.17, 0.42], [0.17, 0.64]], 'body>dec': [[0.5, 0.64], [0.93, 0.64], [0.93, 0.42], [0.5, 0.42]], 'out>en': [[0.17, 0.64], [0.17, 0.86]] },
    labels: [['Yes', 0.54, 0.54], ['No', 0.3, 0.4]],
  },
  par: {
    name: 'Even or odd',
    nodes: { st: ['oval', 'Start', 0.5, 0.07], inp: ['para', 'Read n', 0.5, 0.22], dec: ['dia', 'n ÷ 2 leaves 0 ?', 0.5, 0.44], ev: ['para', 'Print “even”', 0.2, 0.68], od: ['para', 'Print “odd”', 0.8, 0.68], en: ['oval', 'Stop', 0.5, 0.88] },
    edges: { 'st>inp': [[0.5, 0.07], [0.5, 0.22]], 'inp>dec': [[0.5, 0.22], [0.5, 0.44]], 'dec>ev': [[0.5, 0.44], [0.2, 0.44], [0.2, 0.68]], 'dec>od': [[0.5, 0.44], [0.8, 0.44], [0.8, 0.68]], 'ev>en': [[0.2, 0.68], [0.2, 0.88], [0.5, 0.88]], 'od>en': [[0.8, 0.68], [0.8, 0.88], [0.5, 0.88]] },
    labels: [['Yes', 0.3, 0.4], ['No', 0.7, 0.4]],
  },
};
export default function (host) {
  let p = 'sum', n = 4, idx = 0, last = 0;
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 290, label: 'A flowchart with a highlighted box that moves as the program runs' });
  const c = row(host);
  choice(c, 'Program', [['sum', 'Sum of 1 to n'], ['par', 'Even or odd']], p, (v) => { p = v; idx = 0; upd(); });
  slider(c, { label: 'n', min: 1, max: 9, step: 1, value: n, oninput: (v) => { n = v; idx = 0; upd(); } });
  const c2 = row(host); button(c2, 'Step', () => { anim.pause(); go(); }); const anim = loop(host, (dt, t) => { if (t - last > 0.7) { last = t; go(); } }, { autoplay: false }); anim.button(c2); button(c2, 'Reset', () => { idx = 0; anim.pause(); upd(); });
  const out = readout(host);
  const trace = () => {
    const T = [{ id: 'st', v: '', note: 'Start of the program.' }];
    if (p === 'sum') { let S = 0, i = 1; T.push({ id: 'init', v: `S = 0, i = 1`, note: 'Set the running total S to 0 and the counter i to 1.' }); for (;;) { T.push({ id: 'dec', v: `S = ${S}, i = ${i}`, note: `Is i ≤ n, that is ${i} ≤ ${n}? ${i <= n ? 'Yes: go and add.' : 'No: leave the loop.'}` }); if (i > n) break; S += i; i += 1; T.push({ id: 'body', v: `S = ${S}, i = ${i}`, note: `Add i to S, then increase i by 1.` }); } T.push({ id: 'out', v: `S = ${S}`, note: `Print S = ${S}. The sum of 1 to ${n} is ${S}.` }, { id: 'en', v: `S = ${S}`, note: 'Stop. Only a finite number of steps were used.' }); }
    else { T.push({ id: 'inp', v: `n = ${n}`, note: `Read the number n = ${n}.` }, { id: 'dec', v: `n = ${n}`, note: `${n} ÷ 2 leaves remainder ${n % 2}. Is it 0? ${n % 2 === 0 ? 'Yes.' : 'No.'}` }, { id: n % 2 === 0 ? 'ev' : 'od', v: `n = ${n}`, note: `Print “${n % 2 === 0 ? 'even' : 'odd'}”.` }, { id: 'en', v: `n = ${n}`, note: 'Stop.' }); }
    return T;
  };
  function go() { const T = trace(); idx = idx >= T.length - 1 ? 0 : idx + 1; upd(); }
  cv.draw = (ctx, w, h, col) => {
    const P = PROGS[p], T = trace(), cur = T[Math.min(idx, T.length - 1)], t = title(ctx, 'Flowchart: ' + P.name + ', n = ' + n, col);
    const X = (u) => u * w, Y = (v) => t + 6 + (v / 0.95) * (h - t - 26) * 0.97;
    const passed = new Set(); for (let k = 1; k <= idx && k < T.length; k++) passed.add(T[k - 1].id + '>' + T[k].id);
    Object.entries(P.edges).forEach(([k, pts]) => { const on = passed.has(k); ctx.save(); ctx.strokeStyle = on ? col.s[3] : col.muted; ctx.lineWidth = on ? 3 : 1.5; ctx.beginPath(); pts.forEach(([u, v], i) => (i ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v)))); ctx.stroke(); const [u1, v1] = pts[pts.length - 1], [u0, v0] = pts[pts.length - 2], ang = Math.atan2(Y(v1) - Y(v0), X(u1) - X(u0)), ex = X(u1) - Math.cos(ang) * 18, ey = Y(v1) - Math.sin(ang) * 14; ctx.fillStyle = on ? col.s[3] : col.muted; void ex; void ey; ctx.restore(); });
    P.labels.forEach(([s, u, v]) => text(ctx, s, X(u), Y(v), { color: col.s[5], size: 11, weight: 700, align: 'center', halo: col.panel }));
    Object.entries(P.nodes).forEach(([id, [shape, label, u, v]]) => {
      const x = X(u), y = Y(v), on = id === cur.id, bw = shape === 'dia' ? Math.min(150, w * 0.36) : shape === 'oval' ? 64 : Math.min(shape === 'rect' && label.length > 12 ? 170 : 110, w * 0.4), bh = shape === 'dia' ? 50 : 30;
      ctx.save(); ctx.fillStyle = on ? col.s[3] : col.panel; ctx.globalAlpha = on ? 0.55 : 1; ctx.strokeStyle = on ? col.ink : col.muted; ctx.lineWidth = on ? 2.5 : 1.5; ctx.beginPath();
      if (shape === 'oval') { ctx.ellipse(x, y, bw / 2, bh / 2, 0, 0, 7); } else if (shape === 'dia') { ctx.moveTo(x, y - bh / 2); ctx.lineTo(x + bw / 2, y); ctx.lineTo(x, y + bh / 2); ctx.lineTo(x - bw / 2, y); ctx.closePath(); } else if (shape === 'para') { ctx.moveTo(x - bw / 2 + 10, y - bh / 2); ctx.lineTo(x + bw / 2 + 10, y - bh / 2); ctx.lineTo(x + bw / 2 - 10, y + bh / 2); ctx.lineTo(x - bw / 2 - 10, y + bh / 2); ctx.closePath(); } else ctx.rect(x - bw / 2, y - bh / 2, bw, bh);
      ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
      text(ctx, label, x, y, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    });
    if (cur.v) text(ctx, cur.v, w / 2, h - 8, { color: col.s[2], size: 12, weight: 700, align: 'center' });
  };
  function upd() { const T = trace(), cur = T[Math.min(idx, T.length - 1)]; out.innerHTML = `<b>Step ${idx + 1} of ${T.length}.</b> ${cur.note}`; cv.redraw(); }
  upd();
}
