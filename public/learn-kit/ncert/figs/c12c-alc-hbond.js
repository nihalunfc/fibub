// Class 12 Chemistry, Alcohols, Phenols and Ethers: why alcohols boil so much higher than alkanes and ethers of similar size.
// An alcohol has an O-H bond, so its molecules hold each other with hydrogen bonds; an ether (no O-H) and an alkane (no polar bond) only have weaker forces.
// Boiling points in deg C at 1 atm (CRC Handbook): alkanes CH4 to C5H12, straight-chain alcohols C1 to C5, ethers with the same total number of carbons (C2 to C5).
import { canvas, text, title, row, slider, readout, loop } from '../../kit.js';

const AL = [-162, -89, -42, -0.5, 36], OH = [65, 78, 97, 117, 138], ET = [null, -24, 7, 35, 64];
const NAMES = ['methane / methanol', 'ethane / ethanol / methoxymethane', 'propane / propan-1-ol / methoxyethane', 'butane / butan-1-ol / ethoxyethane', 'pentane / pentan-1-ol / ethoxypropane'];
export default function (host) {
  let n = 3, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'Boiling points of alkanes, ethers and alcohols with 1 to 5 carbons, with hydrogen bonds drawn between alcohol molecules' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'carbon atoms', min: 1, max: 5, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; go(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const go = () => { const e = ET[n - 1]; ro.textContent = `${n} carbon${n > 1 ? 's' : ''}: alkane ${AL[n - 1]} °C, ${e === null ? 'no ether' : 'ether ' + e + ' °C'}, alcohol ${OH[n - 1]} °C. The alcohol boils ${OH[n - 1] - (e ?? AL[n - 1])} °C above ${e === null ? 'the alkane' : 'the ether'} of the same size: that gap is the hydrogen bond.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Boiling point (°C) by number of carbons', col), L = 40, R = w - 10, B = h * 0.58, T = top + 8, lo = -180, hi = 160, Y = (v) => B - (v - lo) / (hi - lo) * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (const v of [-150, -100, -50, 0, 50, 100, 150]) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke(); text(ctx, String(v), L - 4, Y(v), { color: col.muted, size: 9.5, align: 'right' }); }
    const gw = (R - L) / 5, bw = gw / 4;
    for (let i = 0; i < 5; i++) {
      const x = L + gw * i + gw / 2, sel = i + 1 === n;
      if (sel) { ctx.fillStyle = col.soft; ctx.fillRect(L + gw * i + 2, T - 2, gw - 4, B - T + 22); }
      [[AL[i], col.s[2]], [ET[i], col.s[0]], [OH[i], col.s[3]]].forEach(([v, c], j) => { if (v === null) return; const xx = x + (j - 1) * (bw + 2) - bw / 2; ctx.fillStyle = c; ctx.fillRect(xx, Math.min(Y(0), Y(v)), bw, Math.abs(Y(v) - Y(0))); });
      text(ctx, String(i + 1), x, B + 11, { color: sel ? col.ink : col.muted, size: 11, weight: sel ? 700 : 400, align: 'center' });
    }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(R, Y(0)); ctx.stroke();
    [['alkane', col.s[2]], ['ether', col.s[0]], ['alcohol', col.s[3]]].forEach(([s, c], j) => { ctx.fillStyle = c; ctx.fillRect(L + 8 + j * 64, B + 24, 9, 9); text(ctx, s, L + 21 + j * 64, B + 29, { color: col.ink, size: 10.5 }); });
    // hydrogen-bond picture
    const py = B + 62, ph = h - py - 8;
    text(ctx, 'alcohol molecules: O–H ··· O hydrogen bonds', w / 2, py - 8, { color: col.muted, size: 10.5, align: 'center' });
    const m = 4, sp = (w - 40) / m; ctx.lineWidth = 2;
    for (let i = 0; i < m; i++) {
      const x = 28 + sp * i + sp / 2 - 10, y = py + ph / 2 + 4 * Math.sin(t * 2 + i);
      ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fill(); text(ctx, 'O', x, y, { color: col.panel, size: 9, weight: 700, align: 'center' });
      ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 22, y - 6); ctx.stroke(); text(ctx, 'R', x - 27, y - 8, { color: col.muted, size: 10, align: 'center' });
      ctx.beginPath(); ctx.moveTo(x + 7, y + 3); ctx.lineTo(x + 17, y + 9); ctx.stroke(); ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(x + 19, y + 10, 3, 0, 7); ctx.fill();
      if (i < m - 1) { ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.8 + Math.sin(t * 4 + i); ctx.beginPath(); ctx.moveTo(x + 19, y + 10); ctx.lineTo(x + sp - 8, y + 4 * Math.sin(t * 2 + i + 1)); ctx.stroke(); ctx.restore(); }
    }
  };
  go();
}
