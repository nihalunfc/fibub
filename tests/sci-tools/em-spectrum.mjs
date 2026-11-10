// #1419 EM spectrum explorer. Checked against Python with exact SI constants: 525 nm: f = 5.71033253e14 Hz,
// E = 3.78370639e-19 J = 2.36160378 eV; 3 m: 4.13280661e-7 eV; 254 nm: 4.88126765 eV; 1.06 pm: 1.16966225e6 eV.
import * as S from '../../src/lib/sci/em-spectrum.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-8) => Math.abs(a - b) <= r * Math.abs(b) + 1e-40;

export default async (check) => {
  const g = S.photon(525e-9);
  check('spectrum: green light frequency and photon energy', near(g.f, 571033253333333.4) && near(g.E, 3.783706394569388e-19) && near(g.eV, 2.361603779680005));
  check('spectrum: FM, UV lamp and gamma photons', near(S.photon(3).eV, 4.132806614440009e-7) && near(S.photon(254e-9).eV, 4.8812676548504035) && near(S.photon(1.06e-12).eV, 1169662.2493698138));
  check('spectrum: bands', S.bandOf(525e-9).id === 'visible' && S.bandOf(940e-9).id === 'ir' && S.bandOf(0.122).id === 'micro' && S.bandOf(0.06).id === 'micro' && S.bandOf(3).id === 'radio' && S.bandOf(254e-9).id === 'uv' && S.bandOf(3.1e-11).id === 'xray' && S.bandOf(5e-13).id === 'gamma');
  check('spectrum: every example sits in a band, bands touch end to end', S.EXAMPLES.every((e) => S.bandOf(e.lam)) && S.BANDS.every((b, i) => i === 0 || b.min === S.BANDS[i - 1].max));
  const r = S.visibleRGB(650), b = S.visibleRGB(450), gr = S.visibleRGB(530);
  check('spectrum: colours: red is red, blue is blue, green is green; none outside 380-780 nm', r[0] > 200 && r[2] === 0 && b[2] > 200 && b[0] === 0 && gr[1] > 200 && S.visibleRGB(300) === null && S.visibleRGB(900) === null);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of S.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('spectrum: 60 seeded question sets check out', okq);
};
