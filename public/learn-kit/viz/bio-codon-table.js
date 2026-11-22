// The genetic code as a clickable table. Choose the three letters of a codon to see its amino acid, then change one
// letter to see whether the change is silent (same amino acid), missense (different one) or nonsense (stop).
import { canvas, row, choice, readout, text, title } from '../kit.js';
import { CODON, BASES } from './_bio-kit.js';

export default function (host) {
  const cod = ['G', 'A', 'A'];
  let mpos = -1, mto = 'G';
  const cv = canvas(host, { aspect: 1.05, max: 420, min: 330, label: 'The 64 codons of the genetic code with the chosen codon highlighted' });
  const c1 = row(host);
  [0, 1, 2].forEach((i) => choice(c1, ['First', 'Second', 'Third'][i], BASES.map((b) => [b, b]), cod[i], (v) => { cod[i] = v; cv.redraw(); show(); }));
  const c2 = row(host);
  choice(c2, 'Mutate', [[-1, 'None'], [0, 'Letter 1'], [1, 'Letter 2'], [2, 'Letter 3']], mpos, (v) => { mpos = v; cv.redraw(); show(); });
  choice(c2, 'to', BASES.map((b) => [b, b]), mto, (v) => { mto = v; cv.redraw(); show(); });
  const out = readout(host);
  const mut = () => { if (mpos < 0) return null; const m = cod.slice(); m[mpos] = mto; return m.join(''); };
  function show() {
    const a = cod.join(''), A = CODON[a], m = mut();
    if (!m) { out.innerHTML = `<b>${a}</b> codes for <b>${A}</b>. Start codon AUG = Met; stops are UAA, UAG, UGA.`; return; }
    const B = CODON[m], kind = m === a ? 'no change (same letter)' : B === A ? 'silent (same amino acid, the code is degenerate)' : B === 'Stop' ? 'nonsense (chain stops early)' : A === 'Stop' ? 'stop lost (chain runs on)' : 'missense (a different amino acid)';
    out.innerHTML = `<b>${a}</b> (${A}) → <b>${m}</b> (${B}): <b>${kind}</b>.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Genetic code (mRNA codons)', col);
    const top = 34, cw = (w - 30) / 4, ch = (h - top - 6) / 4;
    const m = mut();
    BASES.forEach((b1, i) => BASES.forEach((b2, j) => {
      const x = 22 + j * cw, y = top + i * ch;
      ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x, y, cw, ch);
      BASES.forEach((b3, k) => {
        const s = b1 + b2 + b3, aa = CODON[s], on = s === cod.join(''), mm = s === m;
        if (on || mm) { ctx.fillStyle = on ? col.s[0] : col.s[1]; ctx.globalAlpha = 0.28; ctx.fillRect(x + 1, y + k * ch / 4, cw - 2, ch / 4); ctx.globalAlpha = 1; }
        text(ctx, `${s} ${aa}`, x + cw / 2, y + (k + 0.5) * ch / 4, { color: aa === 'Stop' ? col.bad : col.ink, size: 10.5, weight: on || mm ? 700 : 400, align: 'center', fit: false });
      });
    }));
    BASES.forEach((b, i) => { text(ctx, b, 11, top + (i + 0.5) * ch, { color: col.muted, size: 12, weight: 700, align: 'center' }); text(ctx, b, 22 + (i + 0.5) * cw, top - 8, { color: col.muted, size: 12, weight: 700, align: 'center' }); });
  };
  cv.redraw(); show();
}
