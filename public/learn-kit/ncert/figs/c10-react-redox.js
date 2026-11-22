// Class 10 Chemical Reactions: oxidation and reduction as gain and loss of oxygen.
// Scene 1: copper is heated in air, each Cu atom picks up an O atom -> CuO (copper is oxidised, brown turns black).
// Scene 2: hot CuO meets hydrogen; the O atoms move to hydrogen -> Cu + H2O (CuO is reduced, H2 is oxidised).
// Both always happen together, so the reaction is called a redox reaction.
import { canvas, text, title, line, dot, row, choice, readout, loop, ease, lerp, clamp } from '../../kit.js';

export default function (host) {
  let sc = 'ox', t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'Oxygen atoms moving between copper and hydrogen in an oxidation and reduction reaction' });
  const ctl = row(host);
  choice(ctl, 'Reaction', [['ox', '2Cu + O₂ → 2CuO'], ['red', 'CuO + H₂ → Cu + H₂O']], sc, (v) => { sc = v; t = 0; say(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  function say() { out.innerHTML = sc === 'ox' ? '<b>Copper gains oxygen: it is oxidised.</b> The shiny brown metal turns black copper(II) oxide.' : '<b>CuO loses oxygen: it is reduced. H₂ gains oxygen: it is oxidised.</b> The black powder turns brown again. Oxidation and reduction go together: a redox reaction.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, sc === 'ox' ? 'Heating copper in air' : 'Passing hydrogen over hot copper oxide', col) + 10;
    const c = (t % 6) / 6, e = ease(clamp((c - 0.2) / 0.5, 0, 1)), ys = [top + (h - top) * 0.22, top + (h - top) * 0.5];
    const prog = c > 0.7 ? 1 : e;
    const cuX = w * 0.2;
    ys.forEach((y, i) => {
      if (sc === 'ox') {
        const ax = w * 0.74 + (i ? 14 : -14) * 0, ay = (ys[0] + ys[1]) / 2 + (i ? 14 : -14);
        const ox = lerp(w * 0.62 + (i ? 30 : 0), cuX + 30, prog), oy = lerp(ay, y, prog);
        if (prog < 0.02) line(ctx, [[w * 0.62, ay - 14 + (i ? 0 : 0)], [w * 0.62 + 30, ay + 14]], col.ink, 3);
        dot(ctx, ox, oy, 12, col.s[7]); text(ctx, 'O', ox, oy, { color: col.bg || '#fff', size: 11, weight: 700, align: 'center' });
        ctx.save(); ctx.globalAlpha = prog; line(ctx, [[cuX, y], [cuX + 30, y]], col.ink, 3); ctx.restore();
      } else {
        const ox = lerp(cuX + 30, w * 0.77, prog), hx = w * 0.7, hx2 = w * 0.84;
        const hl = lerp(w * 0.74, hx, prog), hr = lerp(w * 0.80, hx2, prog), hy = y + lerp(0, 14, prog);
        ctx.save(); ctx.globalAlpha = 1 - prog; line(ctx, [[cuX, y], [cuX + 30, y]], col.ink, 3); ctx.restore();
        ctx.save(); ctx.globalAlpha = prog; line(ctx, [[ox, y], [hl, hy]], col.ink, 3); line(ctx, [[ox, y], [hr, hy]], col.ink, 3); ctx.restore();
        ctx.save(); ctx.globalAlpha = 1 - prog; line(ctx, [[w * 0.74, y + 6], [w * 0.80, y + 6]], col.ink, 3); ctx.restore();
        dot(ctx, ox, y, 12, col.s[7]); text(ctx, 'O', ox, y, { color: col.bg || '#fff', size: 11, weight: 700, align: 'center' });
        dot(ctx, hl, hy + (1 - prog) * 6, 8, col.s[0]); dot(ctx, hr, hy + (1 - prog) * 6, 8, col.s[0]);
      }
      dot(ctx, cuX, y, 15, col.s[1]); text(ctx, 'Cu', cuX, y, { color: col.bg || '#fff', size: 12, weight: 700, align: 'center' });
    });
    // colour swatch of the solid
    const mix = sc === 'ox' ? prog : 1 - prog, sy = h - 46;
    const r = Math.round(lerp(184, 30, mix)), g = Math.round(lerp(115, 30, mix)), b = Math.round(lerp(51, 30, mix));
    ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(10, sy, 70, 26); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(10, sy, 70, 26);
    text(ctx, mix < 0.5 ? 'brown copper' : 'black copper oxide', 90, sy + 13, { color: col.ink, size: 11.5, weight: 600 });
    if (prog > 0.95) text(ctx, sc === 'ox' ? 'Cu gained O: oxidised' : 'CuO lost O: reduced', w - 8, sy + 4, { color: col.s[2], size: 11.5, weight: 700, align: 'right' });
    if (prog > 0.95 && sc === 'red') text(ctx, 'H₂ gained O: oxidised', w - 8, sy + 22, { color: col.s[1], size: 11.5, weight: 700, align: 'right' });
  };
  say();
}
