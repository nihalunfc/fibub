// #384 seeding rate calculator: checked against hand-worked sums in Python (statistics.stdev for the counts).
import { seedsFor, kgPerHa, tswFromPerKg, tswFromPerLb, inRow, rowFtPerThousandthAcre, stand, M2_PER_AC } from '../../src/lib/sci/seeding.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const s = seedsFor(300, 92, 98, 85);
  check('seeding: 300 plants/m² at 92 % germination, 98 % purity, 85 % emergence needs 391.461 seeds/m²', near(s.seedsM2, 391.46093219896653) && near(s.pls, 0.9016));
  check('seeding: at TSW 42 g that is 164.414 kg/ha', near(kgPerHa(s.seedsM2, 42), 164.41359152356594));
  { const r = inRow(s.seedsM2, 0.18); check('seeding: 18 cm rows: 70.463 seeds per metre, 1.419 cm apart', near(r.perM, 70.46296779581397) && near(r.gapCm, 1.4191851851851853)); }
  // US maize-style: 34,000 plants/ac, 1,600 seeds per lb, 30 in rows.
  { const r = seedsFor(34000 / M2_PER_AC, 95, 99, 95), perAc = r.seedsM2 * M2_PER_AC;
    check('seeding: 34,000 plants/ac -> 38,053.67 seeds/ac', near(perAc, 38053.666862531136, 1e-9));
    const lbAc = kgPerHa(r.seedsM2, tswFromPerLb(1600)) * 0.892179122;
    check('seeding: at 1,600 seeds/lb that is 23.78 lb/ac', near(lbAc, 23.78354178908196, 1e-7));
    const ir = inRow(r.seedsM2, 30 * 0.0254);
    check('seeding: 30 in rows: 2.184 seeds per foot, 5.495 in apart', near(ir.perM * 0.3048, 2.1839799622664793, 1e-9) && near(ir.gapCm / 2.54, 5.494555905882352, 1e-9)); }
  check('seeding: TSW from 22,000 seeds/kg = 45.45 g; from 1,600 seeds/lb = 283.50 g', near(tswFromPerKg(22000), 45.45454545454545) && near(tswFromPerLb(1600), 283.49523125));
  check('seeding: 1/1000 acre at 30 in rows is 17.424 ft of row', near(rowFtPerThousandthAcre(30), 17.424));
  { const r = stand([31, 28, 35, 30, 26], 1 * 0.18);
    check('seeding: five 1 m counts at 18 cm: mean 166.67 plants/m², sd 18.840, CV 11.30 %', near(r.mean, 166.66666666666669) && near(r.sd, 18.839805508681298) && near(r.cv, 11.303883305208776) && near(r.min, 26 / 0.18) && r.n === 5); }
  check('seeding: one count has sd 0', stand([10], 0.25).sd === 0 && stand([10], 0.25).mean === 40);
};
