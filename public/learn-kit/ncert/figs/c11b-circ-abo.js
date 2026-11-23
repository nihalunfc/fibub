// Class 11 Biology, Body Fluids and Circulation: ABO and Rh blood groups. A red cell has antigen A, B, both or neither; plasma has the opposite antibodies (anti-B in group A, anti-A in group B, none in AB, both in O).
// A donor is safe if the recipient's plasma has no antibody against the donor's antigens. Rh+ blood must not go to an Rh- recipient who has already made anti-Rh.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { rr } from '../c11b-lib.js';

export default function (host) {
  let rec = 'A', rh = '+';
  const AG = { A: ['A'], B: ['B'], AB: ['A', 'B'], O: [] }, AB = { A: ['B'], B: ['A'], AB: [], O: ['A', 'B'] };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Table of which donor blood groups a chosen recipient can safely receive' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Recipient', [['A', 'A'], ['B', 'B'], ['AB', 'AB'], ['O', 'O']], rec, (v) => { rec = v; go(); });
  choice(ctl, 'Rh', [['+', 'Rh +'], ['-', 'Rh −']], rh, (v) => { rh = v; go(); });
  const ok = (d, drh) => AG[d].every((a) => !AB[rec].includes(a)) && !(drh === '+' && rh === '-');
  const go = () => { const list = []; ['A', 'B', 'AB', 'O'].forEach((d) => ['+', '-'].forEach((r) => ok(d, r) && list.push(d + (r === '+' ? '⁺' : '⁻')))); ro.textContent = `A person with ${rec}${rh === '+' ? '⁺' : '⁻'} blood has ${AB[rec].length ? 'anti-' + AB[rec].join(' and anti-') : 'no ABO'} antibodies in the plasma. They can safely receive: ${list.join(', ')}. ${rec === 'AB' && rh === '+' ? 'AB⁺ is the universal recipient.' : ''} ${rec === 'O' && rh === '-' ? 'O⁻ can give to anyone (the universal donor) but receives only O⁻.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Who can give blood to ${rec}${rh === '+' ? '⁺' : '⁻'}?`, col), cw = (w - 20) / 4, ch = Math.min(70, (h - t0 - 50) / 2);
    ['+', '-'].forEach((r, ri) => ['A', 'B', 'AB', 'O'].forEach((d, di) => {
      const x = 10 + di * cw, y = t0 + 14 + ri * (ch + 12), good = ok(d, r);
      rr(ctx, x + 3, y, cw - 6, ch, 8, good ? col.soft : col.panel, good ? col.s[2] : col.line, good ? 2.5 : 1.5);
      text(ctx, d + (r === '+' ? '⁺' : '⁻'), x + cw / 2, y + 16, { color: good ? col.ink : col.muted, size: 14, weight: 700, align: 'center' });
      text(ctx, 'antigen: ' + (AG[d].join('') || 'none'), x + cw / 2, y + 36, { color: col.muted, size: 9.5, align: 'center' });
      text(ctx, good ? 'safe' : 'clumps', x + cw / 2, y + ch - 14, { color: good ? col.good || col.s[2] : col.bad || col.s[3], size: 11, weight: 700, align: 'center' });
    }));
    const y = t0 + 14 + 2 * (ch + 12);
    text(ctx, `Recipient plasma: ${AB[rec].length ? AB[rec].map((a) => 'anti-' + a).join(', ') : 'no anti-A or anti-B'}${rh === '-' ? '; may make anti-Rh' : ''}`, 10, y + 6, { color: col.ink, size: 11 });
    text(ctx, 'clumps = agglutination of donor red cells', 10, y + 22, { color: col.muted, size: 10 });
  };
  go();
}
