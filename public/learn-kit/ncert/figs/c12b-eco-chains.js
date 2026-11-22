// Class 12 Biology, Ecosystem: grazing food chain (GFC) and detritus food chain (DFC). The GFC starts with living green plants; the DFC starts with dead organic matter eaten by
// detritivores and decomposers. In water the GFC carries most of the energy; on land most energy flows through the DFC (the shares shown are illustrative).
import { canvas, text, title, arrow, row, choice, readout } from '../../kit.js';

export default function (host) {
  let habitat = 'land';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A grazing food chain and a detritus food chain, with the share of energy through each in a pond or on land' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Ecosystem', [['land', 'Forest floor (land)'], ['pond', 'Open water (pond)']], 'land', (v) => { habitat = v; go(); });
  const share = () => (habitat === 'land' ? 85 : 15);
  const go = () => { ro.textContent = habitat === 'land' ? 'On land most plant matter is not eaten alive: it falls as litter, so most energy flows through the DETRITUS chain (about 85 % in this illustration).' : 'In open water most producers (phytoplankton) are eaten alive by zooplankton, so the GRAZING chain is the main route of energy (about 85 % in this illustration).'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Two kinds of food chain', col) + 8, rowH = 58, bw = Math.min(78, (w - 30) / 4.2);
    const chain = (y, label, items, c) => { text(ctx, label, 12, y, { color: c, size: 11.5, weight: 800 }); items.forEach((n, i) => { const x = 12 + i * (bw + 10), yy = y + 12; ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.fillRect(x, yy, bw, 28); ctx.strokeRect(x, yy, bw, 28); text(ctx, n, x + bw / 2, yy + 14, { color: col.ink, size: 10, weight: 700, align: 'center' }); if (i < items.length - 1) arrow(ctx, x + bw + 1, yy + 14, x + bw + 9, yy + 14, c, 1.8, 6); }); };
    chain(top + 6, 'Grazing food chain (GFC)', habitat === 'land' ? ['Grass', 'Deer', 'Tiger', ''] .slice(0, 3) : ['Phytoplankton', 'Zooplankton', 'Small fish', 'Large fish'], col.s[0]);
    chain(top + 6 + rowH + 14, 'Detritus food chain (DFC)', habitat === 'land' ? ['Dead leaves', 'Earthworm', 'Frog', 'Snake'] : ['Dead algae', 'Bacteria', 'Protozoa', 'Small fish'], col.s[2]);
    const by = top + 2 * rowH + 56, s = share();
    text(ctx, 'share of energy flowing through each chain (illustrative)', 12, by, { color: col.muted, size: 10.5, weight: 700 });
    const bwid = w - 24; ctx.fillStyle = col.s[0]; ctx.fillRect(12, by + 10, bwid * (100 - s) / 100, 26); ctx.fillStyle = col.s[2]; ctx.fillRect(12 + bwid * (100 - s) / 100, by + 10, bwid * s / 100, 26);
    text(ctx, `GFC ${100 - s} %`, 18, by + 23, { color: col.panel, size: 11, weight: 800 }); text(ctx, `DFC ${s} %`, w - 18, by + 23, { color: col.panel, size: 11, weight: 800, align: 'right' });
    void s;
  };
  go();
}
