// #1108 SN1 vs SN2. The rule model was checked against the standard textbook outcomes: methyl and primary halides
// with strong nucleophiles in aprotic solvents go SN2; tertiary halides in water or alcohols go SN1; tertiary never
// SN2; secondary depends on the conditions. Stereochemistry checked with the CIP model of #1107: backside attack
// on (R)-2-bromobutane by OH⁻, CN⁻ or I⁻ gives the S product (Walden inversion); front and back attack on the flat
// carbocation give R and S (racemic).
import { predict, profile, curve, geometry, arrangement } from '../../src/lib/sci/sn.ts';
import { rank, descriptor } from '../../src/lib/sci/chirality.ts';

export default async (check) => {
  const w = (s, n, v) => predict(s, n, v).winner;
  check('sn: methyl and primary + strong + aprotic → SN2', w('methyl', 'strong', 'aprotic') === 'SN2' && w('primary', 'strong', 'aprotic') === 'SN2' && w('primary', 'strong', 'protic') === 'SN2');
  check('sn: tertiary + weak + protic → SN1; tertiary never SN2', w('tertiary', 'weak', 'protic') === 'SN1' && ['strong', 'weak'].every((n) => ['aprotic', 'protic'].every((v) => w('tertiary', n, v) !== 'SN2')));
  check('sn: methyl and primary never SN1', ['strong', 'weak'].every((n) => ['aprotic', 'protic'].every((v) => w('methyl', n, v) !== 'SN1' && w('primary', n, v) !== 'SN1')));
  check('sn: secondary depends on conditions', w('secondary', 'strong', 'aprotic') === 'SN2' && w('secondary', 'weak', 'protic') === 'SN1');
  check('sn: benzylic can go either way', w('benzylic', 'strong', 'aprotic') === 'SN2' && w('benzylic', 'weak', 'protic') !== 'SN2');
  check('sn: elimination warning for tertiary + strong base', predict('tertiary', 'strong', 'protic').elimination && !predict('primary', 'strong', 'aprotic').elimination);
  check('sn: reasons for every factor', predict('secondary', 'weak', 'protic', 'I').reasons.length === 4 && predict('secondary', 'weak', 'protic', 'I').reasons[3].includes('fastest'));
  const v = predict('tertiary', 'weak', 'protic'), p1 = profile('SN1', v), p2 = profile('SN2', v);
  check('sn: SN1 profile has an intermediate between two barriers; SN2 one barrier', p1.length === 5 && p1[2][1] < p1[1][1] && p1[2][1] < p1[3][1] && p2.length === 3 && p1[1][1] < p2[1][1]);
  check('sn: iodide barrier lower than fluoride', profile('SN2', v, 'I')[1][1] < profile('SN2', v, 'F')[1][1]);
  const c = curve(p1); check('sn: curve passes through the points', Math.abs(c[0][1]) < 1e-9 && Math.abs(c[200][1] + 15) < 1e-9 && Math.abs(Math.max(...c.map((x) => x[1])) - p1[1][1]) < 0.5);
  const g0 = geometry('SN2', 0), g5 = geometry('SN2', 0.5), g1 = geometry('SN2', 1);
  check('sn: umbrella flips through flat', Math.abs(g0.groups[0][0] + 1 / 3) < 1e-9 && Math.abs(g5.groups[0][0]) < 1e-9 && Math.abs(g1.groups[0][0] - 1 / 3) < 1e-9 && g5.ts && g1.nu === -1 && g0.x === 1);
  check('sn: SN1 flat carbocation at halfway', Math.abs(geometry('SN1', 0.5).groups[0][0]) < 1e-9 && geometry('SN1', 0.5).cation);
  // Stereochemistry with the CIP model.
  const start = arrangement('SN1start'), inv = arrangement('SN2');
  const d = (ids, pos) => descriptor(pos, rank(ids).order);
  check('sn: (R)-2-bromobutane to start', d(['Br', 'H', 'CH3', 'C2H5'], start) === 'R');
  check('sn: SN2 inverts: OH⁻, CN⁻, I⁻ give S', ['OH', 'CN', 'I'].every((nu) => d([nu, 'H', 'CH3', 'C2H5'], inv) === 'S'));
  check('sn: SN1 front and back attack give R and S', d(['OH', 'H', 'CH3', 'C2H5'], arrangement('SN1front')) === 'R' && d(['OH', 'H', 'CH3', 'C2H5'], arrangement('SN1back')) === 'S');
};
