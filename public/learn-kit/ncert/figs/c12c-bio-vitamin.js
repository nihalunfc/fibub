// Class 12 Chemistry, Biomolecules: vitamins. Pick a vitamin to see whether it dissolves in fat or water, where you get it (mostly Indian foods) and the deficiency disease.
// Fat-soluble vitamins (A, D, E, K) are stored in body fat and can build up; water-soluble ones (B group, C) are not stored (apart from B12) and are needed regularly.
// Facts follow standard nutrition references (WHO/FAO vitamin and mineral requirements; ICMR-NIN dietary guidelines for Indians).
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const V = {
  A: ['A (retinol)', 'fat', 'carrots, papaya, spinach, liver, ghee, fish oil', 'night blindness; xerophthalmia'],
  D: ['D (calciferol)', 'fat', 'sunlight on skin, egg yolk, fish', 'rickets in children; osteomalacia in adults'],
  E: ['E (tocopherol)', 'fat', 'vegetable oils, nuts, seeds', 'rare: fragile red blood cells'],
  K: ['K', 'fat', 'green leafy vegetables, gut bacteria', 'blood clots slowly'],
  B1: ['B₁ (thiamine)', 'water', 'whole grains, pulses, groundnuts', 'beri-beri'],
  B2: ['B₂ (riboflavin)', 'water', 'milk, eggs, green vegetables', 'cracks at the mouth corners; sore tongue'],
  B6: ['B₆ (pyridoxine)', 'water', 'cereals, pulses, bananas', 'convulsions; anaemia'],
  B12: ['B₁₂ (cobalamin)', 'water', 'milk, curd, eggs, meat (not in plants)', 'pernicious anaemia'],
  C: ['C (ascorbic acid)', 'water', 'amla, guava, citrus fruits, peppers', 'scurvy'],
};
export default function (host) {
  let k = 'C';
  const cv = canvas(host, { aspect: 0.7, max: 320, min: 260, label: 'A vitamin card showing whether it is fat- or water-soluble, its sources and the deficiency disease' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'vitamin', Object.keys(V).map((x) => [x, x]), k, (v) => { k = v; go(); });
  const go = () => { const o = V[k]; ro.textContent = `Vitamin ${o[0]}: ${o[1]}-soluble. Sources: ${o[2]}. Lack of it causes ${o[3]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const o = V[k], top = title(ctx, 'Vitamin ' + o[0], col), fat = o[1] === 'fat', cx = w * 0.2, cy = top + 50;
    // droplet icon
    ctx.fillStyle = fat ? col.s[2] : col.s[0]; ctx.beginPath(); ctx.moveTo(cx, cy - 28); ctx.bezierCurveTo(cx + 26, cy, cx + 26, cy + 26, cx, cy + 26); ctx.bezierCurveTo(cx - 26, cy + 26, cx - 26, cy, cx, cy - 28); ctx.fill();
    text(ctx, fat ? 'FAT' : 'WATER', cx, cy + 8, { color: col.panel, size: 11, weight: 700, align: 'center' });
    text(ctx, fat ? 'fat-soluble: stored in body fat' : 'water-soluble: not stored, needed often', cx + 40, cy - 10, { color: col.ink, size: 12, weight: 700 });
    text(ctx, fat ? 'too much can build up (hypervitaminosis)' : 'excess is passed out in urine', cx + 40, cy + 10, { color: col.muted, size: 11 });
    const row2 = (lab, s, y, c) => { text(ctx, lab, 16, y, { color: c, size: 11, weight: 700 }); const ws = s.split(' '); let l = '', yy = y + 18; ws.forEach((wd) => { if ((l + ' ' + wd).length > 46) { text(ctx, l, 16, yy, { color: col.ink, size: 12 }); yy += 16; l = wd; } else l = l ? l + ' ' + wd : wd; }); text(ctx, l, 16, yy, { color: col.ink, size: 12 }); };
    row2('SOURCES', o[2], top + 104, col.s[1]); row2('DEFICIENCY DISEASE', o[3], top + 172, col.s[3]);
  };
  go();
}
