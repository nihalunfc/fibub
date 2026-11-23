// Class 8 Particles: there are spaces between particles. Marbles in a jar leave gaps that sand can fill, so 50 mL of
// marbles plus 50 mL of sand fill only about 82 mL (random packing leaves roughly a third of the volume empty).
// In the same way, sugar dissolves in water without raising the level much: its particles fit between water particles.
import { canvas, text, title, dot, row, slider, readout, rng } from '../../kit.js';

export default function (host) {
  let sand = 0;
  const R = rng(8), grains = Array.from({ length: 150 }, () => [R(), R()]);
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A jar of marbles into which sand is poured, filling the gaps' });
  const ctl = row(host);
  slider(ctl, { label: 'Sand poured in', min: 0, max: 50, step: 1, value: sand, fmt: (z) => `${z} mL`, oninput: (z) => { sand = z; upd(); } });
  const out = readout(host);
  const level = () => 50 + Math.max(0, sand - 18);
  function upd() { out.innerHTML = sand < 18 ? `Sand slips between the marbles: the level stays at <b>50 mL</b> although ${sand} mL of sand went in.` : `After ${sand} mL of sand the level is <b>${level()} mL</b>, not ${50 + sand} mL. The first 18 mL of sand fitted into the gaps.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Gaps between particles', col);
    const jw = w * 0.5, jx = (w - jw) / 2, top = 46, bot = h - 40, H = bot - top, px = H / 100;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(jx, top); ctx.lineTo(jx, bot); ctx.lineTo(jx + jw, bot); ctx.lineTo(jx + jw, top); ctx.stroke();
    const rr = jw / 9; let n = 0;
    for (let r = 0; r * rr * 1.7 < 50 * px - rr; r++) for (let c = 0; c < 4 + (r % 2 ? 0 : 0); c++) { const x = jx + rr * 1.3 + c * rr * 2.1 + (r % 2 ? rr : 0); if (x + rr < jx + jw) { dot(ctx, x, bot - rr - r * rr * 1.75, rr * 0.92, col.s[0]); n++; } }
    const filled = Math.min(sand, 18), over = Math.max(0, sand - 18);
    const sandTop = bot - (50 + over) * px;
    grains.forEach(([a, b], i) => { if (i / 150 * 50 >= sand) return; const y = sandTop + b * ((50 + over) * px * (sand < 18 ? 0.95 : 1)) - 0; const x = jx + 4 + a * (jw - 8); if (y > sandTop && y < bot) dot(ctx, x, y, 1.9, col.s[1]); });
    ctx.fillStyle = col.panel; for (let k = 0; k < 0; k++) ctx.fillRect(0, 0, 0, 0);
    const lv = level(); const y = bot - lv * px;
    ctx.strokeStyle = col.s[3]; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(jx - 10, y); ctx.lineTo(jx + jw + 10, y); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `${lv} mL`, jx + jw + 14, y, { color: col.s[3], size: 11.5, weight: 700 });
    text(ctx, 'blue = marbles (50 mL), yellow dots = sand', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  upd();
}
