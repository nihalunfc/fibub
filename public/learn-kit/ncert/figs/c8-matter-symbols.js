// Class 8 Matter: symbols of elements. A symbol is one capital letter, or a capital plus a small letter. Many come from
// the English name (H, O, C) but some from the old Latin or Greek name (Na from natrium, Fe from ferrum, Cu from cuprum,
// Ag from argentum, Au from aurum). Metals conduct heat and electricity; non-metals usually do not (carbon as graphite is an exception).
import { canvas, text, title, dot, row, choice, readout } from '../../kit.js';

const EL = {
  H: ['Hydrogen', 'Greek hydro-genes, water-former', 'non-metal', 'gas'], C: ['Carbon', 'Latin carbo, charcoal', 'non-metal', 'solid'], O: ['Oxygen', 'Greek oxy-genes, acid-former', 'non-metal', 'gas'],
  Na: ['Sodium', 'Latin natrium', 'metal', 'solid'], Fe: ['Iron', 'Latin ferrum', 'metal', 'solid'], Cu: ['Copper', 'Latin cuprum', 'metal', 'solid'], Ag: ['Silver', 'Latin argentum', 'metal', 'solid'], Au: ['Gold', 'Latin aurum', 'metal', 'solid'],
};
export default function (host) {
  let s = 'Fe', t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'A card for an element with its symbol, name origin and type' });
  const ctl = row(host);
  choice(ctl, 'Element', Object.keys(EL).map((k) => [k, k]), s, (v) => { s = v; upd(); });
  const out = readout(host);
  function upd() { const [n, o, ty, st] = EL[s]; out.innerHTML = `<b>${s}</b> stands for <b>${n.toLowerCase()}</b> (${o}). It is a ${ty} and a ${st} at room temperature.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Symbols of elements', col);
    const [n, o, ty, st] = EL[s], cx = w * 0.28, cy = h * 0.5, c = ty === 'metal' ? col.s[3] : col.s[2];
    ctx.fillStyle = col.soft; ctx.fillRect(cx - 52, cy - 52, 104, 104); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.strokeRect(cx - 52, cy - 52, 104, 104);
    text(ctx, s, cx, cy - 2, { color: c, size: 44, weight: 700, align: 'center', fit: false });
    text(ctx, n, cx, cy + 36, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, ty, w * 0.62, h * 0.3, { color: c, size: 13, weight: 700 }); text(ctx, st, w * 0.62, h * 0.3 + 20, { color: col.muted, size: 12 }); text(ctx, o, w * 0.62, h * 0.3 + 40, { color: col.muted, size: 10.5 });
    for (let i = 0; i < 12; i++) { const gx = w * 0.62 + (i % 4) * 22, gy = h * 0.62 + Math.floor(i / 4) * 20; if (st === 'solid') dot(ctx, gx, gy, 7, c); else dot(ctx, gx + Math.sin(i * 7) * 6, gy + Math.cos(i * 5) * 5, 5, c); }
    text(ctx, ty === 'metal' ? 'shiny, conducts heat and electricity' : 'dull or gas, poor conductor', 14, h - 12, { color: col.muted, size: 10.5 });
  };
  upd();
}
