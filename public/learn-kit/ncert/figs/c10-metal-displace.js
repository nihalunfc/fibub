// Class 10 Metals and Non-metals: displacement races. A metal strip goes into a salt solution of another metal. If the
// strip is more reactive (higher in the reactivity series: Mg > Al > Zn > Fe > Cu > Ag) it pushes the other metal out of
// solution and that metal coats the strip; otherwise nothing happens. Solution colour fades as its metal ions leave.
import { canvas, text, title, line, row, choice, readout, loop, clamp, lerp } from '../../kit.js';

const ORDER = ['Mg', 'Al', 'Zn', 'Fe', 'Cu', 'Ag'];
const STRIP = { Mg: '#c9ccd0', Al: '#bcc3ca', Zn: '#9aa0a8', Fe: '#707377', Cu: '#c8773a', Ag: '#dfe2e6' };
const SOL = { Zn: ['ZnSO₄', [235, 240, 245], 'colourless'], Fe: ['FeSO₄', [190, 220, 170], 'pale green'], Cu: ['CuSO₄', [90, 150, 225], 'blue'], Ag: ['AgNO₃', [235, 240, 245], 'colourless'] };
const DEP = { Zn: '#9aa0a8', Fe: '#55575a', Cu: '#b8642a', Ag: '#eef0f2' };
const sym = (m) => ({ Zn: 'Zn²⁺', Fe: 'Fe²⁺', Cu: 'Cu²⁺', Ag: 'Ag⁺' })[m];
export default function (host) {
  let s = 'Zn', sol = 'Cu', t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A metal strip in a metal salt solution, with the reactivity ladder beside it' });
  const ctl = row(host);
  choice(ctl, 'Strip', ['Mg', 'Al', 'Zn', 'Fe', 'Cu'].map((m) => [m, m]), s, (v) => { s = v; t = 0; say(); });
  choice(ctl, 'Solution', ['Zn', 'Fe', 'Cu', 'Ag'].map((m) => [m, SOL[m][0]]), sol, (v) => { sol = v; t = 0; say(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  const reacts = () => ORDER.indexOf(s) < ORDER.indexOf(sol);
  function say() {
    out.innerHTML = s === sol ? `${s} in its own salt: nothing to displace.` : reacts() ? `<b>${s} is above ${sol} in the series, so it displaces ${sol}</b> from ${SOL[sol][0]}: ${s} + ${SOL[sol][0]} → ${s} salt + ${sol}. A coat of ${sol} forms on the strip and the solution colour changes.`
      : `<b>${s} is below ${sol}: no reaction.</b> A less reactive metal cannot push a more reactive one out of its compound.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${s} strip in ${SOL[sol][0]} solution`, col) + 8;
    const f = reacts() && s !== sol ? clamp((t % 8) / 6, 0, 1) : 0;
    // ladder
    const lx = 14, ly = top + 20, lh = h - ly - 20;
    ORDER.forEach((m, i) => { const y = ly + i * (lh / 6.3), on = m === s || m === sol; ctx.fillStyle = on ? col.s[m === s ? 1 : 0] : col.soft; ctx.fillRect(lx, y, 34, 22); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(lx, y, 34, 22); text(ctx, m, lx + 17, y + 11, { color: on ? '#fff' : col.ink, size: 12, weight: 700, align: 'center' }); });
    text(ctx, 'most', lx + 17, ly - 6, { color: col.muted, size: 9, align: 'center' }); text(ctx, 'least', lx + 17, ly + lh - 2, { color: col.muted, size: 9, align: 'center' });
    // beaker
    const bx = 70, bw = w * 0.5, by = top + 30, bh = h - by - 30, c0 = SOL[sol][1], fade = [235, 240, 245];
    const cc = c0.map((v, i) => Math.round(lerp(v, sol === 'Cu' ? [195, 225, 195][i] : fade[i], f * 0.85)));
    ctx.fillStyle = `rgba(${cc[0]},${cc[1]},${cc[2]},0.8)`; ctx.fillRect(bx, by + bh * 0.25, bw, bh * 0.75);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    const sx = bx + bw / 2 - 7, sy = by - 8, sh = bh * 0.8;
    ctx.fillStyle = STRIP[s]; ctx.fillRect(sx, sy, 14, sh);
    if (f > 0) { ctx.fillStyle = DEP[sol]; ctx.globalAlpha = Math.min(1, f * 1.2); const th = 1 + 6 * f; ctx.fillRect(sx - th, sy + bh * 0.3, 14 + 2 * th, sh - bh * 0.3); ctx.globalAlpha = 1; for (let i = 0; i < 6 * f; i++) { ctx.fillRect(sx - th - 2, sy + bh * 0.35 + i * 14, 3, 3); ctx.fillRect(sx + 14 + th, sy + bh * 0.4 + i * 14, 3, 3); } }
    text(ctx, `${s} strip`, bx + bw / 2, by + bh + 13, { color: col.muted, size: 10.5, align: 'center' });
    // right panel
    const rx = bx + bw + 14;
    text(ctx, 'solution:', rx, by + 6, { color: col.muted, size: 10.5 }); text(ctx, SOL[sol][2], rx, by + 20, { color: col.ink, size: 11, weight: 700 });
    text(ctx, f > 0.3 ? 'now:' : '', rx, by + 40, { color: col.muted, size: 10.5 });
    if (reacts() && s !== sol) { text(ctx, f > 0.6 ? (sol === 'Cu' ? 'pale/colourless' : 'colourless') : 'fading', rx, by + 54, { color: col.ink, size: 11, weight: 700 }); text(ctx, `${sol} deposit on strip`, rx, by + 80, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, `${sym(sol)} → ${sol}`, rx, by + 96, { color: col.ink, size: 11 }); text(ctx, `${s} dissolves as ions`, rx, by + 112, { color: col.ink, size: 10 }); }
    else text(ctx, 'no change', rx, by + 54, { color: col.bad, size: 12, weight: 700 });
  };
  say();
}
