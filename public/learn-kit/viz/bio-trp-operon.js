// The trp operon: a repressible operon. Switch tryptophan low or high. With little tryptophan the repressor protein
// cannot grip the operator, so RNA polymerase transcribes trpE to trpA and the cell makes the enzymes. With plenty,
// tryptophan (the corepressor) turns the repressor on and the genes switch off. The lac operon is the reverse (inducible).
import { canvas, loop, row, choice, readout, text, title } from '../kit.js';

export default function (host) {
  let trp = 'low', pol = 0;
  const cv = canvas(host, { aspect: 0.78, max: 380, min: 290, label: 'The trp operon switched on or off by tryptophan' });
  const ctl = row(host);
  choice(ctl, 'Tryptophan', [['low', 'Low (cell needs it)'], ['high', 'High (plenty)']], trp, (v) => { trp = v; show(); });
  const anim = loop(host, (dt) => { pol = (pol + dt * 0.45) % 1; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const show = () => { out.innerHTML = trp === 'low' ? '<b>Operon ON.</b> Repressor is inactive (no tryptophan on it), so RNA polymerase passes the operator and one long mRNA codes the five enzymes that make tryptophan.' : '<b>Operon OFF.</b> Tryptophan binds the repressor (so it is the corepressor), the active repressor sits on the operator and blocks RNA polymerase. Tryptophan is not made when it is already there.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const on = trp === 'low', y = h * 0.5, x0 = 12, W = w - 24;
    title(ctx, on ? 'Low tryptophan: genes ON' : 'High tryptophan: genes OFF', col);
    const parts = [['trpR', 0.14, col.muted], ['P', 0.07, col.s[2]], ['O', 0.07, col.s[3]], ['trpE', 0.14, col.s[0]], ['trpD', 0.14, col.s[0]], ['trpC', 0.14, col.s[0]], ['trpB', 0.14, col.s[0]], ['trpA', 0.14, col.s[0]]];
    let x = x0; const pos = {};
    parts.forEach(([n, f, c]) => {
      const pw = f * W * 0.98; pos[n] = x;
      ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x, y - 11, pw - 2, 22); ctx.globalAlpha = 1;
      text(ctx, n, x + pw / 2 - 1, y, { color: '#fff', size: w < 380 ? 9.5 : 11, weight: 700, align: 'center', fit: false });
      x += pw;
    });
    text(ctx, 'promoter P, operator O', x0 + W * 0.17, y + 26, { color: col.muted, size: 10.5 });
    // repressor made by trpR (always on)
    const rx = x0 + W * 0.05, ry = y - 70, ox = pos.O + 24;
    ctx.fillStyle = on ? col.line : col.s[3]; ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(on ? rx : ox, on ? ry : y - 30, 15, 0, 7); ctx.fill(); ctx.stroke();
    const rcx = on ? rx : ox, rcy = on ? ry : y - 30;
    text(ctx, on ? 'inactive repressor' : 'active repressor', on ? rcx + 20 : rcx - 70, on ? rcy : rcy - 22, { color: col.ink, size: 10.5, weight: 600 });
    if (!on) { ctx.fillStyle = col.warn; for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(rcx - 8 + i * 16, rcy + 4, 4, 0, 7); ctx.fill(); } }
    // tryptophan molecules drifting
    const n = on ? 2 : 9;
    for (let i = 0; i < n; i++) { const tx = x0 + ((i * 53 + pol * 80) % W), ty = h * 0.86 - ((i * 37) % 30); ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(tx, ty, 4.5, 0, 7); ctx.fill(); }
    text(ctx, 'tryptophan', x0 + 4, h - 8, { color: col.warn, size: 10.5, weight: 600 });
    // polymerase and mRNA
    const px = on ? pos.P + pol * (W * 0.78 - 0) : pos.P - 14;
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(on ? Math.min(px, x0 + W - 14) : pos.P + 6, y - 22, 16, 11, 0, 0, 7); ctx.fill();
    text(ctx, 'RNA pol', on ? Math.min(px, x0 + W - 14) : pos.P + 6, y - 22, { color: '#fff', size: 9, weight: 700, align: 'center', fit: false });
    if (on) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(pos.trpE, y - 36 - 6); ctx.lineTo(Math.min(px, x0 + W - 14), y - 38); ctx.stroke(); text(ctx, 'mRNA → enzymes make tryptophan', x0 + W * 0.3, y - 50, { color: col.s[1], size: 11, weight: 600 }); }
    else text(ctx, 'blocked', pos.P - 4, y - 48, { color: col.bad, size: 11, weight: 700 });
  };
  show();
}
