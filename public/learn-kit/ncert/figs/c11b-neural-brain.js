// Class 11 Biology, Neural control: parts of the human brain and what each does. Cerebrum (four lobes, two hemispheres joined by the corpus callosum), thalamus, hypothalamus,
// cerebellum, and the brainstem: midbrain, pons and medulla oblongata. A schematic side view, not to scale.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'frontal';
  const D = { frontal: ['Frontal lobe', 'cerebrum', 'thinking, planning, speech (Broca), voluntary movement, personality'], parietal: ['Parietal lobe', 'cerebrum', 'touch, pain and temperature, body position'], temporal: ['Temporal lobe', 'cerebrum', 'hearing, smell, memory, understanding speech (Wernicke)'], occipital: ['Occipital lobe', 'cerebrum', 'vision: all seeing is processed here'], thal: ['Thalamus', 'forebrain', 'relay station: sends sensory signals to the right part of the cerebrum'], hypo: ['Hypothalamus', 'forebrain', 'body temperature, hunger, thirst, sleep, emotions; controls the pituitary gland'], cb: ['Cerebellum', 'hindbrain', 'balance, posture, smooth coordinated movement'], stem: ['Brainstem: midbrain, pons, medulla', 'brainstem', 'medulla controls breathing, heartbeat, swallowing and vomiting; pons links the cerebellum and handles breathing rhythm; midbrain: eye movement, hearing reflexes'] };
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A side view of the brain; choose a region to highlight it and read what it does' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Region', Object.entries(D).map(([a, b]) => [a, b[0].split(':')[0].replace(' lobe', '')]), k, (v) => { k = v; go(); });
  const go = () => { ro.textContent = `${D[k][0]} (${D[k][1]}): ${D[k][2]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, D[k][0], col), cx = w * 0.5, cy = t0 + (h - t0) * 0.42, R = Math.min(w * 0.36, (h - t0) * 0.3), on = (n) => k === n;
    const lobe = (name, a0, a1, c) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.ellipse(cx, cy, R * 1.25, R, 0, a0, a1); ctx.closePath(); ctx.fillStyle = on(name) ? col.s[3] : c; ctx.globalAlpha = on(name) ? 1 : 0.55; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.bg; ctx.lineWidth = 2.5; ctx.stroke(); };
    lobe('frontal', Math.PI * 1.1, Math.PI * 1.6, col.s[0]); lobe('parietal', Math.PI * 1.6, Math.PI * 1.95, col.s[2]); lobe('occipital', Math.PI * 1.95, Math.PI * 2.35, col.s[4]); lobe('temporal', Math.PI * 0.6, Math.PI * 1.1, col.s[1] ?? col.s[5]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.ellipse(cx, cy, R * 1.25, R, 0, Math.PI * 0.35, Math.PI * 0.6); ctx.closePath(); ctx.fillStyle = col.s[1] ?? col.s[5]; ctx.globalAlpha = on('temporal') ? 1 : 0.55; if (on('temporal')) ctx.fillStyle = col.s[3]; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.ellipse(cx + R * 0.75, cy + R * 0.95, R * 0.5, R * 0.32, 0, 0, 7); ctx.fillStyle = on('cb') ? col.s[3] : col.s[5]; ctx.globalAlpha = on('cb') ? 1 : 0.7; ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = on('stem') ? col.s[3] : col.muted; ctx.beginPath(); ctx.roundRect(cx - R * 0.1, cy + R * 0.25, R * 0.28, R * 1.2, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx - R * 0.05, cy - R * 0.02, R * 0.32, R * 0.2, 0, 0, 7); ctx.fillStyle = on('thal') ? col.s[3] : col.ink; ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx - R * 0.02, cy + R * 0.22, R * 0.14, R * 0.1, 0, 0, 7); ctx.fillStyle = on('hypo') ? col.s[3] : col.s[6] ?? col.ink; ctx.fill();
    [['frontal', cx - R * 0.8, cy - R * 0.35], ['parietal', cx + R * 0.3, cy - R * 0.75], ['occipital', cx + R * 1.0, cy - R * 0.15], ['temporal', cx - R * 0.45, cy + R * 0.62]].forEach(([n, x, y]) => text(ctx, { frontal: 'F', parietal: 'P', occipital: 'O', temporal: 'T' }[n], x, y, { color: col.bg, size: 12, weight: 700, align: 'center' }));
    text(ctx, 'front', cx - R * 1.3, cy + R * 1.2, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'back', cx + R * 1.35, cy + R * 1.3, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'F frontal · P parietal · T temporal · O occipital', w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
