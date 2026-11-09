// #490 heart rate zones: HRmax equations, % HRmax and Karvonen zones, FTP power zones.
// Reference numbers computed by hand in Python (/tmp/claude-0/a9/hr.py). Known fact: 220 − age and Tanaka agree at age 40 (180).
import { maxHR, hrZones, powerZones, parseBounds, hrAt } from '../../src/lib/sci/hrzones.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const ref = { 20: [200, 194, 193, 198.2], 35: [185, 183.5, 182.5, 188.6], 57.5: [162.5, 167.75, 166.75, 174.2], 70: [150, 159, 158, 166.2] };
  for (const [age, v] of Object.entries(ref)) check(`hrzones: HRmax equations at age ${age}`, ['fox', 'tanaka', 'gellish', 'nes'].every((e, i) => near(maxHR(Number(age), e), v[i])));
  check('hrzones: 220 − age equals Tanaka at 40', maxHR(40, 'fox') === 180 && near(maxHR(40, 'tanaka'), 180));
  const b = parseBounds('50, 60, 70, 80, 90, 100');
  const pz = hrZones(b, 180);
  check('hrzones: % HRmax zones', pz.length === 5 && [90, 108, 126, 144, 162].every((x, i) => near(pz[i].lo, x)) && near(pz[4].hi, 180));
  const kz = hrZones(b, 180, 60);
  check('hrzones: Karvonen zones', [120, 132, 144, 156, 168].every((x, i) => near(kz[i].lo, x)) && near(kz[4].hi, 180));
  check('hrzones: Karvonen 70 % of reserve', near(hrAt(0.7, 180, 60), 144));
  const w = powerZones(parseBounds('55 75 90 105 120 150'), 250);
  check('hrzones: FTP power zones', w.length === 7 && w[0].lo === 0 && [137.5, 187.5, 225, 262.5, 300, 375].every((x, i) => near(w[i].hi, x)) && w[6].hi === Infinity);
  let e1 = ''; try { parseBounds('50, 40, 60'); } catch (e) { e1 = e.message; }
  let e2 = ''; try { parseBounds('50'); } catch (e) { e2 = e.message; }
  let e3 = ''; try { parseBounds('50, x'); } catch (e) { e3 = e.message; }
  check('hrzones: bad boundaries rejected', e1.includes('rise') && e2.includes('at least two') && e3.includes('"x"'));
};
