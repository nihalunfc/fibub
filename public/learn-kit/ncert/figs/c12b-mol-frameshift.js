// Class 12 Molecular Basis of Inheritance: mutations and the reading frame. The mRNA is read in triplets. A point substitution changes at most one amino acid (silent, missense or nonsense),
// but inserting or deleting one base shifts the frame and changes every amino acid after it (a frameshift). Sickle-cell disease is a missense change: GAG (Glu) to GUG (Val).
import { canvas, text, title, row, slider, choice, button, readout } from '../../kit.js';

const TAB = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const IDX = { U: 0, C: 1, A: 2, G: 3 };
const codon = (c) => TAB[IDX[c[0]] * 16 + IDX[c[1]] * 4 + IDX[c[2]]];
const translate = (s) => { const out = []; for (let i = 0; i + 3 <= s.length; i += 3) { const a = codon(s.slice(i, i + 3)); out.push(a); if (a === '*') break; } return out; };
const ONE = { F: 'Phe', L: 'Leu', S: 'Ser', Y: 'Tyr', '*': 'stop', C: 'Cys', W: 'Trp', P: 'Pro', H: 'His', Q: 'Gln', R: 'Arg', I: 'Ile', M: 'Met', T: 'Thr', N: 'Asn', K: 'Lys', V: 'Val', A: 'Ala', D: 'Asp', E: 'Glu', G: 'Gly' };

export default function (host) {
  const orig = 'AUGGCUACUGAACCUGGAUUCGUAUAA';
  let kind = 'sub', pos = 11, base = 'U';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'An mRNA read in triplets with a chosen mutation and the resulting chain of amino acids' });
  const ctl = row(host), ctl2 = row(host), ro = readout(host);
  choice(ctl, 'Mutation', [['none', 'None'], ['sub', 'Substitute'], ['ins', 'Insert one base'], ['del', 'Delete one base']], kind, (v) => { kind = v; go(); });
  slider(ctl2, { label: 'Position', min: 1, max: orig.length, step: 1, value: pos, fmt: (v) => String(v), oninput: (v) => { pos = v; go(); } });
  choice(ctl2, 'New base', ['A', 'U', 'G', 'C'].map((b) => [b, b]), base, (v) => { base = v; go(); });
  const mutate = () => { const p = pos - 1; if (kind === 'sub') return orig.slice(0, p) + base + orig.slice(p + 1); if (kind === 'ins') return orig.slice(0, p) + base + orig.slice(p); if (kind === 'del') return orig.slice(0, p) + orig.slice(p + 1); return orig; };
  const go = () => {
    const m = mutate(), a0 = translate(orig), a1 = translate(m); let diff = 0; for (let i = 0; i < Math.max(a0.length, a1.length); i++) if (a0[i] !== a1[i]) diff++;
    let msg = kind === 'none' ? 'Original message: 8 amino acids, then a stop.' : '';
    if (kind === 'sub') msg = diff === 0 ? 'Silent: the new codon still codes for the same amino acid.' : a1.length < a0.length ? 'Nonsense: a stop codon appears early, the chain is cut short.' : `Missense: one amino acid changed (${diff} different).`;
    if (kind === 'ins' || kind === 'del') msg = `Frameshift: the reading frame moves, so ${diff} of the ${a0.length} positions now differ.`;
    ro.textContent = msg + ' (Try Substitute, position 11, base U: GAA becomes GUA, Glu becomes Val, like sickle-cell haemoglobin.)';
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Read in threes: ' + (kind === 'none' ? 'normal message' : kind === 'sub' ? 'point substitution' : kind === 'ins' ? 'insertion' : 'deletion'), col), m = mutate();
    const row3 = (seq, y, label, ref) => {
      text(ctx, label, 10, y - 20, { color: col.muted, size: 10.5, weight: 700 });
      const n = Math.ceil(seq.length / 3), cw = Math.min(46, (w - 20) / 10);
      for (let i = 0; i < n; i++) {
        const c = seq.slice(i * 3, i * 3 + 3), x = 10 + (i % 10) * cw, yy = y + Math.floor(i / 9) * 0, a = c.length === 3 ? codon(c) : '', rf = ref ? ref.slice(i * 3, i * 3 + 3) : c;
        const same = !ref || c === rf; ctx.fillStyle = same ? col.line : col.s[3]; ctx.fillRect(x + 1, yy - 10, cw - 2, 20); text(ctx, c, x + cw / 2, yy, { color: same ? col.ink : col.bg, size: 11, weight: 700, align: 'center' });
        if (a) { ctx.fillStyle = a === '*' ? col.bad : col.s[0]; ctx.fillRect(x + 1, yy + 14, cw - 2, 20); text(ctx, ONE[a], x + cw / 2, yy + 24, { color: col.bg, size: 10.5, weight: 700, align: 'center' }); }
        if (a === '*') break;
      }
    };
    row3(orig, t0 + 56, 'Original mRNA and protein', null);
    row3(m, t0 + 150, kind === 'none' ? 'Same message' : 'Mutated mRNA and protein (red = changed)', orig);
    const base0 = t0 + 215; text(ctx, kind === 'sub' ? `Base ${pos} (${orig[pos - 1]}) is now ${base}.` : kind === 'ins' ? `${base} inserted before base ${pos}.` : kind === 'del' ? `Base ${pos} (${orig[pos - 1]}) removed.` : '', 10, base0, { color: col.muted, size: 11 });
  };
  go();
}
