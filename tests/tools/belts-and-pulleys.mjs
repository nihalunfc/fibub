// #L383 Belts and pulleys (How machines work): maths, idea cards, belt drive sim, quiz.
import { drivenRpm, drivenTorque, torqueFromPower, beltSpeed, beltLength, beltLengthExact, wrapSmall, beltDrive } from '../../src/lib/sci/millwright.ts';
export const path = '/learn/belts-and-pulleys/';
const near = (a, b, tol = 1e-3) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
export default async ({ page, check, BASE }) => {
  // Hand-worked: 1450 rpm, 100 mm → 200 mm, C = 500 mm, 1.5 kW.
  check(drivenRpm(1450, 100, 200) === 725 && drivenRpm(20, 40, 20) === 40, 'belts-and-pulleys: n2 = n1 d1 / d2 (725 rpm; chain 40T to 20T doubles)');
  check(near(torqueFromPower(1500, 1450), 9.8786) && near(drivenTorque(10, 100, 200), 20), 'belts-and-pulleys: motor torque 9.88 N·m, torque doubles on half speed');
  check(near(beltLength(200, 100, 500), 1476.239), 'belts-and-pulleys: belt length 1000 + 471.24 + 5 = 1476.24 mm');
  // Exact: β = asin(0.1) = 0.100167; 1000 cos β = 994.987; + 471.239 + 10.0167 = 1476.243
  check(near(beltLengthExact(200, 100, 500), 1476.243, 1e-5) && near(beltLengthExact(100, 100, 500), 1000 + Math.PI * 100), 'belts-and-pulleys: exact belt length matches by hand');
  check(near(wrapSmall(200, 100, 500), 168.5216) && wrapSmall(150, 150, 300) === 180, 'belts-and-pulleys: wrap angle 168.5° (180° for equal pulleys)');
  check(near(beltSpeed(100, 1450), 7.592), 'belts-and-pulleys: belt speed π × 0.1 × 1450 / 60 = 7.59 m/s');
  const b = beltDrive(100, 200, 500, 1450, 1500);
  check(near(b.t2, 19.757) && b.n2 === 725, 'belts-and-pulleys: whole drive 725 rpm, 19.76 N·m');
  await page.goto(`${BASE}/learn/belts-and-pulleys/`); await page.waitForTimeout(300);
  const R = '.bnp';
  check((await page.locator(`${R} .sk-step`).count()) === 7, 'belts-and-pulleys: 7 idea cards');
  await page.click(`${R} .sk-step:nth-child(2) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 7 steps done', 'belts-and-pulleys: ticks count');
  const ds = async (k) => +(await page.getAttribute(`${R} .bnp-out`, `data-${k}`));
  check((await ds('n2')) === 725 && near(await ds('len'), 1476.239) && near(await ds('wrap'), 168.5216), 'belts-and-pulleys: sim defaults 725 rpm, 1476 mm, 168.5°');
  const set = (cls, v) => page.$eval(`${R} ${cls}`, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input')); }, v);
  await set('.bnp-d2', 400); await set('.bnp-c', 100);
  check(+(await page.getAttribute(`${R} .bnp-c`, 'min')) === 270 && (await page.inputValue(`${R} .bnp-c`)) === '270', 'belts-and-pulleys: centre distance cannot go below the pulleys touching');
  check(!(await page.isHidden(`${R} .bnp-warn`)) && near(await ds('wrap'), wrapSmall(400, 100, 270)), 'belts-and-pulleys: low wrap angle shows a warning');
  check((await page.locator(`${R} .lq-item`).count()) === 6, 'belts-and-pulleys: quiz has 6 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-item:first-child .lq-fb`)) === 'Right.', 'belts-and-pulleys: quiz accepts the right choice'); }
  { const a = await page.getAttribute(`${R} .lq-item:last-child`, 'data-ans'); await page.fill(`${R} .lq-item:last-child .lq-in`, String(a)); await page.click(`${R} .lq-item:last-child .lq-check`);
    check((await page.textContent(`${R} .lq-item:last-child .lq-fb`)) === 'Right.', 'belts-and-pulleys: quiz accepts the right number'); }
};
