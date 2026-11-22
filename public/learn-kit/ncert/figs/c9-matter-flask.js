// Class 9 Atomic Foundations of Matter: law of conservation of mass in a flask on a balance. Baking soda (sodium
// hydrogencarbonate) mixes with vinegar (ethanoic acid) and makes carbon dioxide gas. In a SEALED flask nothing escapes, so
// the balance reads the same before and after. In an OPEN flask the gas leaves and the reading drops by exactly the
// mass of gas. The atoms are only rearranged: the same atoms are there afterwards.
import { canvas, text, title, dot, row, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let sealed = true, f = 0, go = false;
  const m0 = 250.0, gas = 2.2;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A flask on a balance where a reaction makes gas, with the reading constant when sealed and falling when open' });
  const ctl = row(host);
  choice(ctl, 'Flask', [['yes', 'Sealed'], ['no', 'Open']], 'yes', (v) => { sealed = v === 'yes'; f = 0; go = false; upd(); });
  button(ctl, '▶ Mix', () => { f = 0; go = true; });
  const out = readout(host);
  const reading = () => (sealed ? m0 : m0 - gas * f);
  function upd() { out.innerHTML = `Balance: <b>${reading().toFixed(1)} g</b>. ` + (sealed ? 'Sealed: the gas stays inside, the total mass is the same before and after.' : `Open: the gas has escaped (${(gas * f).toFixed(1)} g so far), so the reading falls. The mass has not vanished; it floated away.`); cv.redraw(); }
  loop(host, (dt) => { if (go) { f += dt * 0.35; if (f >= 1) { f = 1; go = false; } upd(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Conservation of mass: ' + (sealed ? 'sealed flask' : 'open flask'), col);
    const cx = w / 2, by = h - 76, fw = 82, fh = 96;
    ctx.fillStyle = col.line; ctx.fillRect(cx - 80, by, 160, 10); ctx.fillRect(cx - 12, by + 10, 24, 16);
    ctx.fillStyle = col.panel; ctx.fillRect(cx - 60, by + 28, 120, 20); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - 60, by + 28, 120, 20);
    text(ctx, `${reading().toFixed(1)} g`, cx, by + 38, { color: col.ink, size: 14, weight: 700, align: 'center' });
    // flask
    const top = by - fh;
    ctx.beginPath(); ctx.moveTo(cx - 12, top); ctx.lineTo(cx - 12, top + 30); ctx.lineTo(cx - fw / 2, by); ctx.lineTo(cx + fw / 2, by); ctx.lineTo(cx + 12, top + 30); ctx.lineTo(cx + 12, top); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(cx - fw / 2 + 8, by - 20); ctx.lineTo(cx - fw / 2 + 2, by); ctx.lineTo(cx + fw / 2 - 2, by); ctx.lineTo(cx + fw / 2 - 8, by - 20); ctx.fill(); ctx.globalAlpha = 1;
    if (sealed) { ctx.fillStyle = col.s[3]; ctx.fillRect(cx - 15, top - 6, 30, 8); text(ctx, 'stopper', cx + 22, top - 4, { color: col.muted, size: 10 }); }
    // bubbles / gas
    const n = Math.round(f * 14);
    for (let i = 0; i < n; i++) {
      const ph = ((i * 0.37 + f * 3) % 1), x = cx + Math.sin(i * 2.3) * 22, y = by - 14 - ph * (fh - 14);
      if (sealed) { if (y > top + 2) dot(ctx, x, y, 3.5, col.s[2]); } else { const yy = by - 14 - ph * (fh + 70); dot(ctx, cx + Math.sin(i * 2.3 + ph * 3) * (14 + ph * 8), yy, 3.5, col.s[2]); }
    }
    text(ctx, 'CO₂ gas', cx + 50, top + 20, { color: col.s[2], size: 11, weight: 700 });
    text(ctx, 'baking soda + vinegar → carbon dioxide + other products', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
    text(ctx, `before: ${m0.toFixed(1)} g`, 10, 44, { color: col.muted, size: 11 });
  };
  upd();
}
