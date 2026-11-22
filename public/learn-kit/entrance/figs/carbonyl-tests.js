// Which tests does a carbonyl compound or acid pass? Pick a compound to see a grid of the common tests with the
// result and the structural reason (aldehyde H, α-hydrogen, CH₃CO- group, acidic O-H).
import { canvas, text, row, choice, readout } from '../../kit.js';

const TESTS = [
  ['dnp', '2,4-DNP', 'orange-red precipitate: any aldehyde or ketone C=O'],
  ['tol', 'Tollens', 'silver mirror: aldehydes (and methanoic acid) are oxidised'],
  ['feh', 'Fehling', 'red Cu₂O: aliphatic aldehydes (and methanoic acid); not benzaldehyde'],
  ['iod', 'Iodoform', 'yellow CHI₃: needs CH₃CO- (or CH₃CH(OH)-)'],
  ['bic', 'NaHCO₃', 'CO₂ fizz: carboxylic acids (stronger than carbonic acid)'],
  ['ald', 'Aldol', 'in dilute NaOH: needs an α-hydrogen'],
  ['can', 'Cannizzaro', 'in conc. NaOH: aldehydes with no α-hydrogen'],
];
const CMP = {
  hcho: ['methanal', 'HCHO', 'dnp tol feh can', 'An aldehyde with no α-carbon at all: Cannizzaro gives methanol + methanoate. It reduces Tollens and Fehling.'],
  mecho: ['ethanal', 'CH₃CHO', 'dnp tol feh iod ald', 'Has a CH₃CO- group (iodoform) and α-hydrogens (aldol: 3-hydroxybutanal).'],
  phcho: ['benzaldehyde', 'C₆H₅CHO', 'dnp tol can', 'Aromatic aldehyde: reduces Tollens but not Fehling; no α-H, so Cannizzaro (benzyl alcohol + benzoate).'],
  acetone: ['propanone', 'CH₃COCH₃', 'dnp iod ald', 'A methyl ketone: iodoform positive; not oxidised by Tollens or Fehling.'],
  pent3: ['pentan-3-one', 'C₂H₅COC₂H₅', 'dnp ald', 'A ketone without a CH₃CO- group: iodoform negative, the classic way to tell it from pentan-2-one.'],
  acphen: ['acetophenone', 'C₆H₅COCH₃', 'dnp iod ald', 'An aryl methyl ketone: iodoform positive (gives benzoate + CHI₃).'],
  hcooh: ['methanoic acid', 'HCOOH', 'tol feh bic', 'The only common acid that also behaves like an aldehyde: its H-C=O part reduces Tollens and Fehling.'],
  acoh: ['ethanoic acid', 'CH₃COOH', 'bic', 'A carboxylic acid: fizzes with NaHCO₃. The C=O of an acid does not give 2,4-DNP or iodoform tests.'],
};
export default function (host) {
  let key = 'mecho';
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 270, label: 'Grid of test results for a carbonyl compound' });
  const ctl = row(host);
  choice(ctl, 'Compound', Object.entries(CMP).map(([k, c]) => [k, c[0]]), key, (v) => { key = v; upd(); });
  const out = readout(host);
  const upd = () => { cv.redraw(); const c = CMP[key]; out.innerHTML = `<b>${c[0]} (${c[1]})</b>: ${c[3]}`; };
  cv.draw = (ctx, w, h, col) => {
    const c = CMP[key], pass = new Set(c[2].split(' '));
    text(ctx, `${c[0]}, ${c[1]}`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
    const top = 34, rh = (h - top - 8) / TESTS.length, nameW = Math.min(110, w * 0.3);
    TESTS.forEach(([k, name, what], i) => {
      const y = top + i * rh, ok = pass.has(k);
      ctx.fillStyle = i % 2 ? col.panel : col.soft; ctx.fillRect(6, y, w - 12, rh - 2);
      text(ctx, name, 12, y + rh / 2, { color: col.ink, size: 12, weight: 600 });
      ctx.beginPath(); ctx.arc(nameW + 6, y + rh / 2, Math.min(9, rh * 0.32), 0, Math.PI * 2);
      ctx.fillStyle = ok ? col.good || col.s[2] : col.line; ctx.fill();
      text(ctx, ok ? '✓' : '✗', nameW + 6, y + rh / 2, { color: ok ? col.panel : col.muted, size: 11, weight: 700, align: 'center', fit: false });
      text(ctx, what, nameW + 22, y + rh / 2, { color: ok ? col.ink : col.muted, size: 10.5 });
    });
  };
  upd();
}
