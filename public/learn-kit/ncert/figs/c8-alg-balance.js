// Class 8 Algebra Play: an equation is a balance. Whatever you do to one pan you must do to the other.
// Bags of unknown weight x and loose stones sit on the left; stones sit on the right. Remove or share equally from both pans and x appears.
import { canvas, text, title, row, button, choice, readout } from '../../kit.js';

const EQ = { a: [3, 5, 20, 5], b: [2, 7, 19, 6], c: [4, 3, 27, 6] }; // bags, stones, right, x
export default function (host) {
  let key = 'a', nb, sb, sc, bagsShared;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A balance with bags of unknown weight and stones, used to solve an equation' });
  const ctl = row(host);
  choice(ctl, 'Equation', [['a', '3x + 5 = 20'], ['b', '2x + 7 = 19'], ['c', '4x + 3 = 27']], key, (v) => { key = v; reset(); });
  const ctl2 = row(host);
  button(ctl2, 'Take the stones off both pans', () => { if (sb > 0) { sc -= sb; sb = 0; sync(); } });
  button(ctl2, 'Take them off the left only', () => { if (sb > 0) { sb = 0; sync(); } });
  button(ctl2, 'Share both pans equally', () => { if (nb > 1 && sb === 0) { sc /= nb; nb = 1; sync(); } });
  button(ctl2, 'Reset', () => reset());
  const out = readout(host);
  const X = () => EQ[key][3];
  function reset() { [nb, sb, sc] = EQ[key]; sync(); }
  const eqText = () => (nb === 1 ? 'x' : nb + 'x') + (sb ? ' + ' + sb : '') + ' = ' + +sc.toFixed(2);
  function sync() {
    const d = nb * X() + sb - sc;
    out.innerHTML = `Now: <b>${eqText()}</b>. ` + (Math.abs(d) > 1e-9 ? '<b>The balance has tipped: you changed one side only.</b> Reset, and do the same to both pans.' : nb === 1 && sb === 0 ? `One bag balances ${+sc.toFixed(2)} stones, so <b>x = ${+sc.toFixed(2)}</b>.` : 'Still balanced. Keep going until one bag is alone.');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Balance: ' + eqText(), col), d = nb * X() + sb - sc, tilt = Math.max(-0.22, Math.min(0.22, d / 40)), cx = w / 2, py = top + 50, bl = Math.min(w * 0.3, 115);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(cx, h - 40); ctx.moveTo(cx - 40, h - 40); ctx.lineTo(cx + 40, h - 40); ctx.stroke();
    const ly = py + Math.sin(tilt) * bl, ry = py - Math.sin(tilt) * bl, lx = cx - Math.cos(tilt) * bl, rx = cx + Math.cos(tilt) * bl;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke();
    const pan = (x, y, bags, stones, c) => {
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 36, y + 34); ctx.moveTo(x, y); ctx.lineTo(x + 36, y + 34); ctx.stroke();
      ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 42, y + 34); ctx.lineTo(x + 42, y + 34); ctx.stroke();
      for (let i = 0; i < bags; i++) { const bx = x - ((bags - 1) * 15) + i * 30, by = y + 10; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(bx, by, 10, 0, 7); ctx.fill(); ctx.globalAlpha = 1; text(ctx, 'x', bx, by, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
      const k = Math.round(stones * 100) / 100, cnt = Math.min(30, Math.ceil(k));
      for (let i = 0; i < cnt; i++) { const row = Math.floor(i / 10), colm = i % 10; ctx.fillStyle = col.s[3]; ctx.globalAlpha = Number.isInteger(k) || i < cnt - 1 ? 0.85 : 0.4; ctx.beginPath(); ctx.arc(x - 31 + colm * 7, y + 31 - row * 6, 2.8, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      if (k) text(ctx, String(k), x, y + 52, { color: col.ink, size: 11, weight: 700, align: 'center' });
    };
    pan(lx, ly, nb, sb, 0); pan(rx, ry, 0, sc, 1);
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, py, 5, 0, 7); ctx.fill();
  };
  reset();
}
