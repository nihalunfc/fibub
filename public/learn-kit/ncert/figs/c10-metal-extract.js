// Class 10 Metals and Non-metals (step player): how a metal is extracted depends on where it sits in the reactivity series.
// Low (Hg, Cu, Ag, Au): heating the ore or its sulphide is enough. Middle (Zn, Fe, Pb): concentrate, roast or calcine to
// the oxide, then reduce with carbon. High (K, Na, Ca, Mg, Al): the oxide holds on too hard for carbon, so electrolyse
// the molten compound. Finally refine the metal (electrolytic refining).
import { canvas, text, title, line, loop } from '../../kit.js';

const LAD = [['K', 0], ['Na', 0], ['Ca', 0], ['Mg', 0], ['Al', 0], ['Zn', 1], ['Fe', 1], ['Pb', 1], ['H', -1], ['Cu', 2], ['Hg', 2], ['Ag', 2], ['Au', 2]];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'The reactivity series with three zones and the matching method of extracting the metal' });
  const TITLES = ['Where is the metal in the series?', 'Least reactive: heat alone', 'Middle: roast or calcine, then reduce with carbon', 'Most reactive: electrolysis of the molten compound', 'Last step: refine the metal'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6, lx = 12, ly = top + 8, rh = (h - ly - 16) / LAD.length;
    const grp = [-2, 0, 1, 2, 0][step] === -2 ? null : null;
    const zone = [null, 2, 1, 0, null][step];
    LAD.forEach(([m, g], i) => {
      const y = ly + i * rh, on = zone === null || g === zone;
      ctx.fillStyle = g === -1 ? col.soft : on ? [col.s[1], col.s[3], col.s[2]][g] : col.soft; ctx.globalAlpha = on ? 1 : 0.4; ctx.fillRect(lx, y + 1, 40, rh - 3); ctx.globalAlpha = 1;
      text(ctx, m, lx + 20, y + rh / 2, { color: g === -1 ? col.muted : on ? '#fff' : col.ink, size: Math.min(13, rh - 3), weight: 700, align: 'center' });
    });
    text(ctx, 'more reactive', lx + 20, ly - 2, { color: col.muted, size: 9, align: 'center' });
    // right panel
    const px = lx + 56, pw = w - px - 10, box = (y, hh, txt, c, on = true) => { ctx.strokeStyle = c; ctx.lineWidth = on ? 2.5 : 1.2; ctx.strokeRect(px, y, pw, hh); const L = wrap(txt, Math.floor(pw / 6.3)); L.forEach((l, i) => text(ctx, l, px + 6, y + 12 + i * 13, { color: on ? col.ink : col.muted, size: 10.5, weight: i === 0 ? 700 : 400 })); };
    const y0 = ly, tex = [['High: K, Na, Ca, Mg, Al', 'Carbon cannot reduce their oxides. Electrolyse the molten chloride or oxide: Na⁺ + e⁻ → Na at the cathode. Al₂O₃ in molten cryolite gives aluminium.'], ['Middle: Zn, Fe, Pb', 'Ores are sulphides or carbonates. Roast a sulphide in air or calcine a carbonate to get the oxide, then reduce it: ZnO + C → Zn + CO.'], ['Low: Cu, Hg, Ag, Au', 'Heat the ore in air. Cinnabar: 2HgS + 3O₂ → 2HgO + 2SO₂, then 2HgO → 2Hg + O₂. Cu₂S is heated to give copper.']];
    const bh = (h - ly - 16) / 3;
    if (step === 0) {
      [0, 1, 2].forEach((g, i) => { const txt = tex[g]; ctx.fillStyle = [col.s[1], col.s[3], col.s[2]][g]; ctx.fillRect(px, y0 + i * (bh - 4) + 2, 6, bh - 12); text(ctx, txt[0], px + 12, y0 + i * (bh - 4) + 16, { color: col.ink, size: 11.5, weight: 700 }); wrap(txt[1], Math.floor((pw - 14) / 6)).slice(0, 4).forEach((l, q) => text(ctx, l, px + 12, y0 + i * (bh - 4) + 31 + q * 12, { color: col.muted, size: 10 })); });
    } else if (step === 4) {
      text(ctx, 'Impure metal from any method', px + 4, y0 + 10, { color: col.ink, size: 11.5, weight: 700 });
      wrap('Electrolytic refining of copper: the impure metal is the anode, a thin sheet of pure copper is the cathode, and the electrolyte is acidified copper sulphate. Pure copper deposits on the cathode and impurities settle as anode mud.', Math.floor((pw - 6) / 6.1)).forEach((l, i) => text(ctx, l, px + 4, y0 + 30 + i * 13, { color: col.muted, size: 10.5 }));
      // mini tank
      const tx = px + 10, ty = y0 + 130, tw = pw - 20, th = h - ty - 20; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.fillRect(tx, ty, tw, th); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(tx, ty, tw, th);
      ctx.fillStyle = '#b8642a'; ctx.fillRect(tx + tw * 0.2, ty - 10, 14, th - 8); ctx.fillRect(tx + tw * 0.7, ty - 10, 6, th - 8);
      text(ctx, 'anode (+)', tx + tw * 0.2 + 7, ty + th + 11, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, 'cathode (−)', tx + tw * 0.7 + 3, ty + th + 11, { color: col.muted, size: 9.5, align: 'center' });
      for (let i = 0; i < 4; i++) { const f = (t * 0.4 + i / 4) % 1; ctx.fillStyle = col.s[7]; ctx.beginPath(); ctx.arc(tx + tw * 0.2 + 18 + (tw * 0.5 - 18) * f, ty + 20 + i * 14, 3, 0, 7); ctx.fill(); }
    } else {
      const k = step === 1 ? 2 : step === 2 ? 1 : 0, txt = tex[k];
      box(y0, bh * 1.2, txt[0] + '. ' + txt[1], [col.s[1], col.s[3], col.s[2]][k]);
      // flow of method boxes
      const flows = [['Molten ore', 'electrolysis', 'metal at cathode'], ['Ore', 'roast / calcine', 'oxide', 'reduce with C', 'metal'], ['Ore', 'heat in air', 'metal']][k];
      const fy = y0 + bh * 1.3, fw = Math.min(70, (pw - 14) / flows.filter((_, i) => i % 2 === 0).length);
      let x = px + 2;
      flows.forEach((f, i) => { if (i % 2 === 0) { ctx.fillStyle = col.soft; ctx.fillRect(x, fy, fw, 28); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, fy, fw, 28); wrap(f, 11).slice(0, 2).forEach((l, q) => text(ctx, l, x + fw / 2, fy + 11 + q * 11, { color: col.ink, size: 9.5, weight: 700, align: 'center' })); x += fw; } else { const lw = Math.max(26, (pw - 4 - fw * flows.filter((_, j) => j % 2 === 0).length) / (flows.length >> 1)); line(ctx, [[x, fy + 14], [x + lw, fy + 14]], col.ink, 2); const prog = (t * 0.5) % 1; ctx.fillStyle = col.s[7]; ctx.beginPath(); ctx.arc(x + lw * prog, fy + 14, 3.5, 0, 7); ctx.fill(); wrap(f, Math.max(8, Math.floor(lw / 5.5))).slice(0, 3).forEach((l, q) => text(ctx, l, x + lw / 2, fy + 34 + q * 10, { color: col.muted, size: 9, align: 'center' })); x += lw; } });
      const examples = ['NaCl (molten) → Na and Cl₂; Al₂O₃ → Al and O₂.', 'Zinc blende ZnS → ZnO → Zn; haematite Fe₂O₃ + 3CO → 2Fe + 3CO₂.', 'Cinnabar HgS → mercury; copper glance Cu₂S → copper.'][k];
      wrap(examples, Math.floor(pw / 6.2)).forEach((l, i) => text(ctx, l, px + 2, fy + 78 + i * 12, { color: col.ink, size: 10.5 }));
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
function wrap(s, n) { const out = []; let a = ''; s.split(' ').forEach((wd) => { if ((a + ' ' + wd).trim().length > n && a) { out.push(a); a = wd; } else a = (a + ' ' + wd).trim(); }); if (a) out.push(a); return out; }
