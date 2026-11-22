// The cross-bridge cycle of muscle contraction as a step player. Calcium uncovers the binding sites, a myosin head
// with ADP and Pi attached grabs actin, the power stroke pulls the thin filament, and a new ATP lets go. One cycle moves
// the actin a few nanometres; many heads cycling many times shorten the sarcomere.
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NAMES = ['1. Resting: sites covered', '2. Ca²⁺ binds troponin', '3. Head binds actin (cross-bridge)', '4. Power stroke', '5. ATP binds: head lets go', '6. ATP split: head re-cocks'];
const TXT = ['Low Ca²⁺: tropomyosin covers the myosin binding sites on actin.', 'Ca²⁺ binds troponin, tropomyosin moves aside and the sites are open.', 'The cocked head (ADP + Pi) attaches to actin.', 'Pi and ADP leave, the head swivels and pulls actin toward the middle of the sarcomere.', 'A new ATP binds the head, which detaches from actin.', 'ATPase splits ATP to ADP + Pi, the head returns to its cocked position. Repeat while Ca²⁺ and ATP last.'];
const ANG = [0.9, 0.9, 0.9, 0.2, 0.2, 0.9], BOUND = [0, 0, 1, 1, 0, 0], OFF = [0, 0, 0, -26, -26, -26], TROPO = [0, 1, 1, 1, 1, 1];

export default function (host) {
  return stepper(host, { aspect: 0.85, max: 360, min: 290, stages: 6, label: 'A myosin head cycling on an actin filament' }, (ctx, w, h, col, st, k, t, pv) => {
    title(ctx, NAMES[st], col);
    const my = h * 0.28, ay = h * 0.6, off = mix(OFF[pv], OFF[st], k), tro = mix(TROPO[pv], TROPO[st], k);
    // myosin thick filament
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.roundRect(14, my - 12, w - 28, 24, 12); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'myosin (thick filament)', 22, my - 22, { color: col.s[1], size: 10.5, weight: 700 });
    // actin thin filament: beads, shifted by "off"
    ctx.save(); ctx.translate(off, 0);
    for (let i = -2; i < 24; i++) { const x = 14 + i * 22; ctx.beginPath(); ctx.arc(x, ay - 0, 10, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke(); }
    // tropomyosin covering sites (slides off when Ca2+ is present)
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 4; ctx.beginPath(); const tmy = ay - 16 + tro * 14; ctx.moveTo(10, tmy); ctx.lineTo(w - 10, tmy); ctx.stroke();
    ctx.restore();
    text(ctx, 'actin (thin filament) with tropomyosin', 22, ay + 30, { color: col.s[0], size: 10.5, weight: 700 });
    // myosin head: hinge on the thick filament, bent lever to the tip that touches actin
    const TIPX = [22, 22, 22, -4, -4, 22], TIPY = [-30, -30, -13, -13, -30, -30];
    const hx = w * 0.5, hy = my + 12, tx = hx + mix(TIPX[pv], TIPX[st], k), ty = ay + mix(TIPY[pv], TIPY[st], k);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + (tx - hx) * 0.4 + 12, hy + (ty - hy) * 0.5); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.beginPath(); ctx.arc(tx, ty, 10, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill();
    text(ctx, st === 4 ? 'ATP' : st === 3 ? 'ADP + Pi leave' : 'ADP + Pi', tx + 16, ty - 14, { color: col.ink, size: 10.5, weight: 700, fit: true });
    if (st === 1) for (let i = 0; i < 4; i++) { ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(w * 0.18 + i * w * 0.2, ay - 28 - Math.sin(t * 3 + i) * 3, 4, 0, 7); ctx.fill(); }
    if (st === 1) text(ctx, 'Ca²⁺', w * 0.18, ay - 42, { color: col.warn, size: 10.5, weight: 700 });
    if (st === 3) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w * 0.62, ay + 16); ctx.lineTo(w * 0.5, ay + 16); ctx.stroke(); text(ctx, '← actin slides', w * 0.62, ay + 28, { color: col.ink, size: 10.5, weight: 700, align: 'left', fit: false }); }
    wrap(ctx, TXT[st] + (st === 3 ? ' (The Z-lines come closer.)' : ' (pink line = tropomyosin)'), w / 2, h - 44, w - 24, { color: col.ink, size: 11 });
  });
}
