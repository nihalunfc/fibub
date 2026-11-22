// Double circulation as a step player: follow one red blood cell around the body. It crosses the heart twice per
// lap: right side to the lungs (pulmonary circuit, low pressure), back to the left side, then to the whole body
// (systemic circuit, high pressure). Colour shows oxygen: blue is low, red is high.
import { text, title, dot } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NAMES = ['Right atrium', 'Right ventricle', 'Pulmonary artery to the lungs', 'Lungs: gas exchange', 'Pulmonary veins to the left atrium', 'Left ventricle', 'Aorta to the body', 'Body tissues, then vena cava'];
const NOTE = ['Blood poor in oxygen arrives from the body through the vena cavae.', 'The right ventricle squeezes (pressure about 25 mmHg).', 'Only artery that carries deoxygenated blood.', 'Oxygen enters the blood, carbon dioxide leaves.', 'Only veins that carry oxygenated blood.', 'Thick walled: pushes blood out at about 120 mmHg.', 'Branches to every organ.', 'Oxygen is delivered; the blood returns to the right atrium.'];

export default function (host) {
  return stepper(host, { aspect: 1.1, max: 440, min: 340, stages: 8, label: 'The pulmonary and systemic circuits around the four chambers of the heart' }, (ctx, w, h, col, st, k, t, pv) => {
    title(ctx, NAMES[st], col);
    const path = [[0.43, 0.48], [0.43, 0.64], [0.33, 0.4], [0.5, 0.14], [0.67, 0.3], [0.57, 0.48], [0.57, 0.64], [0.8, 0.64], [0.78, 0.78], [0.5, 0.84], [0.22, 0.78], [0.26, 0.5], [0.43, 0.48]];
    const stageStart = [0, 1, 2, 3, 5, 6, 8, 12];
    const pos = (u) => { const f = u * (path.length - 1), i = Math.min(path.length - 2, Math.floor(f)), r = f - i; return [mix(path[i][0], path[i + 1][0], r) * w, mix(path[i][1], path[i + 1][1], r) * h]; };
    ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const seg = (a, b, c) => { ctx.strokeStyle = c; ctx.beginPath(); for (let i = a; i <= b; i++) { const [x, y] = [path[i][0] * w, path[i][1] * h]; i === a ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); };
    ctx.globalAlpha = 0.35; seg(0, 3, col.s[0]); seg(3, 6, col.s[5]); seg(6, 9, col.s[5]); seg(9, 12, col.s[0]); ctx.globalAlpha = 1;
    // heart chambers
    const box = (x, y, rw, rh, c, lab) => { ctx.fillStyle = c; ctx.globalAlpha = 0.45; ctx.fillRect(x * w - rw / 2, y * h - rh / 2, rw, rh); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x * w - rw / 2, y * h - rh / 2, rw, rh); text(ctx, lab, x * w, y * h, { color: col.ink, size: 11, weight: 700, align: 'center', fit: false }); };
    box(0.43, 0.48, 46, 30, col.s[0], 'RA'); box(0.57, 0.48, 46, 30, col.s[5], 'LA'); box(0.43, 0.64, 46, 44, col.s[0], 'RV'); box(0.57, 0.64, 50, 48, col.s[5], 'LV');
    // lungs and body labels
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.12, w * 0.2, 17, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'lungs', w * 0.5, h * 0.12, { color: col.ink, size: 12, weight: 700, align: 'center' });
        text(ctx, 'body tissues (head, trunk, limbs)', w * 0.5, h * 0.885, { color: col.muted, size: 10, align: 'center' });
    // the red cell: oxygenated after lungs (stage 4..6), deoxygenated in other stages
    const total = path.length - 1, u0 = stageStart[pv] / total, u1 = stageStart[st] / total, u = mix(u0, u1, k);
    const [x, y] = pos(u), ox = (s) => (s >= 3 && s <= 6 ? 1 : 0);
    const o = mix(ox(pv), ox(st), k);
    ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.fillStyle = `rgb(${Math.round(mix(40, 210, o))},${Math.round(mix(80, 40, o))},${Math.round(mix(200, 40, o))})`; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    wrap(ctx, NOTE[st], w / 2, h - 34, w - 24, { color: col.ink, size: 11 });
    text(ctx, 'blue: low oxygen, red: high oxygen', w / 2, h - 8, { color: col.muted, size: 10.5, align: 'center' });
  });
}
