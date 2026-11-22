// Molecular basis of inheritance: the lac operon of E. coli (Jacob and Monod). Switch lactose off or on: without
// it the repressor (made by the i gene) sits on the operator and RNA polymerase is blocked; with it, allolactose
// (the inducer) binds the repressor, which lets go, and z, y and a are transcribed as one mRNA.
import { canvas, text, row, choice, readout, arrow } from '../../kit.js';

export default function (host) {
  let lac = false;
  const cv = canvas(host, { aspect: 0.46, max: 280, min: 220, label: 'The lac operon with lactose absent or present' });
  const ctl = row(host);
  choice(ctl, 'Lactose', [[false, 'Absent'], [true, 'Present']], lac, (v) => { lac = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    out.innerHTML = lac
      ? '<b>Lactose present: operon ON.</b> The inducer binds the repressor and changes its shape, so it cannot hold the operator. RNA polymerase moves from the promoter through z, y and a, making one polycistronic mRNA for β-galactosidase, permease and transacetylase. This is negative regulation.'
      : '<b>Lactose absent: operon OFF.</b> The i gene is always active and makes the repressor, which binds the operator and blocks RNA polymerase. The cell saves energy by not making enzymes it does not need.';
  };
  cv.draw = (ctx, w, h, col) => {
    const genes = [['i', 0.9, col.s[3]], ['p', 0.6, col.muted], ['o', 0.6, col.s[1]], ['z', 1.4, col.s[0]], ['y', 1.2, col.s[0]], ['a', 1.1, col.s[0]]];
    const tot = genes.reduce((s, g) => s + g[1], 0) + 0.6, unit = (w - 20) / tot, y = h * 0.5, bh = 30;
    text(ctx, lac ? 'Lactose present: ON' : 'Lactose absent: OFF', 10, 16, { color: col.ink, size: 12.5, weight: 700 });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(w - 10, y); ctx.stroke();
    let x = 10; const pos = {};
    genes.forEach(([g, wd, c], i) => {
      if (i === 1) x += unit * 0.6;
      const bw = wd * unit; pos[g] = [x, bw];
      ctx.fillStyle = col.soft; ctx.strokeStyle = c; ctx.lineWidth = 2;
      ctx.fillRect(x, y - bh / 2, bw, bh); ctx.strokeRect(x, y - bh / 2, bw, bh);
      text(ctx, g, x + bw / 2, y, { color: col.ink, size: 14, weight: 700, align: 'center' });
      x += bw;
    });
    const [ix, iw] = pos.i, [ox, ow] = pos.o, [px, pw] = pos.p, [zx] = pos.z, [ax, aw] = pos.a;
    text(ctx, 'regulator', ix + iw / 2, y + bh / 2 + 12, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'structural genes', (zx + ax + aw) / 2, y + bh / 2 + 12, { color: col.muted, size: 10, align: 'center' });
    // repressor
    const rx = lac ? ix + iw / 2 + 10 : ox + ow / 2, ry = lac ? y - bh / 2 - 34 : y - bh / 2 - 12;
    arrow(ctx, ix + iw / 2, y - bh / 2, lac ? rx - 4 : rx - 18, ry + 6, col.s[3], 1.5, 6);
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(rx, ry, 16, 10, 0, 0, 7); ctx.fill();
    text(ctx, 'repressor', rx, ry - 18, { color: col.s[3], size: 10, align: 'center', weight: 600 });
    if (lac) { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(rx + 16, ry + 6, 6, 0, 7); ctx.fill(); text(ctx, 'inducer', rx + 26, ry + 14, { color: col.s[2], size: 10 }); }
    // RNA polymerase
    const polX = lac ? zx + 20 : px + pw / 2;
    ctx.fillStyle = col.muted; ctx.beginPath(); ctx.ellipse(polX, y + bh / 2 + 32, 20, 11, 0, 0, 7); ctx.fill();
    text(ctx, 'RNA pol', polX, y + bh / 2 + 32, { color: col.panel, size: 9, align: 'center', weight: 700 });
    if (lac) {
      const my = y + bh / 2 + 56;
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath();
      for (let t = zx; t <= ax + aw; t += 4) { const yy = my + Math.sin(t / 6) * 3; t === zx ? ctx.moveTo(t, yy) : ctx.lineTo(t, yy); }
      ctx.stroke();
      text(ctx, 'one mRNA for z, y, a', (zx + ax + aw) / 2, my + 14, { color: col.s[0], size: 10, align: 'center' });
    } else text(ctx, '✕ blocked', px + pw / 2 + 40, y + bh / 2 + 32, { color: col.bad || col.s[1], size: 11, weight: 700 });
  };
  cv.redraw(); show();
}
