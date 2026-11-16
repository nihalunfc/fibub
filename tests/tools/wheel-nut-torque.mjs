// #T1010 Wheel nut torque: maths checked by hand, then the page.
import { toNm, fromNm, lengthM, pushForce, shareOfWeight, starOrder } from '../../src/lib/money/wheel-torque.ts';
export const path = '/vehicles/wheel-nut-torque/';
const near = (a, b, tol) => Math.abs(a - b) <= tol;
export default async ({ page, check, BASE }) => {
  // Hand-worked: 110 N·m on a 0.40 m brace: 110 / 0.40 = 275 N = 275 / 9.80665 = 28.04 kgf = 275 / 4.44822 = 61.82 lbf.
  const F = pushForce(110, 0.4);
  check(near(F.N, 275, 1e-9) && near(F.kgf, 28.04, 0.01) && near(F.lbf, 61.82, 0.01), `wheel-nut-torque: 110 N·m on 0.40 m = 275 N, 28.0 kgf, 61.8 lbf (${F.N}, ${F.kgf}, ${F.lbf})`);
  // 110 N·m / 1.35582 = 81.13 lbf·ft; 100 lbf·ft = 135.58 N·m; 110 / 9.80665 = 11.22 kgf·m; 16 in = 0.4064 m.
  check(near(fromNm(110, 'lbfft'), 81.13, 0.01) && near(toNm(100, 'lbfft'), 135.58, 0.01) && near(fromNm(110, 'kgfm'), 11.22, 0.01) && near(lengthM(16, 'in'), 0.4064, 1e-9) && near(lengthM(40, 'cm'), 0.4, 1e-12), 'wheel-nut-torque: unit conversions');
  // 275 N against 70 kg (686.47 N) = 40.06 %.
  check(near(shareOfWeight(275, 70), 0.4006, 0.0005), 'wheel-nut-torque: share of body weight');
  check(starOrder(4).join() === '0,2,1,3' && starOrder(5).join() === '0,2,4,1,3' && starOrder(6).join() === '0,3,4,1,2,5' && starOrder(8).join() === '0,4,2,6,1,5,3,7', 'wheel-nut-torque: star orders for 4, 5, 6, 8 nuts');
  check([4, 5, 6, 8, 10].every((n) => new Set(starOrder(n)).size === n), 'wheel-nut-torque: every nut once');

  await page.goto(`${BASE}/vehicles/wheel-nut-torque/`); await page.waitForTimeout(300);
  const t = (k) => page.textContent(`.wnt [data-o="${k}"]`);
  check((await t('conv')) === '110.0 N·m = 81.1 lbf·ft = 11.22 kgf·m', `wheel-nut-torque: page converts 110 N·m (${await t('conv')})`);
  check((await t('push')) === 'Push about 275 N (28.0 kgf, 61.8 lbf)', `wheel-nut-torque: page push on 40 cm brace (${await t('push')})`);
  check((await t('weight')).startsWith('That is about 40 % of your body weight'), 'wheel-nut-torque: compares with 70 kg body weight');
  await page.fill('.wnt [data-k="l"]', '16'); await page.selectOption('.wnt [data-k="lu"]', 'in'); await page.waitForTimeout(50);
  // 110 / 0.4064 = 270.67 N
  check((await t('push')).startsWith('Push about 271 N'), `wheel-nut-torque: 16 in brace (${await t('push')})`);
  await page.selectOption('.wnt [data-k="pick"]', 'M14x1.5'); await page.waitForTimeout(50);
  check((await t('typ')).includes('120 to 190 N·m') && (await t('typ')).includes('your handbook value wins') && (await page.inputValue('.wnt [data-k="t"]')) === '155', 'wheel-nut-torque: typical range fills the middle and says the handbook wins');
  check((await t('order')).includes('1, 3, 5, 2, 4') && (await page.locator('.wnt .wn-star text').count()) === 5, 'wheel-nut-torque: star order for 5 nuts');
  await page.click('.wnt .wn-n button[data-n="6"]');
  check((await t('order')).includes('1, 4, 5, 2, 3, 6') && (await page.locator('.wnt .wn-star text').count()) === 6, 'wheel-nut-torque: star order for 6 nuts');
  await page.fill('.wnt [data-k="t"]', ''); await page.waitForTimeout(50);
  check(!(await page.isHidden('.wnt [data-o="err"]')), 'wheel-nut-torque: empty torque asks for a value');
};
