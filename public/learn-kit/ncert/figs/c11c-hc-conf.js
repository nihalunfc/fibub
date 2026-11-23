// Class 11 Chemistry, Hydrocarbons: conformations of butane. Rotation about the central C2-C3 bond gives conformers: anti (CH3 groups 180 deg apart, lowest energy), gauche (60 deg, about 3.8 kJ/mol higher),
// eclipsed (120 deg: CH3 with H, about 16 kJ/mol) and fully eclipsed (0 deg: CH3 with CH3, about 19 kJ/mol, the highest). Angle shown = dihedral angle between the two CH3 groups. Energies are typical textbook values.
// The Newman projection looks straight down C2-C3: front carbon bonds meet at the centre, back carbon bonds start at the circle.
import { canvas, text, title, slider, button, readout, row, loop, clamp } from '../../kit.js';

const KEY = [[0, 19], [60, 3.8], [120, 16], [180, 0], [240, 16], [300, 3.8], [360, 19]];
const E = (a) => { a = ((a % 360) + 360) % 360; for (let i = 0; i < 6; i++) { const [a0, e0] = KEY[i], [a1, e1] = KEY[i + 1]; if (a >= a0 && a <= a1) { const t = (a - a0) / (a1 - a0); return e0 + (e1 - e0) * (1 - Math.cos(Math.PI * t)) / 2; } } return 0; };
const NAME = (a) => { a = ((a % 360) + 360) % 360; const d = (x) => Math.min(Math.abs(a - x), 360 - Math.abs(a - x)) < 12; return d(180) ? 'anti (staggered, lowest energy)' : d(60) || d(300) ? 'gauche (staggered)' : d(0) || d(360) ? 'fully eclipsed (highest energy)' : d(120) || d(240) ? 'eclipsed' : 'in between'; };
export default function (host) {
  let ang = 180;
  const cv = canvas(host, { aspect: 1.3, max: 520, min: 380, label: 'Newman projection of butane turning about its central bond with the energy curve' });
  const ctl = row(host), ro = readout(host);
  const sl = slider(ctl, { label: 'rotate the back carbon (degrees)', min: 0, max: 360, step: 1, value: ang, fmt: (v) => Math.round(v) + '°', oninput: (v) => { ang = v; playing = false; go(); } });
  let playing = false;
  loop(host, (dt) => { if (playing) { ang = (ang + dt * 40) % 360; sl.set(ang); go(); } }, { autoplay: true });
  button(ctl, '▶ Spin', () => { playing = !playing; });
  const go = () => { ro.textContent = `Angle between the two CH₃ groups: ${Math.round(ang)}°: ${NAME(ang)}. Energy above the lowest: ${E(ang).toFixed(1)} kJ/mol. At room temperature molecules spin through all of these in nanoseconds, so conformers cannot be separated.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Butane about C2–C3 (Newman projection)', col);
    const r = Math.min(42, w * 0.13), cx = w * 0.3, cy = 134, rad = (d) => (d * Math.PI) / 180;
    // front carbon: CH3 at 180 deg measured from "up"; use screen angles
    const front = [[0, 'CH₃'], [120, 'H'], [240, 'H']], back = [[ang, 'CH₃'], [ang + 120, 'H'], [ang + 240, 'H']];
    // back bonds first, then circle, then front bonds
    back.forEach(([a, l]) => { const x = cx + Math.sin(rad(a)) * r, y = cy - Math.cos(rad(a)) * r, x2 = cx + Math.sin(rad(a)) * (r + 30), y2 = cy - Math.cos(rad(a)) * (r + 30); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); text(ctx, l, cx + Math.sin(rad(a)) * (r + 44), cy - Math.cos(rad(a)) * (r + 44), { color: col.s[0], size: 11, weight: 700, align: 'center' }); });
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    front.forEach(([a, l]) => { const x2 = cx + Math.sin(rad(a)) * (r + 30), y2 = cy - Math.cos(rad(a)) * (r + 30); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x2, y2); ctx.stroke(); text(ctx, l, cx + Math.sin(rad(a)) * (r + 44), cy - Math.cos(rad(a)) * (r + 44) + (a === 0 ? 0 : 4), { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); });
    text(ctx, 'front carbon', w * 0.6, 70, { color: col.s[3], size: 11, weight: 700 }); text(ctx, 'back carbon', w * 0.6, 90, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, NAME(ang).split(' (')[0], w * 0.6, 124, { color: col.ink, size: 12.5, weight: 700 }); text(ctx, E(ang).toFixed(1) + ' kJ/mol', w * 0.6, 144, { color: col.muted, size: 11.5 });
    // energy plot
    const L = 40, R = w - 14, T = 226, B = h - 34, X = (a) => L + (a / 360) * (R - L), Y = (e) => B - (e / 21) * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(L, T, R - L, B - T);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.beginPath(); for (let a = 0; a <= 360; a += 3) { a ? ctx.lineTo(X(a), Y(E(a))) : ctx.moveTo(X(a), Y(E(a))); } ctx.stroke();
    [[0, '0°'], [60, '60°'], [120, '120°'], [180, '180°'], [240, '240°'], [300, '300°'], [360, '360°']].forEach(([a, l]) => { if (l) text(ctx, l, X(a), B + 10, { color: col.muted, size: 9.5, align: 'center' }); });
    ctx.beginPath(); ctx.arc(X(ang), Y(E(ang)), 6, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill();
    text(ctx, 'energy (kJ/mol)', L + 4, T + 10, { color: col.muted, size: 10 }); text(ctx, 'dihedral angle (°) 0 → 360', (L + R) / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
