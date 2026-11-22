// The circular flow of income, animated. Money coins run from households to firms (spending) and back (factor payments).
// Switch on saving, tax, imports and exports/investment/government spending to see leakages leave and injections come
// in. When injections equal leakages the loop stays the same size; otherwise it grows or shrinks. Numbers are made up.
import { canvas, row, choice, slider, readout, loop, text, title } from '../kit.js';

export default function (host) {
  let sec = 'two', inv = 20, sav = 20, t = 0;
  const cv = canvas(host, { aspect: 1.2, max: 470, min: 400, label: 'Circular flow of income between households, firms, government, financial sector and the world' });
  const c = row(host);
  choice(c, 'Economy', [['two', 'Households + firms'], ['fin', '+ saving and investment'], ['gov', '+ government'], ['open', '+ rest of world']], sec, (v) => { sec = v; show(); });
  slider(c, { label: 'Investment injection', min: 0, max: 40, step: 2, value: inv, fmt: (v) => v, oninput: (v) => { inv = v; show(); } });
  const c2 = row(host); const a = loop(host, (dt) => { t += dt * 0.25; cv.redraw(); }); a.button(c2);
  const out = readout(host);
  const flows = () => { const base = 100, leak = sec === 'two' ? 0 : sav + (sec === 'gov' || sec === 'open' ? 15 : 0) + (sec === 'open' ? 10 : 0);
    const inj = sec === 'two' ? 0 : inv + (sec === 'gov' || sec === 'open' ? 15 : 0) + (sec === 'open' ? 10 : 0); return { base, leak, inj, net: inj - leak }; };
  const show = () => { const f = flows(); out.innerHTML = sec === 'two' ? 'Households spend all their income on what firms make; firms pay it all back as wages, rent, interest and profit. Nothing leaves, nothing enters: the flow is constant.' :
    `Leakages (saving${sec !== 'fin' ? ', taxes' : ''}${sec === 'open' ? ', imports' : ''}) = <b>${f.leak}</b>; injections (investment${sec !== 'fin' ? ', government spending' : ''}${sec === 'open' ? ', exports' : ''}) = <b>${f.inj}</b>. ${f.net === 0 ? 'Equal, so the flow is steady (equilibrium).' : f.net > 0 ? 'Injections exceed leakages, so income grows.' : 'Leakages exceed injections, so income shrinks.'}`; cv.redraw(); };
  const box = (ctx, col, x, y, w, h, lab, k) => { ctx.fillStyle = col.soft; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeStyle = col.s[k]; ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h / 2, w, h); text(ctx, lab, x, y, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Circular flow of income', col);
    const cx = w / 2, cy = h * 0.5, hx = cx - w * 0.3, fx = cx + w * 0.3, ty = cy - h * 0.17, by = cy + h * 0.17, f = flows();
    const path = (x0, y0, x1, y1, col2, dir, lab) => { ctx.strokeStyle = col2; ctx.globalAlpha = 0.5; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.globalAlpha = 1;
      for (let i = 0; i < 4; i++) { const u = (((t + i / 4) % 1) + 1) % 1, k = dir > 0 ? u : 1 - u; ctx.fillStyle = col2; ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, 4, 0, 7); ctx.fill(); }
      if (lab) text(ctx, lab, (x0 + x1) / 2, (y0 + y1) / 2 + (dir > 0 && y0 === ty ? 11 : -9), { color: col.muted, size: 10.5, align: 'center', halo: col.panel }); };
    path(hx, ty, fx, ty, col.s[0], 1, 'income: wages, rent, interest, profit'); path(fx, by, hx, by, col.s[1], 1, 'spending on goods and services');
    path(hx, ty, hx, by, col.s[0], -1, ''); path(fx, ty, fx, by, col.s[1], -1, '');
    box(ctx, col, hx, cy, w * 0.26, 46, 'Households', 0); box(ctx, col, fx, cy, w * 0.26, 46, 'Firms', 1);
    if (sec !== 'two') { box(ctx, col, cx, cy, w * 0.26, 30, 'Financial', 2); path(hx + 6, cy + 24, cx - 20, cy + 14, col.bad, 1, ''); path(cx + 20, cy + 14, fx - 6, cy + 24, col.good, 1, ''); text(ctx, `saving ${sav}`, hx + 20, cy + 40, { color: col.bad, size: 10.5, weight: 700 }); text(ctx, `investment ${inv}`, fx - 20, cy + 40, { color: col.good, size: 10.5, weight: 700, align: 'right' }); }
    if (sec === 'gov' || sec === 'open') { box(ctx, col, cx, 62, w * 0.3, 30, 'Government', 3); path(hx, ty - 8, cx - 30, 62, col.bad, 1, ''); path(cx + 30, 62, fx, ty - 8, col.good, 1, ''); text(ctx, 'taxes 15', hx + 4, ty - 14, { color: col.bad, size: 10.5, weight: 700 }); text(ctx, 'spending 15', fx - 4, ty - 14, { color: col.good, size: 10.5, weight: 700, align: 'right' }); }
    if (sec === 'open') { box(ctx, col, cx, h - 26, w * 0.34, 30, 'Rest of the world', 4); path(hx, by + 10, cx - 40, h - 40, col.bad, 1, ''); path(cx + 40, h - 40, fx, by + 10, col.good, 1, ''); text(ctx, 'imports 10', hx + 4, by + 24, { color: col.bad, size: 10.5, weight: 700 }); text(ctx, 'exports 10', fx - 4, by + 24, { color: col.good, size: 10.5, weight: 700, align: 'right' }); }
    text(ctx, sec === 'two' ? '' : `leakages ${f.leak}  |  injections ${f.inj}`, cx, 34, { color: f.net === 0 ? col.good : col.warn, size: 11.5, weight: 700, align: 'center' });
  };
  show();
}
