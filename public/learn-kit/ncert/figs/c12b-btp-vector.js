// Class 12 Biology, Biotechnology: Principles and Processes: insertional inactivation with a pBR322-like plasmid.
// The vector carries ori (replication), ampR (ampicillin resistance, with a PstI site inside) and tetR (tetracycline resistance, with a BamHI site inside).
// A gene cloned into a site inside a resistance gene breaks that gene. Cells with the recombinant plasmid still grow on ampicillin but not on tetracycline
// (if the insert is in tetR), so replica plates tell recombinants from non-recombinants.
import { canvas, text, title, line, dot, row, choice, readout, rng } from '../../kit.js';

export default function (host) {
  let ins = 'bam', cells = 'plasmid';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A plasmid map with ori, ampicillin and tetracycline resistance genes, and two agar plates showing which colonies grow' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Gene cloned into', [['none', 'No insert'], ['bam', 'BamHI (in tetR)'], ['pst', 'PstI (in ampR)']], 'bam', (v) => { ins = v; go(); });
  choice(ctl, 'Bacteria took up', [['plasmid', 'a plasmid'], ['none', 'no plasmid']], 'plasmid', (v) => { cells = v; go(); });
  const growth = () => { if (cells === 'none') return { amp: false, tet: false, msg: 'Bacteria with no plasmid have no resistance gene: nothing grows on either antibiotic. This is how you find that transformation failed.' }; const amp = ins !== 'pst', tet = ins !== 'bam'; return { amp, tet, msg: ins === 'none' ? 'Empty vector: both resistance genes work, so the colonies grow on both plates.' : ins === 'bam' ? 'The gene broke tetR (insertional inactivation). Growth on ampicillin, none on tetracycline: these are the recombinants.' : 'The gene broke ampR. Growth on tetracycline, none on ampicillin: also recombinants.' }; };
  const go = () => { ro.textContent = growth().msg; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Which colonies survive?', col);
    const R = Math.min(w * 0.22, 74), cx = w * 0.27, cy = h * 0.46;
    ctx.lineWidth = 7; ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    const arc = (a0, a1, c, label, bad) => { ctx.lineWidth = 9; ctx.strokeStyle = bad ? col.bad : c; ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.stroke(); const m = (a0 + a1) / 2; text(ctx, label, cx + Math.cos(m) * (R + 14), cy + Math.sin(m) * (R + 14), { color: bad ? col.bad : c, size: 10.5, weight: 700, align: Math.cos(m) > 0.3 ? 'left' : Math.cos(m) < -0.3 ? 'right' : 'center' }); };
    arc(-2.4, -0.7, col.s[3], 'tetR', ins === 'bam'); arc(0.3, 1.9, col.s[0], 'ampR', ins === 'pst'); arc(2.3, 2.9, col.s[4], 'ori', false);
    const mark = (a, lab, on) => { const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R; line(ctx, [[x - Math.cos(a) * 9, y - Math.sin(a) * 9], [x + Math.cos(a) * 9, y + Math.sin(a) * 9]], col.ink, 2); if (on) dot(ctx, cx + Math.cos(a) * (R - 16), cy + Math.sin(a) * (R - 16), 7, col.s[2], col.ink); text(ctx, lab, cx + Math.cos(a) * (R - (on ? 30 : 22)), cy + Math.sin(a) * (R - (on ? 30 : 22)), { color: col.ink, size: 9.5, align: 'center' }); };
    mark(-1.55, 'BamHI', ins === 'bam'); mark(1.1, 'PstI', ins === 'pst');
    text(ctx, ins === 'none' ? 'empty vector' : 'gene (insert)', cx, cy + (ins === 'none' ? 0 : 0), { color: ins === 'none' ? col.muted : col.s[2], size: 10.5, weight: 700, align: 'center' });
    const g = growth(), r = rng(7), pw = Math.min(w * 0.3, 112), px = w - pw / 2 - 16;
    [['+ ampicillin', g.amp, h * 0.34], ['+ tetracycline', g.tet, h * 0.74]].forEach(([nm, on, py]) => {
      ctx.fillStyle = col.soft; ctx.beginPath(); ctx.arc(px, py, pw * 0.42, 0, 7); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
      if (on) for (let k = 0; k < 13; k++) { const a = r() * 6.28, d = Math.sqrt(r()) * pw * 0.32; dot(ctx, px + Math.cos(a) * d, py + Math.sin(a) * d, 3.2, col.s[1]); } else for (let k = 0; k < 13; k++) r(), r();
      text(ctx, nm, px, py + pw * 0.42 + 13, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      text(ctx, on ? 'colonies grow' : 'no growth', px, py, { color: on ? col.good : col.bad, size: 10, weight: 700, align: 'center', halo: col.soft });
    });
    text(ctx, 'ori = where copying of the plasmid starts', 10, h - 8, { color: col.muted, size: 10 });
  };
  go();
}
