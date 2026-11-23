// Sign tidy for generated physics questions.
// Wraps signs() from ../_util.js, but first guards the physics notation it would otherwise
// damage: subscripts such as L_{1z} or T_{1u}, orbitals such as 1s or 1d_{5/2} (opt-in per
// template), and "(1x)" read-out modes. It also drops zero terms that carry a power or a unit
// vector (" + 0y^3", " + 0y\,\hat j") and brackets a leading negative base ("-4^2" -> "(-4)^2").
import { signs } from '../_util.js';

const KEEP = [/_\{1/g, /\(1x\)/g, /0\\hat x \+ 0\\hat y/g];
const ORB = /1(?=[spdfghi](?![a-zA-Z(]))/g;

// opt.orb: keep orbital labels (1s, 1p_{3/2}, also "1s" meaning ones).
// opt.neg: bracket a leading negative number that is squared ("$-4^2 + 3^2$" -> "$(-4)^2 + 3^2$");
// only for templates where the number itself is negative, never for "-F^2" style minus signs.
export function physSigns(s, opt = {}) {
  if (typeof s !== 'string') return s;
  const kept = [];
  const hold = (m) => { kept.push(m); return String.fromCharCode(0xe100 + kept.length - 1); };
  for (const re of opt.orb ? [...KEEP, ORB] : KEEP) s = s.replace(re, hold);
  s = s.replace(/\s*[+−-]\s*0\s?[a-z](?:\^\{?\d+\}?|[²³]|\\,\\hat\s?[ijk])(?![\w(])/g, '');
  if (opt.neg) s = s.replace(/([{($]|=\s)([-−])(\d+(?:\.\d+)?)(?=\^(?:2|\{2\})(?![\d.]))/g, '$1($2$3)');
  s = signs(s);
  return s.replace(/[-]/g, (c) => kept[c.charCodeAt(0) - 0xe100]);
}

/** Tidy the text of the listed templates (other templates are left alone).
 * ids: template ids; orb / neg: ids that also get those options (see physSigns). */
export const tidyPhys = (bank, ids, { orb = [], neg = [] } = {}) => {
  for (const g of bank.gens ?? []) {
    if (!ids.includes(g.id)) continue;
    const mk = g.make, opt = { orb: orb.includes(g.id), neg: neg.includes(g.id) };
    g.make = (rng) => {
      const p = mk.call(g, rng);
      for (const k of ['q', 'sol', 'hint', 'solution']) if (typeof p[k] === 'string') p[k] = physSigns(p[k], opt);
      if (Array.isArray(p.options)) p.options = p.options.map((x) => physSigns(x, opt));
      return p;
    };
  }
  return bank;
};
