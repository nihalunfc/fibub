// Class 12 Molecular Basis of Inheritance: complementary base pairing. Build the partner strand by pressing A, T, G or C (U in RNA mode).
// A pairs with T (U) through 2 hydrogen bonds, G pairs with C through 3. More G-C pairs mean more hydrogen bonds, so the strands are harder to pull apart.
import { canvas, text, title, line, row, button, choice, readout, rng } from '../../kit.js';

export default function (host) {
  let seed = 3, top, bot, rna = false;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A DNA strand with a partner strand that you build by pressing the bases, showing hydrogen bonds' });
  const ctl = row(host), ctl2 = row(host), ro = readout(host);
  const mk = () => { const r = rng(seed); top = Array.from({ length: 8 }, () => 'ATGC'[Math.floor(r() * 4)]); bot = []; go(); };
  const pair = (b) => ({ A: rna ? 'U' : 'T', T: 'A', G: 'C', C: 'G' }[b]);
  const grp = document.createElement('div'); grp.className = 'lk-choice'; const gl = document.createElement('span'); gl.textContent = 'Add a base'; grp.appendChild(gl); ctl.appendChild(grp);
  const btns = ['A', 'T', 'G', 'C'].map((b) => { const e = document.createElement('button'); e.type = 'button'; e.textContent = b; e.setAttribute('aria-pressed', 'false'); e.addEventListener('click', () => add(b)); grp.appendChild(e); return e; });
  choice(ctl2, 'Partner is', [['dna', 'DNA'], ['rna', 'RNA']], 'dna', (v) => { rna = v === 'rna'; btns[1].textContent = rna ? 'U' : 'T'; bot = bot.map((b) => b); go(); });
  button(ctl2, 'Undo', () => { bot.pop(); go(); });
  button(ctl2, 'New strand', () => { seed += 5; mk(); });
  const add = (b) => { if (bot.length < top.length) { bot.push(b); go(); } };
  const ok = (i) => (bot[i] === pair(top[i]) || (rna && bot[i] === 'T' && pair(top[i]) === 'U'));
  const go = () => {
    let bonds = 0, good = 0; bot.forEach((b, i) => { if (ok(i)) { good++; bonds += top[i] === 'G' || top[i] === 'C' ? 3 : 2; } });
    const gc = top.filter((b) => b === 'G' || b === 'C').length;
    ro.textContent = `Placed ${bot.length} of ${top.length}; correct ${good}. Hydrogen bonds so far: ${bonds}. This strand is ${Math.round(100 * gc / top.length)} % G+C: the more G-C pairs, the higher the melting temperature. Rule: A with ${rna ? 'U' : 'T'} (2 bonds), G with C (3 bonds).`;
    cv.redraw();
  };
  const colr = (col, b) => ({ A: col.s[0], T: col.s[3], U: col.s[3], G: col.s[2], C: col.s[1] }[b]);
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Build the partner strand', col), n = top.length, gap = (w - 60) / n, x0 = 40, yT = t0 + 50, yB = yT + 110;
    text(ctx, "5'", 14, yT, { color: col.muted, size: 11, weight: 700 }); text(ctx, "3'", 14, yB, { color: col.muted, size: 11, weight: 700 });
    text(ctx, "3'", w - 14, yT, { color: col.muted, size: 11, weight: 700, align: 'right' }); text(ctx, "5'", w - 14, yB, { color: col.muted, size: 11, weight: 700, align: 'right' });
    top.forEach((b, i) => {
      const x = x0 + gap * i + gap / 2, nb = top[i] === 'G' || top[i] === 'C' ? 3 : 2;
      ctx.fillStyle = colr(col, b); ctx.fillRect(x - gap * 0.4, yT - 15, gap * 0.8, 30);
      text(ctx, b, x, yT, { color: col.bg, size: 15, weight: 700, align: 'center' });
      if (i < bot.length) {
        const g = ok(i), bb = bot[i] === 'T' && rna ? 'U' : bot[i];
        ctx.fillStyle = g ? colr(col, bb) : col.line; ctx.fillRect(x - gap * 0.4, yB - 15, gap * 0.8, 30);
        text(ctx, bb, x, yB, { color: g ? col.bg : col.bad, size: 15, weight: 700, align: 'center' });
        if (g) for (let k = 0; k < nb; k++) { const yy = yT + 22 + (k + 0.5) * (yB - yT - 44) / nb; line(ctx, [[x - 6, yy], [x + 6, yy]], col.ink, 2.5, [2, 2]); }
        else text(ctx, '×', x, (yT + yB) / 2, { color: col.bad, size: 20, weight: 700, align: 'center' });
      } else { ctx.strokeStyle = col.line; ctx.setLineDash([3, 3]); ctx.strokeRect(x - gap * 0.4, yB - 15, gap * 0.8, 30); ctx.setLineDash([]); }
    });
    text(ctx, 'Dashes between the bases are hydrogen bonds: 2 for A-T, 3 for G-C.', w / 2, yB + 40, { color: col.muted, size: 11, align: 'center' });
  };
  mk();
}
