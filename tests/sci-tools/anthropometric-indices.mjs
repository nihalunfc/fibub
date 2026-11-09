// Anthropometric indices: formulas checked by hand and the batch values and summary statistics against pandas
// (Series.describe, linear quartiles) on a made-up batch (scratch script anthro_check.py, 2026-11-09).
import { indices, summary, matchColumn, check as checkM, bmiClass, cephalicClass } from '../../src/lib/sci/anthro.ts';

const CSV = `ID,Weight (kg),Height (cm),Waist (cm),Hip (cm),Head length (mm),Head breadth (mm),Sitting height (cm)
S01,73.5,168.3,62.7,100.8,192.0,146.0,87.2
S02,64.5,180.2,72.7,104.3,183.0,153.0,95.1
S03,61.8,179.0,75.8,95.6,198.0,145.0,95.8
S04,71.1,163.4,,91.3,194.0,148.0,88.5
S05,75.1,165.3,66.6,99.4,192.0,150.0,82.8
S06,63.8,163.3,80.3,98.7,191.0,143.0,86.6
S07,64.3,173.1,88.1,104.7,195.0,152.0,91.0
S08,73.5,167.5,77.9,88.0,179.0,147.0,86.9
S09,56.4,174.7,73.3,92.4,192.0,151.0,88.7
S10,49.3,151.4,83.5,91.1,192.0,145.0,81.0
S11,70.3,182.1,86.5,84.9,176.0,155.0,91.9
S12,58.6,167.1,77.3,97.9,190.0,152.0,88.0`;
const REF = {"bmi":{"vals":[25.948909245543405,19.863242346338577,19.28778752223713,26.629652323858515,27.484904346311257,23.9247996298031,21.459363541308946,26.197371352194253,18.479630957837937,21.507759371362656,21.19997913174174,20.986727148552003],"desc":{"count":12.0,"mean":22.747510576424123,"std":3.136956074754847,"min":18.479630957837937,"25%":20.705855947998646,"50%":21.4835614563358,"75%":26.011024772206117,"max":27.484904346311257}},"whr":{"vals":[0.6220238095238095,0.6970278044103548,0.7928870292887029,null,0.670020120724346,0.8135764944275582,0.8414517669531996,0.8852272727272728,0.7932900432900432,0.9165751920965972,1.0188457008244993,0.7895812053115423],"desc":{"count":11.0,"mean":0.8036824035979933,"std":0.11396405088251575,"min":0.6220238095238095,"25%":0.7433045048609486,"50%":0.7932900432900432,"75%":0.8633395198402362,"max":1.0188457008244993}},"whtr":{"vals":[0.37254901960784315,0.40344062153163157,0.423463687150838,null,0.40290381125226854,0.4917330067360685,0.5089543616406701,0.4650746268656717,0.4195764167143675,0.5515191545574637,0.47501372872048325,0.46259724715739076],"desc":{"count":11.0,"mean":0.4524386983576998,"std":0.05337026572920214,"min":0.37254901960784315,"25%":0.41150851912299957,"50%":0.46259724715739076,"75%":0.4833733677282759,"max":0.5515191545574637}},"cephalic":{"vals":[76.04166666666667,83.60655737704919,73.23232323232324,76.28865979381443,78.125,74.86910994764398,77.94871794871794,82.12290502793296,78.64583333333333,75.52083333333333,88.06818181818181,80.0],"desc":{"count":12.0,"mean":78.70581570658307,"std":4.196325219290971,"min":73.23232323232324,"25%":75.91145833333334,"50%":78.03685897435898,"75%":80.53072625698324,"max":88.06818181818181}},"cormic":{"vals":[51.81224004753416,52.77469478357381,53.5195530726257,54.161566707466335,50.09074410163339,53.031230863441515,52.57076834199885,51.88059701492537,50.772753291356615,53.50066050198151,50.46677649643053,52.66307600239378],"desc":{"count":12.0,"mean":52.2703884354468,"std":1.2911160915934048,"min":50.09074410163339,"25%":51.55236835848977,"50%":52.61692217219631,"75%":53.14858827307651,"max":54.161566707466335}},"skelic":{"vals":[93.0045871559633,89.48475289169296,86.84759916492693,84.63276836158194,99.63768115942031,88.56812933025407,90.21978021978022,92.75028768699653,96.95603156708002,86.9135802469136,98.15016322089225,89.88636363636363],"desc":{"count":12.0,"mean":91.42097705348881,"std":4.774036731624115,"min":84.63276836158194,"25%":88.15449205941894,"50%":90.05307192807192,"75%":93.99244825874248,"max":99.63768115942031}}};

export default async (check) => {
  const close = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const one = Object.fromEntries(indices({ weight: 70, height: 175, waist: 84, hip: 100, headLength: 190, headBreadth: 152, nasalHeight: 50, nasalBreadth: 35, sittingHeight: 91, humerus: 320, radius: 240, femur: 450, tibia: 370 }).map((r) => [r.def.key, r]));
  check('anthro: BMI 70 kg, 175 cm = 22.857', close(one.bmi.value, 70 / 1.75 ** 2) && one.bmi.cls === 'Healthy weight range');
  check('anthro: waist-to-hip and waist-to-height', close(one.whr.value, 0.84) && close(one.whtr.value, 0.48));
  check('anthro: cephalic index 80 = brachycephalic', close(one.cephalic.value, 80) && one.cephalic.cls.startsWith('Brachycephalic'));
  check('anthro: nasal index 70, no class given', close(one.nasal.value, 70) && one.nasal.cls === '');
  check('anthro: Cormic 52 and skelic', close(one.cormic.value, 52) && close(one.skelic.value, 100 * 84 / 91));
  check('anthro: intermembral, brachial, crural, humerofemoral', close(one.intermembral.value, 100 * 560 / 820) && close(one.brachial.value, 75) && close(one.crural.value, 100 * 370 / 450) && close(one.humerofemoral.value, 100 * 320 / 450));
  check('anthro: class boundaries', bmiClass(18.49) === 'Underweight' && bmiClass(18.5) === 'Healthy weight range' && bmiClass(25) === 'Overweight' && bmiClass(30) === 'Obesity' && cephalicClass(74.9).startsWith('Dolicho') && cephalicClass(75) === 'Mesocephalic' && cephalicClass(80).startsWith('Brachy'));
  check('anthro: only indices with all measurements', indices({ weight: 60, height: 160 }).length === 1 && indices({ sittingHeight: 170, height: 160 }).length === 0);
  check('anthro: bad measurements reported', checkM({ sittingHeight: 170, height: 160 }).some((m) => /less than stature/.test(m)) && checkM({ weight: -3 }).length === 1);
  check('anthro: column names recognised', matchColumn('Weight (kg)') === 'weight' && matchColumn('Head breadth (mm)') === 'headBreadth' && matchColumn('Stature') === 'height' && matchColumn('Sitting height (cm)') === 'sittingHeight' && matchColumn('ID') === null);
  // Batch against pandas.
  const lines = CSV.trim().split('\n').map((l) => l.split(','));
  const keys = lines[0].map(matchColumn);
  const rows = lines.slice(1).map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] === '' ? NaN : Number(r[i])]).filter(([k]) => k)));
  for (const key of ['bmi', 'whr', 'whtr', 'cephalic', 'cormic', 'skelic']) {
    const vals = rows.map((m) => indices(m).find((r) => r.def.key === key)?.value ?? NaN);
    const want = REF[key].vals.map((v) => (v === null ? NaN : v));
    const s = summary(vals), d = REF[key].desc;
    check(`anthro: batch ${key} values and summary match pandas`, vals.every((v, i) => (Number.isNaN(want[i]) ? Number.isNaN(v) : close(v, want[i], 1e-12))) && s.n === d.count && close(s.mean, d.mean) && close(s.sd, d.std, 1e-10) && close(s.min, d.min) && close(s.q1, d['25%']) && close(s.median, d['50%']) && close(s.q3, d['75%']) && close(s.max, d.max));
  }
};
