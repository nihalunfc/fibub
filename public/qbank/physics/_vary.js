// Small helpers for the m31..m35 extra-variety templates (<topic>.more.gen.js). Not a topic file (leading underscore).
// Kept apart from _more.js and _odd.js so parallel writers do not collide.

/** A statement whose truth is drawn at random: returns [trueText, true, why] or [falseText, false, why]. */
export const vs = (r, t, f, why) => (r() < 0.5 ? [t, true, why] : [f, false, why]);

/** Coefficient times a TeX symbol with 1 and -1 shown as the bare symbol: co(1,'x') = 'x', co(-1,'x') = '-x', co(3,'x') = '3x'. */
export const co = (c, sym) => (c === 1 ? sym : c === -1 ? `-${sym}` : `${c}${sym}`);

/** "correct" or "<b>NOT</b> correct" for a question stem. */
export const nt = (not, word = 'correct') => (not ? `<b>NOT</b> ${word}` : word);

/** A number in TeX with sig significant figures, plain when moderate, a x 10^n otherwise. */
export function sci(x, sig = 3) {
  if (!Number.isFinite(x)) return String(x);
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e4 || a < 1e-2)) {
    const e = Math.floor(Math.log10(a)), m = +(x / 10 ** e).toPrecision(sig);
    if (Math.abs(m) >= 10) return `${m / 10}\\times 10^{${e + 1}}`;
    return m === 1 ? `10^{${e}}` : `${m}\\times 10^{${e}}`;
  }
  return String(+x.toPrecision(sig));
}
