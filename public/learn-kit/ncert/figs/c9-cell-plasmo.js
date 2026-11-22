// Class 9 Cell (step player): plasmolysis and recovery, the classic Rhoeo or onion-peel activity. A peel in water is
// turgid; in strong salt or sugar solution water leaves by osmosis and the membrane pulls away from the wall
// (plasmolysis); back in pure water the water returns and the cell recovers. The wall is rigid and keeps its shape.
import { canvas, text, title, dot, loop, ease } from '../../kit.js';

const CAP = ['A peel cell in tap water. The vacuole is full and presses the cytoplasm against the cell wall: the cell is turgid.', 'Move it into strong salt solution. Outside is now stronger than inside, so water starts to leave the vacuole.', 'Water keeps leaving. The vacuole shrinks and the membrane starts to pull away from the wall. The wall does not shrink.', 'The cell is plasmolysed: a gap full of salt solution lies between the wall and the shrunken cytoplasm.', 'Put the peel back in pure water. Water flows in again, the vacuole refills and the cell becomes turgid once more.'];
export default function (host) {
  let step = 0, t = 0, shrink = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A plant cell losing water in salt solution and plasmolysing then recovering in water' });
  loop(host, (dt) => { t += dt; const tg = [0, 0.2, 0.55, 1, 0][step]; shrink += (tg - shrink) * Math.min(1, dt * 1.6); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Turgid cell in water', 'Salt solution added', 'Water leaves', 'Plasmolysis', 'Back in water: recovery'][step], col);
    const cx = w / 2, cy = h * 0.4, ww = Math.min(w * 0.34, 130), wh = ww * 0.62, k = 1 - shrink * 0.42;
    ctx.fillStyle = step === 0 || step === 4 ? col.panel : col.soft; ctx.fillRect(10, 36, w - 20, h * 0.66 - 12);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 7; ctx.strokeRect(cx - ww, cy - wh, ww * 2, wh * 2);
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(cx - ww * k, cy - wh * k, ww * 2 * k, wh * 2 * k, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.roundRect(cx - ww * k * 0.5, cy - wh * k * 0.65, ww * k * 1.2, wh * k * 1.3, 10); ctx.fill();
    dot(ctx, cx - ww * k * 0.72, cy - wh * k * 0.2, 9 * (0.7 + 0.3 * k), col.s[0]);
    text(ctx, 'wall', cx + ww + 2, cy - wh - 8, { color: col.s[2], size: 10, weight: 700, align: 'right' });
    if (shrink > 0.3) text(ctx, 'gap', cx - ww * 0.92, cy + wh * 0.3, { color: col.bad, size: 10.5, weight: 700 });
    if (step >= 1 && step <= 3) for (let i = 0; i < 5; i++) { const p = (t * 0.5 + i / 5) % 1, a = i * 1.26 + 0.4; const r0 = 0.9 - p * 0.6; dot(ctx, cx + Math.cos(a) * ww * (1.15 - 0.0) * (0.55 + p * 0.5), cy + Math.sin(a) * wh * (1.1) * (0.55 + p * 0.5), 3.5, col.s[0]); void r0; }
    if (step === 4) for (let i = 0; i < 5; i++) { const p = (t * 0.5 + i / 5) % 1, a = i * 1.26 + 0.4; dot(ctx, cx + Math.cos(a) * ww * (1.2 - p * 0.5), cy + Math.sin(a) * wh * (1.15 - p * 0.5), 3.5, col.s[0]); }
    const words = CAP[step].split(' '); const L = []; let cur = ''; ctx.font = '11px system-ui'; words.forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h * 0.66 + 22 + i * 15, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
