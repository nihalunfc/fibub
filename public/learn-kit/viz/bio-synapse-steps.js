// A chemical synapse as a step player: the impulse reaches the axon terminal, calcium enters, vesicles fuse and release
// neurotransmitter, it crosses the cleft, opens receptor channels on the next neuron, and is then cleared away.
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NAMES = ['1. Action potential arrives', '2. Ca²⁺ channels open', '3. Vesicles fuse (exocytosis)', '4. Transmitter crosses the cleft', '5. Receptors open, Na⁺ enters', '6. Transmitter removed'];

export default function (host) {
  return stepper(host, { aspect: 1.0, max: 420, min: 330, stages: 6, label: 'A chemical synapse in six steps' }, (ctx, w, h, col, st, k, t) => {
    title(ctx, NAMES[st], col);
    const top = 52, cleftY = h * 0.5, cl = 26, bot = cleftY + cl;
    // presynaptic terminal (top) and postsynaptic membrane (bottom)
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.roundRect(w * 0.12, top, w * 0.76, cleftY - top - 4, 24); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.18; ctx.fillRect(w * 0.05, bot + 4, w * 0.9, h - bot - 40); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.strokeRect(w * 0.05, bot + 4, w * 0.9, h - bot - 40);
    text(ctx, 'axon terminal (presynaptic)', w * 0.16, top + 14, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'next neuron (postsynaptic)', w * 0.1, bot + 20, { color: col.s[2], size: 11, weight: 700 });
    text(ctx, 'synaptic cleft (about 20 nm)', w - 8, cleftY + 13, { color: col.muted, size: 10, align: 'right', fit: false });
    // Ca channels on the terminal membrane, receptors on the postsynaptic membrane
    const cx = [0.3, 0.7], rx = [0.28, 0.5, 0.72];
    cx.forEach((f) => { ctx.fillStyle = st >= 1 && st <= 2 ? col.good : col.muted; ctx.fillRect(f * w - 6, cleftY - 10, 12, 8); });
    rx.forEach((f) => { ctx.fillStyle = st === 4 ? col.good : col.muted; ctx.fillRect(f * w - 8, bot - 2, 16, 8); });
    text(ctx, 'Ca²⁺ channel', cx[1] * w, cleftY - 20, { color: col.muted, size: 9.5, align: 'center', fit: false });
    text(ctx, 'receptor channel', rx[1] * w, bot + 30, { color: col.muted, size: 9.5, align: 'center', fit: false });
    // spike
    if (st === 0) { ctx.fillStyle = col.bad; ctx.globalAlpha = 0.7; const y = top + 40 + 0 * t; ctx.beginPath(); ctx.arc(w * 0.5, top + 36 + (1 - k) * -10, 7, 0, 7); ctx.fill(); ctx.globalAlpha = 1; text(ctx, 'AP', w * 0.5 + 12, top + 36, { color: col.bad, size: 11, weight: 700 }); }
    // calcium ions
    if (st >= 1 && st <= 3) for (let i = 0; i < 6; i++) { const f = cx[i % 2], yy = mix(cleftY + 4, top + 70, ((k + (i % 3) / 3) % 1) * (st === 1 ? k : 1)); ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(f * w + ((i % 3) - 1) * 6, yy, 3.5, 0, 7); ctx.fill(); }
    // vesicles: 5 near the membrane, they move down and open at stage 2
    const V = [[0.25, 0], [0.38, 1], [0.5, 0], [0.62, 1], [0.75, 0]];
    V.forEach(([f, r], i) => {
      const settle = st < 2 ? 0 : 1, y = top + 52 + r * 18 + (st >= 2 ? (st === 2 ? k : 1) * (cleftY - top - 78 - r * 18) : 0);
      if (st >= 2 && i % 2 === 0) { if (st > 2) return; }
      ctx.beginPath(); ctx.arc(f * w, y, 9, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke();
      for (let j = 0; j < 3; j++) { ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(f * w - 4 + j * 4, y + (j % 2) * 3 - 1, 1.8, 0, 7); ctx.fill(); }
    });
    // neurotransmitter molecules
    const nt = (i, prog) => { const f = rx[i % 3] + ((i * 7) % 5 - 2) * 0.015, y = mix(cleftY - 8, bot - 4, prog); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(f * w + Math.sin(t * 3 + i) * 2, y, 3.2, 0, 7); ctx.fill(); };
    if (st === 2) for (let i = 0; i < 9; i++) nt(i, k * 0.3);
    if (st === 3) for (let i = 0; i < 9; i++) nt(i, 0.3 + 0.7 * k);
    if (st === 4) for (let i = 0; i < 9; i++) nt(i, 1);
    if (st === 5) for (let i = 0; i < 9; i++) { const prog = 1 - k; if (i % 3 === 0) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(rx[i % 3] * w, mix(cleftY - 8, bot - 4, 1 - k * 0.8), 3.2, 0, 7); ctx.fill(); ctx.globalAlpha = 1; } else nt(i, mix(1, 0, k)); }
    // sodium into the postsynaptic cell
    if (st === 4) for (let i = 0; i < 6; i++) { const f = rx[i % 3], yy = bot + 8 + ((k + i / 6) % 1) * 36; ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(f * w + (i < 3 ? -4 : 4), yy, 3.5, 0, 7); ctx.fill(); }
    const LINE = ['Voltage change reaches the terminal.', 'Depolarisation opens voltage-gated Ca²⁺ channels: calcium flows in.', 'Ca²⁺ makes vesicles of neurotransmitter fuse with the membrane.', 'Transmitter (for example acetylcholine) diffuses across the cleft.', 'It binds receptors: ligand-gated channels open, Na⁺ enters (a postsynaptic potential).', 'Enzymes (acetylcholinesterase) break it down or it is taken back up: the signal stops.'];
    wrap(ctx, LINE[st], w / 2, h - 26, w - 24, { color: col.ink, size: 11 });
  });
}
