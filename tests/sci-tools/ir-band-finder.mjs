// IR band finder: the band table's own rules, the peak-to-band matching, the group tests, the typed-peak reader
// and the unit conversions. Band assignment has no numeric reference to fit, so these pin the table's internal
// consistency and the textbook windows (ketone 1705-1725, conjugated C=O 1660-1700, C-H bends 1370-1470).
import * as IR from '../../src/lib/sci/irbands.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const ids = new Set(IR.BANDS.map((b) => b.id));
  check('irbands: every band has lo < hi inside 400 to 4000 cm⁻¹ and a unique id', IR.BANDS.every((b) => b.lo < b.hi && b.lo >= 400 && b.hi <= 4000) && ids.size === IR.BANDS.length);
  check('irbands: every id named by a group rule exists in the table', IR.GROUPS.flatMap((g) => [...g.need.flat(), ...(g.not ?? []).flat()]).every((x) => ids.has(x)));
  check('irbands: 1715 cm⁻¹ gives ketone and carboxylic-acid C=O (aldehyde within tolerance), 1685 gives the conjugated C=O but not the acid one',
    IR.bandsAt(1715, 10).map((b) => b.id).join() === 'CO-ald,CO-ketone,CO-acid' && IR.bandsAt(1685, 10).map((b) => b.id).join() === 'CO-conj,CO-amide,CC-alkene,CN-imine');
  check('irbands: the only C–H bending windows are 1430-1470 and 1370-1390', IR.BANDS.filter((b) => b.bond.includes('C–H bend')).map((b) => `${b.lo}-${b.hi}`).join() === '1430-1470,1370-1390');
  check('irbands: units invert each other (1685 cm⁻¹ = 5.9347 µm; 20 %T = A 0.69897)', near(IR.toMicron(1685), 5.934718100890208) && near(IR.fromMicron(IR.toMicron(1685)), 1685, 1e-9) && near(IR.toAbsorbance(20), 0.6989700043360187) && near(IR.toTransmittance(IR.toAbsorbance(20)), 20, 1e-9));
  check('irbands: "3300-2500 br, 1710, 1240" reads as one broad band at 2900 and comes out a carboxylic acid',
    (() => { const p = IR.parseIR('3300-2500 br, 1710, 1240'); const g = IR.assign(p, 10).groups; return p.length === 3 && p[0].x === 2900 && p[0].broad === true && g.find((x) => x.name === 'Carboxylic acid')?.likely === true && g.find((x) => x.name === 'Ester')?.blocked === true; })());
  check('irbands: a sharp O–H with C–O at 1100 comes out an alcohol, not an acid',
    (() => { const g = IR.assign(IR.parseIR('3400, 1100'), 10).groups; return g.find((x) => x.name === 'Alcohol or phenol')?.likely === true && !g.some((x) => x.name === 'Carboxylic acid'); })());
  // Blog article biochar-cadmium-ftir-band-assignments-checked: Lalhruaitluanga et al. (2026), Front. Carbon 5:
  // 1720673 (CC BY). The peaks the paper calls "C=O" at 1572 to 1589 cm⁻¹ fall in no C=O window at all.
  { const peaks = [{ x: 3395, broad: true }, { x: 2359 }, { x: 1685 }, { x: 1687 }, { x: 1684 }, { x: 1572 }, { x: 1583 }, { x: 1589 }, { x: 1016 }, { x: 1114 }];
    const r = IR.assign(peaks, 10);
    const co = (w) => IR.bandsAt(w, 10).filter((b) => b.bond.includes('C=O') && b.id !== 'CO2');
    check('irbands: biochar peaks: 2359 is background CO₂ only, 1685 has four candidates led by the conjugated C=O',
      r.perPeak[1].bands.length === 1 && r.perPeak[1].bands[0].id === 'CO2' && r.perPeak[2].bands.length === 4 && r.perPeak[2].bands[0].id === 'CO-conj');
    check('irbands: no C=O window reaches 1572, 1583 or 1589 cm⁻¹, where the aromatic ring C=C window does',
      [1572, 1583, 1589].every((w) => co(w).length === 0) && [1583, 1589].every((w) => IR.bandsAt(w, 10).some((b) => b.id === 'CC-arom1')));
    check('irbands: the lowest C=O window in the table is amide I at 1630 cm⁻¹', Math.min(...IR.BANDS.filter((b) => b.bond.includes('C=O') && b.id !== 'CO2').map((b) => b.lo)) === 1630);
    check('irbands: the biochar peak list makes alcohol/phenol likely but leaves carboxylic acid at 1 of 2 bands',
      r.groups.find((g) => g.name === 'Alcohol or phenol')?.likely === true && (() => { const a = r.groups.find((g) => g.name === 'Carboxylic acid'); return a.met === 1 && a.total === 2 && !a.likely; })()); }
};
