// Class 9 Mixtures: paper chromatography. A drop of black ink (a mixture of dyes) is placed on a pencil line near the
// bottom of the paper; the solvent (water) climbs the paper by capillary action. Each dye is carried up by the
// solvent but also holds on to the paper; the one that sticks less travels further. Rf = distance moved by the
// spot / distance moved by the solvent front. Rf is the same for a given dye, solvent and paper, so it identifies the dye.
import { canvas, text, title, dot, line, row, button, readout, loop } from '../../kit.js';

const D = [['yellow dye', 0.82, '#f2b400'], ['red dye', 0.55, '#d9363e'], ['blue dye', 0.27, '#2f6fd0']];
export default function (host) {
  let p = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A strip of chromatography paper with ink dyes rising to different heights as the solvent climbs' });
  const ctl = row(host);
  const an = loop(host, (dt) => { p = Math.min(1, p + dt * 0.08); upd(); }); an.button(ctl);
  button(ctl, 'Start again', () => { p = 0; upd(); });
  const out = readout(host);
  function upd() {
    const f = p * 100;
    out.innerHTML = p < 0.02 ? 'The ink spot sits on the pencil line. Water starts to climb.' : `The solvent front has moved <b>${(p * 10).toFixed(1)} cm</b>. ` + D.map((d) => `${d[0]}: ${(d[1] * p * 10).toFixed(1)} cm, Rf = <b>${d[1].toFixed(2)}</b>`).join('; ') + (p > 0.98 ? '. Mark the solvent front before the paper dries, then work out Rf.' : '.'); void f;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Paper chromatography of black ink', col);
    const px = w * 0.3, pw = w * 0.4, top = 52, bot = h - 52, start = bot - 28, span = start - top - 10;
    ctx.fillStyle = col.soft; ctx.fillRect(10, bot - 14, w - 20, 40); text(ctx, 'solvent (water)', w - 14, bot + 6, { color: col.s[0], size: 10, align: 'right' });
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(px, top, pw, bot - top + 8); ctx.strokeRect(px, top, pw, bot - top + 8);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(px + 1, start - p * span, pw - 2, bot - start + p * span + 8); ctx.globalAlpha = 1;
    line(ctx, [[px, start], [px + pw, start]], col.muted, 1, [3, 3]); text(ctx, 'pencil line', px - 6, start, { color: col.muted, size: 10, align: 'right' });
    const fy = start - p * span; line(ctx, [[px, fy], [px + pw, fy]], col.s[0], 2); if (p > 0.04) text(ctx, 'solvent front', px + pw + 6, fy, { color: col.s[0], size: 10 });
    if (p < 0.02) dot(ctx, px + pw / 2, start, 5, '#222');
    D.forEach((d, i) => { const x = px + pw * (0.22 + i * 0.28), y = start - d[1] * p * span; if (p >= 0.02) { ctx.beginPath(); ctx.ellipse(x, y, 7, 7 + p * 5, 0, 0, 7); ctx.fillStyle = d[2]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1; if (p > 0.1) text(ctx, d[0].split(' ')[0], x, y - 15 - p * 4, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.panel }); } });
    if (p < 0.02) text(ctx, 'ink drop (all dyes together)', px + pw + 6, start, { color: col.ink, size: 10 });
  };
  upd();
}
