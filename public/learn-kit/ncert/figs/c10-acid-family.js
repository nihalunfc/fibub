// Class 10 Acids, Bases and Salts (step player): the family tree of common salts made from brine (common salt, NaCl).
// Chlor-alkali process: 2NaCl + 2H2O -> 2NaOH + Cl2 + H2. Cl2 + slaked lime -> bleaching powder. NaCl + H2O + CO2 + NH3 ->
// NaHCO3 (baking soda) -> heat -> Na2CO3 (soda ash) -> crystallise with water -> washing soda Na2CO3.10H2O.
import { canvas, text, title, line, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A flow chart from brine to caustic soda, chlorine, bleaching powder, baking soda and washing soda' });
  const TITLES = ['Start: common salt solution (brine)', 'Electrolysis: the chlor-alkali process', 'Chlorine + slaked lime → bleaching powder', 'Baking soda from brine, ammonia and CO₂', 'Heat baking soda: soda ash, then washing soda', 'The salt family and their uses'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6;
    const N = {
      brine: [0.5, 0.12, 'NaCl solution', col.s[0]], naoh: [0.16, 0.26, 'NaOH', col.s[1]], cl: [0.5, 0.26, 'Cl₂', col.s[2]], h2: [0.84, 0.26, 'H₂', col.s[3]],
      bp: [0.5, 0.45, 'CaOCl₂ bleaching powder', col.s[2]], nahco3: [0.32, 0.6, 'NaHCO₃ baking soda', col.s[4]], na2co3: [0.32, 0.76, 'Na₂CO₃ soda ash', col.s[6]], wash: [0.32, 0.92, 'Na₂CO₃·10H₂O washing soda', col.s[7]],
    };
    const show = [['brine'], ['brine', 'naoh', 'cl', 'h2'], ['brine', 'naoh', 'cl', 'h2', 'bp'], ['brine', 'nahco3'], ['brine', 'nahco3', 'na2co3', 'wash'], ['brine', 'naoh', 'cl', 'h2', 'bp', 'nahco3', 'na2co3', 'wash']][step];
    const X = (k) => N[k][0] * w, Y = (k) => top + 12 + N[k][1] * (h - top - 96);
    const arrows = [['brine', 'naoh', 1], ['brine', 'cl', 1], ['brine', 'h2', 1], ['cl', 'bp', 2], ['brine', 'nahco3', 3], ['nahco3', 'na2co3', 4], ['na2co3', 'wash', 4]];
    arrows.forEach(([a, b, s]) => {
      if (!show.includes(a) || !show.includes(b)) return; const hot = step === s || step === 5;
      line(ctx, [[X(a), Y(a) + 10], [X(b), Y(b) - 11]], hot ? col.ink : col.line, hot ? 2.5 : 1.5, hot ? undefined : [4, 3]);
      if (hot) { const f = (t * 0.6) % 1; ctx.fillStyle = col.s[7]; ctx.beginPath(); ctx.arc(X(a) + (X(b) - X(a)) * f, Y(a) + 10 + (Y(b) - Y(a) - 21) * f, 3.5, 0, 7); ctx.fill(); }
    });
    show.forEach((k) => {
      const [, , lab, c] = N[k], x = X(k), y = Y(k), wd = Math.min(w * 0.44, Math.max(64, lab.length * 6.6));
      const focus = step === 5 || (step === 0 && k === 'brine') || (step === 1 && k !== 'brine') || (step === 2 && (k === 'bp' || k === 'cl')) || (step === 3 && k === 'nahco3') || (step === 4 && (k === 'na2co3' || k === 'wash'));
      ctx.fillStyle = col.soft; ctx.fillRect(x - wd / 2, y - 11, wd, 22); ctx.strokeStyle = c; ctx.lineWidth = focus ? 3 : 1.5; ctx.strokeRect(x - wd / 2, y - 11, wd, 22);
      text(ctx, lab, x, y, { color: col.ink, size: 10.5, weight: focus ? 700 : 500, align: 'center' });
    });
    const note = ['Brine is made by dissolving common salt in water. Ordinary salt is the raw material for a whole family of useful compounds.', '2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂. Cl₂ forms at the anode (+), H₂ at the cathode (−), and NaOH stays in the solution: a base, a gas for bleaching and fuel gas.', 'Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O. Used to bleach cotton, disinfect drinking water and make chlorine for swimming pools.', 'NaCl + H₂O + CO₂ + NH₃ → NH₄Cl + NaHCO₃. Baking soda is a mild base used in antacids and, with a mild acid, makes cakes rise (CO₂).', '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂ on heating; soda ash recrystallised with water gives washing soda, used to soften hard water and clean.', 'One raw material, brine, gives NaOH, Cl₂, H₂, bleaching powder, baking soda and washing soda.'][step];
    const lines = []; let a = ''; note.split(' ').forEach((wd) => { if ((a + ' ' + wd).length > Math.floor(w / 6.1)) { lines.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; }); lines.push(a);
    lines.forEach((l, i) => text(ctx, l, 8, h - 58 + i * 12, { color: col.muted, size: 9.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
