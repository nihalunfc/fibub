// Class 11 Biology, Body Fluids and Circulation: what blood is made of. Spun in a centrifuge, blood separates into straw-coloured plasma (about 55 %), a thin pale layer of white cells and platelets, and red cells (the haematocrit, about 40-45 %).
// Normal counts: red cells 5-5.5 million per mm3, white cells 6000-8000, platelets 1.5-3.5 lakh. Slide the haematocrit to see anaemia and polycythaemia.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';
import { rr, ell } from '../c11b-lib.js';

export default function (host) {
  let hct = 44;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A centrifuged blood tube with plasma, white cells and platelets, and red cells at a chosen haematocrit' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Preset', [[44, 'Normal'], [28, 'Anaemia'], [60, 'Thick blood (polycythaemia)']], 44, (v) => { hct = v; sl.set(v); go(); });
  const sl = slider(ctl, { label: 'Red cells (haematocrit)', min: 20, max: 65, step: 1, value: hct, fmt: (v) => Math.round(v) + ' %', oninput: (v) => { hct = v; go(); } });
  const go = () => { const mil = hct / 44 * 5.2; ro.textContent = `Red cells fill ${Math.round(hct)} % of the blood and plasma ${Math.round(100 - hct - 1)} %, with about 1 % white cells and platelets. That is about ${mil.toFixed(1)} million red cells per mm³ (normal 5 to 5.5). ${hct < 36 ? 'Low: the blood carries less O₂ (anaemia), so the person tires easily.' : hct > 52 ? 'High: the blood is thicker and the heart works harder.' : 'In the normal range.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Blood after spinning', col), x0 = w * 0.12, tw = 64, top = t0 + 14, th = h - top - 24, r = hct / 100, bf = 0.01;
    const yR = top + th * (1 - r), yB = yR - th * bf;
    rr(ctx, x0, top, tw, th, 18, col.panel, col.muted, 2);
    ctx.save(); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, top, tw, th, 18) : ctx.rect(x0, top, tw, th); ctx.clip();
    ctx.fillStyle = '#f3d98b'; ctx.globalAlpha = 0.85; ctx.fillRect(x0, top, tw, yB - top); ctx.globalAlpha = 1;
    ctx.fillStyle = '#eee'; ctx.fillRect(x0, yB, tw, yR - yB); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.9; ctx.fillRect(x0, yR, tw, top + th - yR); ctx.restore(); ctx.globalAlpha = 1;
    rr(ctx, x0, top, tw, th, 18, null, col.muted, 2);
    const lab = (y, a, b, c) => { text(ctx, a, x0 + tw + 14, y, { color: col.ink, size: 11.5, weight: 700 }); text(ctx, b, x0 + tw + 14, y + 14, { color: col.muted, size: 10.5 }); };
    lab(top + (yB - top) / 2 - 12, `Plasma ${Math.round(100 - hct - 1)} %`, 'water 90 %, proteins 7 %, salts');
    text(ctx, '1 %: white cells + platelets (buffy coat)', x0 + tw + 14, yB - 2, { color: col.muted, size: 10 });
    lab((yR + top + th) / 2 - 12, `Red cells ${Math.round(hct)} %`, 'carry O₂ (haemoglobin), no nucleus, 120 days');
  };
  go();
}
