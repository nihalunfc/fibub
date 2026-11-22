// Class 9 Science, Chapter 6: inertia. A body keeps its state of rest or of uniform motion unless an unbalanced force acts. Four
// scenes: (1) a card pulled slowly from under a coin takes the coin along, (2) flicked quickly, the coin hardly moves
// sideways and drops into the glass, (3) a bus brakes and the standing passenger lurches forward, (4) the bus
// starts and she tips backwards. Mass is the measure of inertia: the bigger the mass, the harder it is to change motion.
import { canvas, text, title, line, dot, row, choice, button, loop, readout, clamp } from '../../kit.js';

const SC = { slow: 'Slow pull', flick: 'Quick flick', brake: 'Bus brakes', start: 'Bus starts' };
const WHY = {
  slow: 'Slow pull: friction has time to drag the coin along with the card. The coin moves with the card and tips off to the side.',
  flick: 'Quick flick: the card is gone before friction can move the coin. The coin keeps its state of rest (inertia) and gravity drops it into the glass.',
  brake: 'The bus slows, but her upper body tends to keep moving forward at the old speed: she lurches forward. Her feet are slowed by the floor.',
  start: 'The bus speeds up, but her body tends to stay at rest: she tips backwards while her feet are carried forward.',
};
export default function (host) {
  let sc = 'flick', p = 0, go = false;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'A coin on a card above a glass and a passenger standing in a bus, showing inertia' });
  const ctl = row(host);
  choice(ctl, 'Scene', Object.entries(SC), sc, (v) => { sc = v; p = 0; go = false; show(); });
  button(ctl, 'Go', () => { p = 0; go = true; });
  loop(host, (dt) => { if (go) { p += dt / (sc === 'flick' ? 1.1 : 2.4); if (p >= 1.35) { go = false; } } cv.redraw(); });
  const out = readout(host); const show = () => { out.textContent = WHY[sc]; }; show();
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, SC[sc] + ': press Go', col) + 8, q = clamp(p, 0, 1.3), cx = w / 2;
    if (sc === 'slow' || sc === 'flick') {
      const gy = h - 40, gw = 70, gh = 80; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; line(ctx, [[cx - gw / 2, gy - gh], [cx - gw / 2 + 6, gy], [cx + gw / 2 - 6, gy], [cx + gw / 2, gy - gh]], col.ink, 2.5);
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(cx - gw / 2 + 4, gy - gh * 0.45, gw - 8, gh * 0.45); ctx.globalAlpha = 1;
      line(ctx, [[10, gy], [w - 10, gy]], col.muted, 2);
      const cardY = gy - gh - 4, cw = 78, dx = sc === 'flick' ? Math.min(1, q * 1.4) ** 1.4 * (w * 0.6) : q * (cw + 24) ;
      const cardx = cx + dx; // card centre
      ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.5; ctx.fillRect(cardx - cw / 2, cardY, cw, 5); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(cardx - cw / 2, cardY, cw, 5);
      let coinX = cx, coinY = cardY - 7;
      if (sc === 'flick') { const clear = cardx - cw / 2 > cx + 9; if (clear) { const f = clamp((q - 0.18) / 0.5, 0, 1); coinY = cardY - 7 + f * f * (gh * 0.45 + 4); } coinX = cx + clamp((dx - 5) / 50, 0, 1) * 2; }
      else { coinX = cx + dx * 0.97; if (coinX > cx + gw / 2 + 4) { const f = clamp((q - 0.82) / 0.4, 0, 1); coinX = cx + dx * 0.97 + f * 14; coinY = cardY - 7 + f * f * (gh + 4 - 7); } }
      ctx.fillStyle = col.warn; ctx.beginPath(); ctx.ellipse(coinX, coinY, 9, 5, 0, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
      text(ctx, 'coin', coinX, coinY - 14, { color: col.ink, size: 10.5, align: 'center', weight: 700 }); text(ctx, 'card', cx - cw / 2 - 4, cardY + 2, { color: col.muted, size: 10.5, align: 'right' });
      text(ctx, 'glass', cx, gy + 14, { color: col.muted, size: 10.5, align: 'center' });
    } else {
      const gy = h - 50, bw = Math.min(w - 40, 260), bx = (w - bw) / 2;
      const rate = sc === 'brake' ? 1 - clamp(q, 0, 1) : clamp(q, 0, 1) ; // bus speed factor 1 -> 0 or 0 -> 1
      line(ctx, [[0, gy + 12], [w, gy + 12]], col.muted, 2); const off = ((performance.now() / 4) * (sc === 'brake' ? (0.2 + 0.8 * rate) : (0.2 + 0.8 * rate))) % 40;
      for (let k = -1; k < w / 40 + 1; k++) line(ctx, [[k * 40 - off % 40, gy + 22], [k * 40 - off % 40 + 18, gy + 22]], col.line, 2);
      ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.fillRect(bx, gy - 78, bw, 80); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, gy - 78, bw, 80);
      dot(ctx, bx + 36, gy + 6, 10, col.ink); dot(ctx, bx + bw - 36, gy + 6, 10, col.ink);
      text(ctx, 'bus →', bx + bw - 6, gy - 66, { color: col.muted, size: 10.5, align: 'right' });
      const tilt = sc === 'brake' ? Math.sin(clamp(q, 0, 1) * Math.PI) * 0.55 : -Math.sin(clamp(q, 0, 1) * Math.PI) * 0.5, fx = w / 2, fy2 = gy - 2, L = 52;
      const hx = fx + Math.sin(tilt) * L, hy = fy2 - Math.cos(tilt) * L;
      line(ctx, [[fx, fy2], [hx, hy]], col.ink, 4); dot(ctx, hx + Math.sin(tilt) * 9, hy - Math.cos(tilt) * 9, 8, col.s[1]); dot(ctx, fx, fy2, 4, col.ink);
      text(ctx, sc === 'brake' ? 'lurches forward' : 'tips back', fx, gy - 88, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    }
  };
  cv.redraw();
}
