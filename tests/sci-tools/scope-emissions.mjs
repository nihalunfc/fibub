// #506 Scope 1, 2 and 3 emissions. Checked against pandas (read_csv, amount × factor, market-based Scope 2 with
// fallback, groupby year × scope and year × category, intensities, exported CSV) on 200 random inventories with
// quoted descriptions and category names: 8,170 checks, 0 failed.
import { splitTable, readRows, totals, intensity, change, exportRows, typeOf, rowKgMarket, EXAMPLE, TYPES } from '../../src/lib/sci/ghgscopes.ts';
import { csv } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('split: quoted commas and doubled quotes', JSON.stringify(splitTable('a,"b, c","say ""hi"""\n1,2,3')) === JSON.stringify([['a', 'b, c', 'say "hi"'], ['1', '2', '3']]));
  check('split: tabs win, semicolons when no comma', splitTable('a\tb,c\n1\t2')[0][1] === 'b,c' && splitTable('a;b\n1;2')[1][1] === '2');
  check('types: by id, by category with or without number, any case', typeOf('refrigerant')?.scope === 1 && typeOf('6 Business travel')?.id === 'travel' && typeOf('business TRAVEL')?.id === 'travel' && typeOf('nope') === undefined);
  check('types: 4 Scope 1, 2 Scope 2, 7 Scope 3', TYPES.filter((t) => t.scope === 1).length === 4 && TYPES.filter((t) => t.scope === 2).length === 2 && TYPES.filter((t) => t.scope === 3).length === 7);

  const { rows, errors } = readRows(EXAMPLE);
  check('example: 16 rows, header skipped, no errors', rows.length === 16 && errors.length === 0);
  const [a, b] = totals(rows);
  // 2024: S1 = 60000×0.2 + 5000×2.7 + 2×2000 = 29,500; S2 loc 80000×0.4 = 32,000, market ×0.45 = 36,000;
  // S3 = 45,000 + 6,000 + 14,400 + 4,000 = 69,400.
  check('2024: Scope 1 29,500, Scope 2 32,000 / 36,000, Scope 3 69,400 kg', a.year === 2024 && a.s1 === 29500 && close(a.s2loc, 32000) && close(a.s2mkt, 36000) && close(a.s3, 69400));
  check('2024: totals 130.9 t location, 134.9 t market', close(a.totalLoc, 130900) && close(a.totalMkt, 134900));
  check('2025: green tariff makes Scope 2 market 3,800 kg; total 99.12 t', close(b.s2mkt, 3800) && close(b.s2loc, 28880) && close(b.totalMkt, 99120) && close(b.totalLoc, 124200));
  check('categories: refrigerant 4,000 kg = 2 kg × GWP 2000', a.byCat.get('Fugitive (refrigerant leaks)') === 4000 && a.byCat.size === 8);
  const i24 = intensity(a.totalMkt, 12, 2e6), i25 = intensity(b.totalMkt, 13, 2.3e6);
  check('intensity: 11.24 t per employee, 67.45 t per million (2024)', close(i24.perEmployee, 134.9 / 12) && close(i24.perMillion, 67.45));
  check('intensity: none without employees or revenue', Number.isNaN(intensity(1000, 0, 0).perEmployee) && Number.isNaN(intensity(1000, 0, 0).perMillion));
  const ch = change(a.totalMkt, b.totalMkt);
  check('change: −35.78 t, −26.5 %', close(ch.abs, -35780) && close(ch.rel, -35780 / 134900) && Number.isNaN(change(0, 5).rel));
  check('i25 per employee 7.62 t', close(i25.perEmployee, 99.12 / 13));

  const m = readRows('2025,electricity,No market factor,1000,kWh,0.4,\n2025,heat,District heat,500,kWh,0.2,0.1\n2025,goods,Ignored market,10,spend,1,5');
  check('market: blank falls back to location; only Scope 2 keeps a market factor', rowKgMarket(m.rows[0]) === 400 && close(rowKgMarket(m.rows[1]), 50) && m.rows[2].market === null && totals(m.rows)[0].s2NoMarket === 1);
  const bad = readRows('year,type\n20x4,goods,a,1,u,1\n2024,flying,a,1,u,1\n2024,goods,a,-1,u,1\n2024,goods,a,1,u,x\n2024,electricity,a,1,kWh,1,y\n2024,goods,a');
  check('errors: year, type, amount, factor, market factor, short row', bad.rows.length === 0 && bad.errors.length === 6 && bad.errors[0].includes('is not a year') && bad.errors[1].includes('unknown type "flying"') && bad.errors[2].includes('amount') && bad.errors[3].includes('the factor') && bad.errors[4].includes('market factor') && bad.errors[5].includes('needs year'));
  const ex = exportRows(rows);
  check('export: header and computed kg', ex[0].length === 11 && ex[4][9] === 32000 && ex[4][10] === 36000 && ex[3][7] === 1);
  // Round trip: the exported CSV (quoted where needed) reads back to the same totals.
  const back = readRows(csv(exportRows(readRows('2024,goods,"Paper, toner and ""misc""",100,spend,0.5,').rows)));
  check('export: CSV round trip keeps quoted text', back.rows.length === 1 && back.rows[0].desc === 'Paper, toner and "misc"' && back.rows[0].amount === 100 && back.errors.length === 0);

  // The precast concrete yard of Suriyanon et al. (2025), Construction Economics and Building 25(2), CC BY 4.0,
  // doi:10.5130/AJCEB.v25i2.9030, as rebuilt in the blog article: the paper's own activity amounts and factors.
  { const YARD = `2022,stationary,LPG for the rebar cutting machine,420,kg,3.1134
2022,mobile,Gasoline for the concrete vibrator,218,L,2.1894
2022,mobile,Diesel for truck transport,950,L,2.7406
2022,refrigerant,R-410A yard,0.30,kg,2090
2022,refrigerant,R-410A office,0.32,kg,2090
2022,process,Septic tank methane,38.34,kg,28
2022,electricity,Casting yards,15618,kWh,0.4999
2022,electricity,Office,5967,kWh,0.4999
2022,goods,Ready-mix concrete 350 KSC,2198,m3,294
2022,goods,Reinforcement bar,65743.43,kg,2.14
2022,goods,Flat bar,699.60,kg,0.988
2022,goods,Wire mesh,44064.84,kg,1.6382
2022,goods,Tying wire,237.50,kg,1.14
2022,goods,PVC pipe class 5,44532.08,cm3,0.0045
2022,goods,Oxygen,1604.46,kg,0.469
2022,goods,Tap water,14765,m3,0.541
2022,goods,Office copier paper,32500,sheet,0.0115
2022,goods,Office toilet paper,8,roll,2.81
2022,fuel-energy,Upstream LPG,420,kg,0.272
2022,fuel-energy,Upstream gasoline,218,L,0.344
2022,fuel-energy,Upstream diesel,950,L,0.237
2022,fuel-energy,Grid losses on yard electricity,15618,kWh,0.0987
2022,fuel-energy,Grid losses on office electricity,5967,kWh,0.0987
2022,freight,Mixer loaded to the yard,99173.76,t.km,0.0625
2022,freight,Mixer empty return,8347.20,km,0.6316
2022,freight,22-wheeler loaded,84222.94,t.km,0.0459
2022,freight,22-wheeler empty return,2631.97,km,1.0206
2022,freight,Other yard material transport,1,lump,582
2022,freight,Office paper transport,1,lump,37
2022,waste,Ready-mix concrete waste,344160,kg,0
2022,waste,Reinforcement bar waste,1288.03,kg,0.003
2022,waste,Wire mesh waste,1458.02,kg,0.003
2022,waste,Office waste,949.63,kg,0.8076
2022,commuting,Subcontractor commuting,226.35,L,2.2394
2022,commuting,Office employee commuting,2716.26,L,2.2394`;
    const y = readRows(YARD), Y = totals(y.rows)[0], mix = y.rows.find((r) => r.desc.startsWith('Ready-mix concrete 350'));
    const iy = intensity(Y.totalLoc, 2054.6, 0);
    check(`precast yard 2022: 35 rows give Scope 1 ${(Y.s1 / 1000).toFixed(3)}, Scope 2 ${(Y.s2loc / 1000).toFixed(3)} and Scope 3 ${(Y.s3 / 1000).toFixed(3)} t, total within 1.5 kg of the paper's 915.489 t`,
      y.errors.length === 0 && y.rows.length === 35 && Math.abs(Y.s1 - 6757.8) < 0.1 && Math.abs(Y.s2loc - 10790.4) < 0.1 && Math.abs(Y.s3 - 897940) < 1.5 && Math.abs(Y.totalLoc - 915489) < 1.5);
    check('precast yard: scope shares 0.74 / 1.18 / 98.08 %, ready-mix 70.59 % of the footprint, intensity 0.445580 t per m3',
      [0.74, 1.18, 98.08].every((v, i) => Math.abs(Math.round((100 * [Y.s1, Y.s2loc, Y.s3][i] * 100) / Y.totalLoc) / 100 - v) < 5e-3)
      && Math.abs((100 * mix.amount * mix.factor) / Y.totalLoc - 70.59) < 5e-3 && Math.abs(iy.perEmployee - 0.445580) < 5e-6);
    const fullKg = (Y.totalLoc - 12598) * (3028.8 / 2054.6) + 12598, ch = change(iy.perEmployee, fullKg / 1000 / 3028.8);
    check('precast yard: at full capacity 1,343.600 t and 0.443608 t per m3, a 0.44 % cut', Math.abs(fullKg / 1000 - 1343.6) < 0.01 && Math.abs(fullKg / 1000 / 3028.8 - 0.443608) < 5e-6 && Math.abs(100 * ch.rel + 0.44) < 5e-3); }
};
