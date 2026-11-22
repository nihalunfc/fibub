// Class 9 Sequences: figurate numbers. Dots arranged in a growing shape give a sequence: triangular numbers
// 1, 3, 6, 10 ... (add a row of n dots each time), square numbers 1, 4, 9, 16 ... and oblong numbers 2, 6, 12, 20 ...
import { canvas, text, title, row, slider, choice, button, readout, loop, dot } from '../../kit.js';

const K = {
  tri: { name: 'Triangular', f: (n) => (n * (n + 1)) / 2, rule: 'T(n) = n(n + 1) ÷ 2', add: (n) => `adds a row of ${n} dots`, rows: (n) => Array.from({ length: n }, (_, i) => i + 1) },
  sq: { name: 'Square', f: (n) => n * n, rule: 'S(n) = n × n', add: (n) => `adds an L-shape of ${2 * n - 1} dots`, rows: (n) => Array(n).fill(n) },
  obl: { name: 'Oblong', f: (n) => n * (n + 1), rule: 'O(n) = n(n + 1)', add: (n) => `adds ${2 * n} dots`, rows: (n) => Array(n).fill(n + 1) },
};
export default function (host) {
  let k = 'tri', n = 4;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 290, label: 'Dots arranged in triangular, square or oblong patterns that grow with n' });
  const ctl = row(host);
  choice(ctl, 'Pattern', Object.entries(K).map(([i, d]) => [i, d.name]), k, (v) => { k = v; sync(); });
  const sl = slider(ctl, { label: 'Pattern number n', min: 1, max: 10, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; sync(); } });
  const c2 = row(host);
  let acc = 0; const a2 = loop(host, (dt) => { acc += dt; if (acc > 0.9) { acc = 0; n = n >= 10 ? 1 : n + 1; sl.set(n); sync(); } }, { autoplay: false });
  a2.button(c2);
  const out = readout(host);
  function sync() {
    const d = K[k], seq = Array.from({ length: Math.min(n, 8) }, (_, i) => d.f(i + 1)).join(', ');
    out.innerHTML = `Pattern ${n} has <b>${d.f(n)}</b> dots. Sequence so far: ${seq}${n > 8 ? ', ...' : ''}. Going from pattern ${n - 1 || 'start'} to ${n} ${n > 1 ? d.add(n) : 'starts with 1 dot'}. Rule: ${d.rule}.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const d = K[k], top = title(ctx, d.name + ' numbers: pattern ' + n, col), rs = d.rows(n), maxW = Math.max(...rs), nR = rs.length, s = Math.min((w - 40) / (maxW + 0.5), (h - top - 60) / (nR + 0.5), 30), r = s * 0.36, cx = w / 2, y0 = top + 22 + s * 0.5;
    rs.forEach((cnt, i) => {
      const isNew = k === 'tri' ? i === nR - 1 : k === 'sq' ? false : false;
      for (let j = 0; j < cnt; j++) {
        const x = k === 'tri' ? cx + (j - (cnt - 1) / 2) * s : cx + (j - (cnt - 1) / 2) * s, y = y0 + i * s;
        const newDot = k === 'tri' ? i === nR - 1 : k === 'sq' ? i === nR - 1 || j === cnt - 1 : i === nR - 1 || j === cnt - 1 || false;
        dot(ctx, x, y, r, newDot && n > 1 ? col.s[2] : col.s[0], col.ink);
      }
    });
    text(ctx, d.f(n) + ' dots', w / 2, h - 16, { color: col.ink, size: 15, weight: 700, align: 'center' });
  };
  sync();
}
