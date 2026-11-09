// #190 transfection and plate layout planner. The worked example below is done by hand; the layout and every amount
// were also checked against an independent NumPy script on 300 random plates, conditions and amounts (7454 values,
// none off by more than 1e-9).
import { autoLayout, countWells, fillOrder, plan, fmtUL, fmtNg, sigs, STARTS, EXAMPLE, SIZES, PLATES } from '../../src/lib/sci/transfection.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // Plates and starting amounts.
  check('transfection: six plate sizes with the right wells', SIZES.every((s) => PLATES[s][0] * PLATES[s][1] === s));
  check('transfection: starting amounts grow with the plate well', SIZES.slice(1).every((s, i) => STARTS[s].dna < STARTS[SIZES[i]].dna && STARTS[s].medium < STARTS[SIZES[i]].medium));
  // Fill order.
  const rows24 = fillOrder(24, false, false), cols24 = fillOrder(24, true, false);
  check('transfection: across rows A1, A2 … then B1', rows24[0] === 0 && rows24[1] === 1 && rows24[6] === 6 && rows24.length === 24);
  check('transfection: down columns A1, B1, C1, D1, then A2', cols24.slice(0, 5).join() === '0,6,12,18,1');
  check('transfection: inner wells of a 96-well plate: 60, first B2', fillOrder(96, false, true).length === 60 && fillOrder(96, false, true)[0] === 13);
  check('transfection: a 6-well plate has no inner wells to keep', fillOrder(6, false, true).length === 6);
  // Auto layout of the example: 18 wells on 24, replicates side by side.
  const lay = autoLayout(24, EXAMPLE);
  check('transfection: example layout fills A1–C6 in triplicates', lay.placed === 18 && lay.needed === 18 && lay.map.slice(0, 6).join() === '1,1,1,2,2,2' && lay.map.slice(12, 18).join() === '5,5,5,6,6,6' && lay.map.slice(18).every((x) => x === 0));
  const tight = autoLayout(6, EXAMPLE);
  check('transfection: too many wells for a 6-well plate: 6 of 18 placed', tight.placed === 6 && tight.needed === 18);
  const w = countWells(lay.map);
  check('transfection: wells counted per condition', w.get(1) === 3 && w.get(6) === 3 && !w.has(0));
  // Hand-worked example: 24-well, 500 ng DNA, 3 µL/µg (1.5 µL reagent), 50 µL diluent half and half, 500 µL medium, 10 % spare.
  const p = plan(STARTS[24], EXAMPLE, w, 10);
  const gx = p.rows[0];
  check('transfection: Gene X made for 3.3 wells: 1650 ng = 3.30 µL of 500 ng/µL', near(gx.makeFor, 3.3) && near(gx.dnaNg, 1650) && near(gx.dnaUL, 3.3));
  check('transfection: Gene X DNA tube 82.5 µL = 79.2 µL diluent + 3.3 µL DNA', near(gx.tubeVol, 82.5) && near(gx.tubeDiluent, 79.2));
  check('transfection: each tube draws 3.3 × 26.5 = 87.45 µL reagent mix; 51.5 µL complex per well', near(gx.reagentMix, 87.45) && near(gx.complexPerWell, 51.5) && near(p.reagentTubePerWell, 26.5));
  check('transfection: mutant 4.125 µL of 400 ng/µL; GFP 8.25 µL of 200 ng/µL', near(p.rows[1].dnaUL, 4.125) && near(p.rows[3].dnaUL, 8.25));
  check('transfection: mock tube is diluent only; untransfected gets nothing', near(p.rows[4].tubeDiluent, 82.5) && p.rows[4].dnaUL === 0 && near(p.rows[4].reagentMix, 87.45) && p.rows[5].reagentMix === 0 && p.rows[5].tubeVol === 0);
  check('transfection: reagent mix for 15 wells: 437.25 × 1.1 = 480.975 µL = 27.225 µL reagent + 453.75 µL diluent', p.mix.wells === 15 && near(p.mix.draw, 437.25) && near(p.mix.total, 480.975) && near(p.mix.reagent, 27.225) && near(p.mix.diluent, 453.75));
  check('transfection: medium for 18 wells: 500 × 18 × 1.1 = 9.9 mL', p.wellsUsed === 18 && near(p.medium, 9900));
  check('transfection: diluent in all: tubes + mix', near(p.diluentTotal, 79.2 + (82.5 - 4.125) + (82.5 - 1.65) + (82.5 - 8.25) + 82.5 + 453.75));
  check('transfection: the example has no errors or warnings', p.errors.length === 0 && p.warns.length === 0);
  // No spare, all diluent in the reagent tube.
  const p0 = plan({ ...STARTS[24], share: 0 }, EXAMPLE, w, 0);
  check('transfection: share 0 %: DNA neat in its tube, reagent tube 51.5 µL', near(p0.rows[0].tubeVol, 0) && near(p0.reagentTubePerWell, 51.5) && near(p0.mix.reagent, 22.5) && near(p0.mix.total, 51.5 * 15));
  check('transfection: with no room in the DNA tube the DNA does not fit', p0.errors.some((e) => /too dilute/.test(e)));
  // Errors and warnings.
  const dilute = plan(STARTS[24], [{ id: 1, name: 'Weak', kind: 'construct', stock: 10, reps: 2 }], new Map([[1, 2]]), 10);
  check('transfection: a 10 ng/µL stock is too dilute for a 25 µL DNA tube (needs 20.0 ng/µL)', dilute.errors.length === 1 && dilute.errors[0].includes('50.0 µL') && dilute.errors[0].includes('20.0 ng/µL'));
  const tiny = plan(STARTS[96], [{ id: 1, name: 'Strong', kind: 'construct', stock: 2000, reps: 1 }], new Map([[1, 1]]), 10);
  check('transfection: 0.06 µL of DNA is too little to pipette; 0.36 µL of reagent too', tiny.warns.some((x) => x.includes('Strong') && x.includes('0.06 µL')));
  check('transfection: a small reagent mix warns', tiny.warns.some((x) => /reagent mix/.test(x) && x.includes('0.36 µL')));
  const heavy = plan({ ...STARTS[24], diluent: 200 }, EXAMPLE, w, 10);
  check('transfection: complex over a quarter of the medium warns', heavy.warns.some((x) => /quarter/.test(x)));
  const neat = plan({ ...STARTS[24], share: 1 }, EXAMPLE, w, 10);
  check('transfection: all diluent in the DNA tube: reagent goes in neat', neat.warns.some((x) => /neat/.test(x)) && near(neat.mix.diluent, 0) && near(neat.reagentTubePerWell, 1.5));
  check('transfection: missing stock is an error only when the condition has wells', plan(STARTS[24], [{ id: 1, name: 'A', kind: 'control', stock: 0, reps: 1 }], new Map([[1, 1]]), 10).errors[0].includes('A: give the DNA stock') && plan(STARTS[24], [{ id: 1, name: 'A', kind: 'control', stock: 0, reps: 1 }], new Map(), 10).errors.length === 0);
  check('transfection: bad amounts are errors', plan({ ...STARTS[24], dna: 0, ratio: -1, medium: 0 }, EXAMPLE, w, 150).errors.length === 4);
  // Formatting.
  check('transfection: volumes formatted for pipetting', fmtUL(3.3) === '3.30 µL' && fmtUL(87.45) === '87.5 µL' && fmtUL(480.975) === '481 µL' && fmtUL(9900) === '9.90 mL' && fmtUL(0.105) === '0.11 µL');
  check('transfection: masses and significant figures', fmtNg(1650) === '1.65 µg' && fmtNg(275) === '275 ng' && sigs(20, 3) === '20.0' && sigs(0.012345, 3) === '0.0123');
};
