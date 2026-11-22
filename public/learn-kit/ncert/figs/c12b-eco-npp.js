// Class 12 Biology, Ecosystem: primary productivity. Gross primary productivity (GPP) is the rate at which producers make organic matter in photosynthesis.
// Some is used in the plants' own respiration (R). Net primary productivity NPP = GPP - R is what is left for consumers and decomposers.
// Secondary productivity is the rate at which consumers make new organic matter. Presets are round illustrative values (kcal per square metre per year).
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let G = 3000, R = 1200;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Bars of gross primary productivity, respiration and net primary productivity' });
  const ctl = row(host), ro = readout(host);
  const gs = slider(ctl, { label: 'GPP', min: 200, max: 6000, step: 100, value: 3000, fmt: (v) => v.toFixed(0), oninput: (v) => { G = v; go(); } });
  const rs = slider(ctl, { label: 'plant respiration R', min: 100, max: 4000, step: 100, value: 1200, fmt: (v) => v.toFixed(0), oninput: (v) => { R = v; go(); } });
  choice(ctl, 'Preset', [['forest', 'Rain forest'], ['grass', 'Grassland'], ['desert', 'Desert'], ['sea', 'Open ocean']], 'forest', (v) => { const p = { forest: [5800, 3200], grass: [2200, 900], desert: [400, 150], sea: [800, 300] }[v]; G = p[0]; R = p[1]; gs.set(G); rs.set(R); go(); });
  const go = () => { const N = G - R; ro.textContent = N <= 0 ? `GPP ${G} − R ${R} = ${N}: the producers use up all they make, so nothing is left for consumers.` : `NPP = GPP − R = ${G} − ${R} = ${N} kcal/m²/yr (${(N / G * 100).toFixed(0)} % of GPP). Consumers can get at most this much, and each step passes on roughly 10 % of what it receives.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'GPP, respiration and NPP', col) + 14, base = h - 44, mx = 6100, Y = (v) => base - (Math.max(0, v) / mx) * (base - top - 14), bw = (w - 60) / 3;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(14, base); ctx.lineTo(w - 14, base); ctx.stroke();
    const N = G - R;
    [['GPP', 0, G, col.s[0]], ['− R', Math.max(0, N), R, col.bad], ['= NPP', 0, Math.max(0, N), col.good]].forEach(([n, b, v, c], i) => { const x = 22 + i * (bw + 8); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x, Y(b + v), bw, Math.max(1, Y(b) - Y(b + v))); ctx.globalAlpha = 1; text(ctx, n, x + bw / 2, base + 16, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, String(i === 2 ? Math.max(0, N) : v), x + bw / 2, Y(b + v) - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    text(ctx, 'secondary productivity = new matter made by consumers', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
