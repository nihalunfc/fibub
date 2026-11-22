// Class 10 Control and Coordination: the human brain in side view. Forebrain: cerebrum (thinking, memory, senses,
// voluntary movement) and hypothalamus (hunger, thirst, body temperature, pituitary control). Midbrain: eye and ear
// reflexes. Hindbrain: cerebellum (balance, posture, smooth movement), pons, medulla (involuntary actions: heartbeat,
// breathing, blood pressure, vomiting). Choose a part to light it up and see what is lost if it is damaged.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

const B = {
  cerebrum: { n: 'Cerebrum', g: 'Forebrain', f: 'Thinking, memory, speech, voluntary movement; receives sight, hearing, touch, smell and taste.', d: 'Damage (stroke): loss of speech, memory or movement on the opposite side.', c: 0 },
  hypo: { n: 'Hypothalamus', g: 'Forebrain', f: 'Controls hunger, thirst, sleep and body temperature, and controls the pituitary gland.', d: 'Damage: body temperature and hormone control go wrong.', c: 1 },
  mid: { n: 'Midbrain', g: 'Midbrain', f: 'Controls reflex movements of the eyes (pupil size) and ears.', d: 'Damage: pupils do not respond to light.', c: 2 },
  cereb: { n: 'Cerebellum', g: 'Hindbrain', f: 'Balance, posture and smooth, coordinated movement, like riding a cycle or threading a needle.', d: 'Damage: shaky, clumsy movements; walking becomes unsteady.', c: 3 },
  pons: { n: 'Pons', g: 'Hindbrain', f: 'A bridge that carries messages between brain parts; helps regulate breathing.', d: 'Damage: loss of facial movement.', c: 4 },
  med: { n: 'Medulla', g: 'Hindbrain', f: 'Involuntary actions: heartbeat, breathing, blood pressure, swallowing, vomiting.', d: 'Damage is often fatal.', c: 7 },
};
export default function (host) {
  let k = 'cerebrum';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A side view of the human brain with its parts highlighted' });
  const ctl = row(host);
  choice(ctl, 'Part', Object.entries(B).map(([v, o]) => [v, o.n]), k, (v) => { k = v; say(); });
  const out = readout(host);
  function say() { out.innerHTML = `<b>${B[k].n}</b> (${B[k].g}). ${B[k].f} <i>${B[k].d}</i>`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, B[k].n + ' (' + B[k].g + ')', col) + 8, cx = w * 0.5, cy = top + (h - top) * 0.42, s = Math.min(w, h) / 440 * 1.2;
    const part = (id, draw) => { ctx.save(); ctx.fillStyle = col.s[B[id].c]; ctx.globalAlpha = k === id ? 0.85 : 0.22; draw(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = k === id ? 3 : 1.5; ctx.stroke(); ctx.restore(); };
    part('cerebrum', () => { ctx.beginPath(); ctx.ellipse(cx, cy - 12 * s, 120 * s, 70 * s, 0, 0, 7); });
    part('hypo', () => { ctx.beginPath(); ctx.ellipse(cx + 4 * s, cy + 22 * s, 14 * s, 10 * s, 0, 0, 7); });
    part('mid', () => { ctx.beginPath(); ctx.ellipse(cx - 6 * s, cy + 40 * s, 18 * s, 12 * s, 0, 0, 7); });
    part('cereb', () => { ctx.beginPath(); ctx.ellipse(cx - 70 * s, cy + 62 * s, 44 * s, 26 * s, 0.1, 0, 7); });
    part('pons', () => { ctx.beginPath(); ctx.ellipse(cx - 4 * s, cy + 62 * s, 18 * s, 14 * s, 0, 0, 7); });
    part('med', () => { ctx.beginPath(); ctx.ellipse(cx - 8 * s, cy + 88 * s, 13 * s, 22 * s, 0, 0, 7); });
    // folds on cerebrum
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(cx - 70 * s + i * 34 * s, cy - 40 * s, 12 * s, 0.3, 2.9); ctx.stroke(); }
    // spinal cord
    line(ctx, [[cx - 8 * s, cy + 108 * s], [cx - 8 * s, cy + 150 * s]], col.s[6], 8 * s); text(ctx, 'spinal cord', cx + 14 * s, cy + 140 * s, { color: col.muted, size: 10 });
    text(ctx, 'front', cx + 118 * s, cy - 82 * s, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'back', cx - 118 * s, cy - 82 * s, { color: col.muted, size: 10, align: 'center' });
    const lab = { cerebrum: [cx + 50 * s, cy - 10 * s], hypo: [cx + 4 * s, cy + 22 * s], mid: [cx - 6 * s, cy + 40 * s], cereb: [cx - 70 * s, cy + 62 * s], pons: [cx - 4 * s, cy + 62 * s], med: [cx - 8 * s, cy + 88 * s] };
    Object.entries(lab).forEach(([id, [x, y]]) => text(ctx, {cerebrum:'Ce',hypo:'Hy',mid:'Mb',cereb:'Cb',pons:'Po',med:'Md'}[id], x, y, { color: col.ink, size: 11, weight: 700, align: 'center', fit: false }));
    text(ctx, 'tap a part below to highlight it', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
