// The light reactions drawn as the Z-scheme: height is the energy level of the electron. Light lifts electrons at
// photosystem II (P680) and again at photosystem I (P700); between the two they run downhill through the carriers
// and pump H⁺ for ATP. Switch to cyclic flow to see PS I alone: only ATP, no NADPH, no O₂. Slide the light to change the pace.
import { canvas, loop, row, slider, choice, readout, text, title } from '../kit.js';

export default function (host) {
  let mode = 'noncyc', light = 0.6, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 390, min: 310, label: 'The Z-scheme of the light reactions with electrons moving between photosystems' });
  const ctl = row(host);
  loop(host, (dt) => { t += dt * (0.1 + light); cv.redraw(); }).button(ctl);
  choice(ctl, 'Flow', [['noncyc', 'Non-cyclic (PS II + PS I)'], ['cyc', 'Cyclic (PS I only)']], mode, (v) => { mode = v; show(); });
  slider(ctl, { label: 'Light', min: 0, max: 1, step: 0.05, value: light, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { light = v; show(); } });
  const out = readout(host);
  const show = () => { out.innerHTML = mode === 'noncyc' ? '<b>Non-cyclic:</b> water is split at PS II (2H₂O → O₂ + 4H⁺ + 4e⁻), electrons travel PS II → plastoquinone → cytochrome b₆f → plastocyanin → PS I → ferredoxin → NADP⁺ reductase. Products: <b>ATP, NADPH and O₂</b>.' : '<b>Cyclic:</b> excited PS I electrons return from ferredoxin to the cytochrome b₆f complex and back to P700. Products: <b>ATP only</b>; no NADPH, no O₂. It tops up ATP for the Calvin cycle.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Energy of the electron (higher = more energy)', col);
    const Y = (e) => 30 + (1 - (e + 1.4) / 2.5) * (h - 90); // volts: +1.1 low energy at bottom, -1.4 high at top
    const X = (f) => 16 + f * (w - 32);
    const N = [['H₂O', 0.04, 0.82, 0], ['P680', 0.18, 0.95, 0], ['P680*', 0.18, -0.8, 1], ['PQ', 0.32, -0.1, 0], ['b₆f', 0.42, 0.1, 0], ['PC', 0.52, 0.35, 0], ['P700', 0.62, 0.45, 0], ['P700*', 0.62, -1.15, 1], ['Fd', 0.76, -0.45, 0], ['NADP⁺', 0.92, -0.32, 0]];
    const cyc = mode === 'cyc';
    const path = cyc ? [7, 8, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pts = path.map((i) => [X(N[i][1]), Y(N[i][2])]);
    // light arrows
    ctx.strokeStyle = col.warn; ctx.lineWidth = 3;
    const light2 = (i, on) => { if (!on) return; const [x, y0, y1] = [X(N[i][1]) - 14, Y(N[i - 1 < 0 ? i : i][2]), Y(N[i + 1][2])]; for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.moveTo(x - 6 + j * 8, y0 + 16); ctx.lineTo(x - 6 + j * 8, y1 + 4); ctx.stroke(); } };
    if (!cyc) light2(1, true); light2(6, true);
    if (!cyc) text(ctx, 'light', X(0.18) - 30, (Y(0.95) + Y(-0.8)) / 2, { color: col.warn, size: 10, weight: 700, fit: false });
    // Z line
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (cyc) ctx.lineTo(pts[0][0], pts[0][1]); ctx.stroke();
    path.forEach((i) => { const [x, y] = [X(N[i][1]), Y(N[i][2])]; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fillStyle = N[i][3] ? col.s[1] : col.s[0]; ctx.fill(); text(ctx, N[i][0], x, y + (N[i][3] ? -12 : 14), { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); });
    // electrons moving along the path (excitation steps jump instantly)
    const total = pts.length - (cyc ? 0 : 1), nE = 5;
    for (let e = 0; e < nE; e++) { const f = ((t * 0.3 + e / nE) % 1) * (pts.length - 1 + (cyc ? 1 : 0)), i = Math.floor(f), r = f - i, a = pts[i % pts.length], b = pts[(i + 1) % pts.length]; ctx.beginPath(); ctx.arc(a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r, 4.5, 0, 7); ctx.fillStyle = col.bad; ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '700 8px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('e', a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r + 0.5); }
    // outputs
    const pumpY = Y(0.1) + 30; text(ctx, 'H⁺ pumped into lumen → ATP', X(0.42), pumpY + 20, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
    if (!cyc) { text(ctx, 'O₂ released', X(0.04), Y(0.82) + 30, { color: col.s[2], size: 10.5, weight: 700, fit: true }); text(ctx, 'NADPH made', X(0.92), Y(-0.32) + 22, { color: col.s[2], size: 10.5, weight: 700, align: 'right', fit: true }); }
    text(ctx, 'PS II', X(0.18), h - 28, { color: col.muted, size: 11, weight: 700, align: 'center' }); text(ctx, 'PS I', X(0.62), h - 28, { color: col.muted, size: 11, weight: 700, align: 'center' });
    text(ctx, 'orange: excited electron, blue: ground level; red dots: electrons', w / 2, h - 10, { color: col.muted, size: 9.5, align: 'center' });
  };
  show();
}
