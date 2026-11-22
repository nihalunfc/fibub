// Class 12 Human Health and Disease: innate immunity as four layers of defence. Switch each barrier on or off and see how many of 1000 invading germs get through.
// The pass-through fractions are illustrative (not measured), chosen only to show that several weak barriers together stop almost everything, and that one missing barrier (a cut in the skin) matters.
import { canvas, text, title, row, readout } from '../../kit.js';

const L = [['Skin', 'physical barrier', 0.1, 'Skin and the mucus lining of the nose, gut and lungs keep germs out; cilia sweep mucus up.'], ['Acids and enzymes', 'physiological barrier', 0.3, 'Stomach acid, saliva, tears and sweat contain enzymes and acids that kill germs.'], ['Phagocytes', 'cellular barrier', 0.2, 'Neutrophils, monocytes and macrophages engulf germs; natural killer cells destroy infected cells.'], ['Interferons', 'cytokine barrier', 0.5, 'Virus-infected cells make interferons, which warn neighbouring cells to resist the virus.']];
export default function (host) {
  const on = [true, true, true, true];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Four defence layers that germs must pass, with the number of germs surviving after each layer' });
  const ctl = row(host), ro = readout(host);
  const g = document.createElement('div'); g.className = 'lk-choice'; const gl = document.createElement('span'); gl.textContent = 'Barrier on:'; g.appendChild(gl); ctl.appendChild(g);
  L.forEach(([n], i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = n; b.setAttribute('aria-pressed', 'true'); b.addEventListener('click', () => { on[i] = !on[i]; b.setAttribute('aria-pressed', String(on[i])); go(); }); g.appendChild(b); });
  const counts = () => { const c = [1000]; L.forEach(([, , p], i) => c.push(on[i] ? c[i] * p : c[i])); return c; };
  const go = () => { const c = counts(); ro.textContent = `1000 germs arrive, ${Math.round(c[4] * 10) / 10} get through all active layers. ` + (on.every(Boolean) ? 'With every barrier working, almost none do (numbers are illustrative). Press a button to remove one, as a cut or burn would remove the skin.' : 'Removing a layer lets many more through: this is why burns, dry noses, low stomach acid, or a weak immune system raise the risk of infection.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Innate immunity: layers of defence', col), c = counts(), top = t0 + 16, rh = (h - top - 20) / 5, bw = w - 140, x0 = 16;
    for (let i = 0; i <= 4; i++) {
      const y = top + i * rh, v = c[i]; text(ctx, i === 0 ? 'Germs arriving' : `After ${L[i - 1][0].toLowerCase()}`, x0, y + 8, { color: col.muted, size: 10.5 });
      const wd = Math.max(2, bw * Math.sqrt(v / 1000)); ctx.fillStyle = i === 0 ? col.s[3] : (on[i - 1] ? col.s[0] : col.line); ctx.fillRect(x0, y + 18, wd, 20); text(ctx, String(Math.round(v * 10) / 10), x0 + wd + 6, y + 28, { color: col.ink, size: 12, weight: 700 });
      if (i > 0) text(ctx, on[i - 1] ? L[i - 1][1] : 'OFF', w - 12, y + 28, { color: on[i - 1] ? col.s[0] : col.bad, size: 10.5, weight: 700, align: 'right' });
    }
  };
  go();
}
