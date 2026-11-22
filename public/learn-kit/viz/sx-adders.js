// Adders built from gates. Half adder (XOR gives the sum, AND the carry), full adder (two half adders and an OR, with a
// carry in) and a 4-bit ripple-carry adder. Tap the inputs: wires carrying 1 light up. In the ripple adder each stage waits
// for the carry from the stage before it, so the answer settles one stage at a time (watch the carry travel left).
import { canvas, line, text, row, button, choice, slider, readout, loop, title, calm } from '../kit.js';

export default function (host) {
  let mode = 'half', A = 1, B = 1, Ci = 0, a4 = 11, b4 = 6, tt = 9;
  const cv = canvas(host, { aspect: 0.7, max: 340, min: 260, label: 'Gate-level diagram of a half adder, full adder or 4-bit ripple-carry adder' });
  const ctl = row(host);
  choice(ctl, 'Adder', [['half', 'Half adder'], ['full', 'Full adder'], ['rip', '4-bit ripple']], mode, (v) => { mode = v; tt = calm() ? 3 : 0; show(); });
  const ctl2 = row(host), tg = [];
  const mk = (lab, get, set) => { const b = button(ctl2, lab, () => { set(); tt = calm() ? 3 : 0; show(); }); tg.push([b, get]); };
  mk('A', () => A, () => (A ^= 1)); mk('B', () => B, () => (B ^= 1)); mk('Carry in', () => Ci, () => (Ci ^= 1));
  const sa = slider(ctl2, { label: 'A (0–15)', min: 0, max: 15, step: 1, value: 11, fmt: (v) => v, oninput: (v) => { a4 = v; tt = calm() ? 3 : 0; show(); } });
  const sb = slider(ctl2, { label: 'B (0–15)', min: 0, max: 15, step: 1, value: 6, fmt: (v) => v, oninput: (v) => { b4 = v; tt = calm() ? 3 : 0; show(); } });
  loop(host, (dt) => { if (tt < 3) { tt += dt; cv.redraw(); } });
  const out = readout(host);
  const fa = (a, b, c) => ({ s: a ^ b ^ c, c: (a & b) | (c & (a ^ b)), x1: a ^ b, a1: a & b, a2: c & (a ^ b) });
  function show() {
    tg.forEach(([b, g]) => b.setAttribute('aria-pressed', String(!!g())));
    ctl2.querySelectorAll('button').forEach((b, i) => (b.style.display = mode === 'rip' ? 'none' : mode === 'half' && i === 2 ? 'none' : ''));
    ctl2.querySelectorAll('.lk-slider').forEach((s) => (s.style.display = mode === 'rip' ? '' : 'none'));
    if (mode === 'half') out.innerHTML = `<b>A = ${A}, B = ${B}:</b> Sum = A XOR B = ${A ^ B}, Carry = A AND B = ${A & B}. So ${A} + ${B} = ${(A & B)}${A ^ B} in binary. It cannot take a carry in, which is why a full adder is needed for the next bit.`;
    else if (mode === 'full') { const r = fa(A, B, Ci); out.innerHTML = `<b>A = ${A}, B = ${B}, C_in = ${Ci}:</b> Sum = A ⊕ B ⊕ C_in = ${r.s}, C_out = AB + C_in(A ⊕ B) = ${r.c}. ${A} + ${B} + ${Ci} = ${r.c}${r.s} in binary (${A + B + Ci} in decimal).`; }
    else out.innerHTML = `<b>${a4} + ${b4} = ${a4 + b4}</b> (${a4.toString(2).padStart(4, '0')} + ${b4.toString(2).padStart(4, '0')} = ${(a4 + b4).toString(2).padStart(5, '0')}). Carry passes from bit 0 to bit 3, one stage after another; the sum bit of the last stage is correct only after the carry has rippled all the way: this delay limits the speed, and look-ahead adders remove it.`;
    cv.redraw();
  }
  const box = (ctx, col, x, y, w, h, lab, v) => { ctx.fillStyle = v ? col.s[1] : col.soft; ctx.globalAlpha = v ? 0.3 : 1; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1; ctx.strokeStyle = v ? col.s[1] : col.muted; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); text(ctx, lab, x + w / 2, y + h / 2, { color: col.ink, size: 11, weight: 700, align: 'center' }); };
  const wire = (ctx, col, pts, v) => line(ctx, pts, v ? col.s[1] : col.muted, v ? 3.5 : 1.8);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'half' ? 'Half adder' : mode === 'full' ? 'Full adder' : '4-bit ripple-carry adder', col);
    const lbl = (s, x, y, v, al = 'left') => text(ctx, `${s} = ${v}`, x, y, { color: v ? col.s[1] : col.muted, size: 12, weight: 700, align: al });
    if (mode === 'half') {
      const r = fa(A, B, 0), gx = w * 0.4, gw = 56;
      wire(ctx, col, [[60, 70], [gx, 70]], A); wire(ctx, col, [[60, 130], [gx, 130]], B);
      wire(ctx, col, [[90, 70], [90, h - 84], [gx, h - 84]], A); wire(ctx, col, [[110, 130], [110, h - 64], [gx, h - 64]], B);
      lbl('A', 8, 70, A); lbl('B', 8, 130, B);
      box(ctx, col, gx, 62, gw, 76, 'XOR', r.s); box(ctx, col, gx, h - 100, gw, 50, 'AND', r.c);
      wire(ctx, col, [[gx + gw, 100], [w - 70, 100]], r.s); wire(ctx, col, [[gx + gw, h - 75], [w - 70, h - 75]], r.c);
      lbl('Sum', w - 64, 100, r.s); lbl('Carry', w - 64, h - 75, r.c);
    } else if (mode === 'full') {
      const r = fa(A, B, Ci), X = (f) => w * f;
      lbl('A', 6, 60, A); lbl('B', 6, 100, B); lbl('C_in', 6, h - 50, Ci);
      wire(ctx, col, [[44, 60], [X(0.2), 60]], A); wire(ctx, col, [[44, 100], [X(0.2), 100]], B); wire(ctx, col, [[44, h - 50], [X(0.5), h - 50]], Ci);
      box(ctx, col, X(0.2), 40, 66, 80, 'HA 1', r.x1 | r.a1);
      wire(ctx, col, [[X(0.2) + 66, 70], [X(0.5), 70]], r.x1); text(ctx, 'A⊕B', X(0.2) + 70, 62, { color: r.x1 ? col.s[1] : col.muted, size: 10 });
      wire(ctx, col, [[X(0.2) + 66, 108], [X(0.76), 108], [X(0.76), 130]], r.a1); text(ctx, 'AB', X(0.5), 118, { color: r.a1 ? col.s[1] : col.muted, size: 10 });
      box(ctx, col, X(0.5), 50, 66, h - 90 - 10, 'HA 2', r.s | r.a2);
      wire(ctx, col, [[X(0.5) + 66, 80], [w - 56, 80]], r.s); lbl('Sum', w - 50, 80, r.s);
      wire(ctx, col, [[X(0.5) + 66, h - 90], [X(0.76), h - 90], [X(0.76), 190 > h - 100 ? h - 100 : 190]], r.a2);
      box(ctx, col, X(0.76) - 22, Math.min(190, h - 128), 44, 38, 'OR', r.c);
      wire(ctx, col, [[X(0.76) + 22, Math.min(190, h - 128) + 19], [w - 56, Math.min(190, h - 128) + 19]], r.c); lbl('C_out', w - 50, Math.min(190, h - 128) + 19, r.c);
    } else {
      const bw = (w - 20) / 4, cs = [Ci], res = [];
      for (let i = 0; i < 4; i++) { const r = fa((a4 >> i) & 1, (b4 >> i) & 1, cs[i]); res.push(r); cs.push(r.c); }
      for (let k = 0; k < 4; k++) {
        const i = 3 - k, x = 10 + k * bw, r = res[i], settled = tt * 1.1 >= i + 1 || tt >= 3;
        text(ctx, `bit ${i}`, x + bw / 2 - 4, 40, { color: col.muted, size: 10.5, align: 'center' });
        lbl('A', x + 6, 58, (a4 >> i) & 1); lbl('B', x + 6, 74, (b4 >> i) & 1);
        box(ctx, col, x + 6, 92, bw - 22, 64, 'FA', settled ? r.s | r.c : 0);
        wire(ctx, col, [[x + bw / 2 - 5, 80], [x + bw / 2 - 5, 92]], ((a4 >> i) & 1) | ((b4 >> i) & 1));
        const sv = settled ? r.s : null;
        text(ctx, settled ? `S = ${r.s}` : 'S = ?', x + bw / 2 - 5, 176, { color: sv ? col.s[1] : col.muted, size: 12, weight: 700, align: 'center' });
        if (k > 0) wire(ctx, col, [[x + 6, 124], [x - 16, 124]], settled ? cs[i + 1] : 0);
      }
      for (let k = 1; k < 4; k++) { const i = 3 - k, x = 10 + k * bw, c = cs[i + 1], ok = tt * 1.1 >= i + 1 || tt >= 3; text(ctx, ok ? `c${i + 1}=${c}` : '?', x - 5, 111, { color: ok && c ? col.s[1] : col.muted, size: 10, weight: 700, align: 'center', fit: false }); }
      wire(ctx, col, [[10 + 3 * bw + bw - 16, 124], [w - 6, 124]], Ci); text(ctx, `C_in = ${Ci}`, w - 8, 140, { color: col.muted, size: 10.5, align: 'right' });
      const tot = a4 + b4 + Ci;
      text(ctx, `Result: ${tot.toString(2).padStart(5, '0')} = ${tot}`, w / 2, h - 30, { color: col.ink, size: 14, weight: 700, align: 'center' });
      text(ctx, tt < 3 ? 'carry is rippling from bit 0 to bit 3 …' : 'settled', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    }
  };
  show();
}
