// Class 8 Power Play: the laws of exponents seen as blocks of the same base. a^m is m copies of a multiplied; joining
// a^m and a^n gives m + n copies (product law); removing n copies leaves m - n (quotient law); n groups of m copies
// give m x n copies (power of a power).
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let law = 'prod', m = 3, n = 2;
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 250, label: 'Blocks that show the laws of exponents' });
  const out = readout(host); const ctl = row(host);
  choice(ctl, 'Law', [['prod', 'a^m × a^n'], ['quo', 'a^m ÷ a^n'], ['pow', '(a^m)^n']], law, (v) => { law = v; fix(); sync(); });
  const sm = slider(ctl, { label: 'm', min: 1, max: 8, step: 1, value: m, fmt: (v) => Math.round(v), oninput: (v) => { m = Math.round(v); fix(); sync(); } });
  const sn = slider(ctl, { label: 'n', min: 1, max: 6, step: 1, value: n, fmt: (v) => Math.round(v), oninput: (v) => { n = Math.round(v); fix(); sync(); } });
  function fix() { if (law === 'quo' && n > m) { n = m; sn.set(n); } if (law === 'pow' && m * n > 24) { m = Math.floor(24 / n); sm.set(m); } }
  function sync() {
    out.innerHTML = law === 'prod' ? `a<sup>${m}</sup> × a<sup>${n}</sup> = a<sup>${m} + ${n}</sup> = <b>a<sup>${m + n}</sup></b> (add the powers).` : law === 'quo' ? `a<sup>${m}</sup> ÷ a<sup>${n}</sup> = a<sup>${m} − ${n}</sup> = <b>a<sup>${m - n}</sup></b> (subtract the powers; ${n} copies cancel).` : `(a<sup>${m}</sup>)<sup>${n}</sup> = a<sup>${m} × ${n}</sup> = <b>a<sup>${m * n}</sup></b> (multiply the powers).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Each block is one copy of a', col), s = Math.min(26, (w - 24) / 12), g = 3;
    const blk = (x, y, c, cancelled) => { ctx.fillStyle = cancelled ? col.soft : c; ctx.fillRect(x, y, s - g, s - g); text(ctx, 'a', x + (s - g) / 2, y + (s - g) / 2, { color: cancelled ? col.muted : col.panel, size: 12, weight: 700, align: 'center' }); if (cancelled) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s - g, y + s - g); ctx.stroke(); } };
    const rowOf = (cnt, x, y, c, canc = 0) => { for (let i = 0; i < cnt; i++) blk(x + (i % 12) * s, y + Math.floor(i / 12) * s, c, i >= cnt - canc); };
    if (law === 'prod') {
      text(ctx, `a^${m}`, 12, top + 14, { color: col.s[0], size: 12, weight: 700 }); rowOf(m, 12, top + 24, col.s[0]);
      text(ctx, `a^${n}`, 12, top + 62, { color: col.s[2], size: 12, weight: 700 }); rowOf(n, 12, top + 72, col.s[2]);
      text(ctx, `Joined: a^${m + n}`, 12, top + 112, { color: col.ink, size: 12, weight: 700 });
      for (let i = 0; i < m + n; i++) blk(12 + (i % 12) * s, top + 122 + Math.floor(i / 12) * s, i < m ? col.s[0] : col.s[2], false);
    } else if (law === 'quo') {
      text(ctx, `Top: a^${m}  (blocks)`, 12, top + 14, { color: col.s[0], size: 12, weight: 700 }); rowOf(m, 12, top + 24, col.s[0], n);
      text(ctx, `Bottom a^${n} cancels ${n} of them`, 12, top + 64, { color: col.s[3], size: 12, weight: 700 });
      text(ctx, `Left over: a^${m - n}`, 12, top + 90, { color: col.ink, size: 12, weight: 700 });
      for (let i = 0; i < m - n; i++) blk(12 + (i % 12) * s, top + 100, col.s[0], false);
      if (m === n) text(ctx, 'nothing left: a^0 = 1', 12, top + 124, { color: col.s[2], size: 13, weight: 700 });
    } else {
      text(ctx, `${n} groups of a^${m}`, 12, top + 14, { color: col.s[0], size: 12, weight: 700 });
      const gh = Math.ceil(m / 12) * s + 6; let y = top + 24;
      for (let j = 0; j < n; j++) { rowOf(m, 12, y, col.s[j % 6]); y += gh; }
      text(ctx, `${n} × ${m} = ${m * n} blocks: a^${m * n}`, 12, y + 8, { color: col.ink, size: 12, weight: 700 });
    }
  };
  fix(); sync();
}
