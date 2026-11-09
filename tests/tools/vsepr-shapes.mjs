// #1101 VSEPR shape viewer
import { QUIZ, countPairs, shapeOf } from '../../src/lib/sci/vsepr.ts';
export const path = '/learn/vsepr-shapes/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/vsepr-shapes/`); await page.waitForTimeout(1200);
  const t = (s) => page.textContent('.vsp ' + s);
  check((await t('.vs-shape')) === 'NH₃: trigonal pyramidal', 'vsepr: NH3 example');
  check((await t('.vs-formula')).includes('= 3 + 1 = 4 → tetrahedral arrangement, sp³'), 'vsepr: formula with live numbers');
  { const f = await t('.vs-facts'); check(f.includes('less than 109.5°') && f.includes('measured about 107°') && f.includes('no: polar'), 'vsepr: NH3 facts'); }
  check((await t('.vs-count')).includes('N has 5 valence electrons') && (await t('.vs-count')).includes('2 left over = 1 lone pair'), 'vsepr: NH3 counting steps');
  // The picture is drawn and turns when dragged.
  const px = () => page.$eval('.vsp .vs-fig', (c) => c.toDataURL());
  await page.$eval('.vsp .vs-fig', (c) => c.scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
  const before = await px();
  const b2 = await (await page.$('.vsp .vs-fig')).boundingBox();
  await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2); await page.mouse.down(); await page.mouse.move(b2.x + b2.width / 2 + 60, b2.y + b2.height / 2 + 20, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(200);
  check(b2.width > 200 && before.length > 5000 && (await px()) !== before, 'vsepr: picture drawn and turns on drag');
  await page.click('.vsp .vs-reset'); await page.waitForTimeout(100);
  check((await px()) === before, 'vsepr: reset view');
  await page.uncheck('.vsp .vs-lp'); await page.waitForTimeout(100);
  check((await px()) !== before, 'vsepr: hide lone pairs');
  await page.check('.vsp .vs-lp');
  // Steppers.
  await page.click('.vsp .vs-lup'); await page.waitForTimeout(150);
  check((await t('.vs-shape')) === 'AX₃E₂: T-shaped' && (await t('.vs-facts')).includes('sp³d') && (await page.inputValue('.vsp .vs-ex')) === 'own', 'vsepr: + lone pair gives T-shaped');
  await page.click('.vsp .vs-bdn'); await page.waitForTimeout(150);
  check((await t('.vs-shape')) === 'AX₂E₂: bent (V-shaped)' && (await t('.vs-formula')).includes('2 + 2 = 4'), 'vsepr: − bonded atom gives bent');
  for (let i = 0; i < 4; i++) await page.click('.vsp .vs-bup');
  await page.waitForTimeout(150);
  check((await t('.vs-err')).includes('up to 6') && await page.isVisible('.vsp .vs-err'), 'vsepr: too many pairs message');
  await page.click('.vsp .vs-ldn'); await page.click('.vsp .vs-ldn'); await page.waitForTimeout(150);
  check((await t('.vs-shape')) === 'AX₆: octahedral' && await page.isHidden('.vsp .vs-err') && (await t('.vs-facts')).includes('yes: non-polar'), 'vsepr: AX6 octahedral');
  for (const [id, shape] of [['pcl5', 'PCl₅: trigonal bipyramidal'], ['sf4', 'SF₄: see-saw'], ['xef4', 'XeF₄: square planar'], ['co2', 'CO₂: linear'], ['so4', 'SO₄²⁻: tetrahedral']]) {
    await page.selectOption('.vsp .vs-ex', id); await page.waitForTimeout(120);
    check((await t('.vs-shape')) === shape, `vsepr: example ${shape}`);
  }
  check((await t('.vs-facts')).includes('109.5°') && (await t('.vs-count')).includes('6 + 2 (charge 2−) = 8'), 'vsepr: SO4 2- counts the charge');
  // Formula counter.
  check((await t('.vs-fbig')) === 'SF₄: see-saw', 'vsepr: counter default SF4');
  await page.selectOption('.vsp .vs-c', 'Xe'); await page.waitForTimeout(100);
  check((await t('.vs-fbig')) === 'XeF₄: square planar' && (await t('.vs-fsteps')).includes('more than an octet'), 'vsepr: counter XeF4');
  await page.click('.vsp .vs-show'); await page.waitForTimeout(300);
  check((await t('.vs-shape')) === 'XeF₄: square planar' && (await page.inputValue('.vsp .vs-ex')) === 'xef4', 'vsepr: show this shape above');
  await page.selectOption('.vsp .vs-c', 'O'); await page.selectOption('.vsp .vs-o', 'H'); await page.fill('.vsp .vs-n', '3'); await page.selectOption('.vsp .vs-q', '1'); await page.waitForTimeout(100);
  check((await t('.vs-fbig')) === 'H₃O⁺: trigonal pyramidal', 'vsepr: counter H3O+');
  await page.selectOption('.vsp .vs-c', 'N'); await page.selectOption('.vsp .vs-o', 'O'); await page.fill('.vsp .vs-n', '2'); await page.selectOption('.vsp .vs-q', '0'); await page.waitForTimeout(100);
  check((await t('.vs-fbig')) === 'NO₂: bent (V-shaped)' && (await t('.vs-fsteps')).includes('radical'), 'vsepr: counter NO2 radical');
  await page.selectOption('.vsp .vs-c', 'B'); await page.selectOption('.vsp .vs-o', 'F'); await page.fill('.vsp .vs-n', '5'); await page.waitForTimeout(100);
  check((await t('.vs-ferr')).includes('not have enough electrons') && await page.isDisabled('.vsp .vs-show'), 'vsepr: counter BF5 message');
  await page.fill('.vsp .vs-n', '9'); await page.waitForTimeout(100);
  check((await t('.vs-ferr')).includes('1 to 6'), 'vsepr: counter bad count');
  await page.fill('.vsp .vs-n', '3'); await page.waitForTimeout(100);
  check((await t('.vs-fbig')) === 'BF₃: trigonal planar' && (await t('.vs-fsteps')).includes('incomplete octet'), 'vsepr: counter BF3 incomplete octet');
  // Check yourself: answer every question right, then one wrong.
  const qs = await page.$$eval('.vsp .vs-q1 label', (l) => l.map((x) => x.firstChild.textContent));
  check(qs.length === 4, 'vsepr: 4 quiz questions');
  const ans = qs.map((s) => { const name = s.replace(/^\d\. What shape is /, '').replace(/\?$/, ''); const m = QUIZ.find((x) => x.name === name); const c = countPairs(m.central, m.outer, m.charge); return shapeOf(c.bonds, c.lone).shape; });
  const sels = await page.$$('.vsp .vs-qa');
  for (let i = 0; i < 4; i++) await sels[i].selectOption(ans[i]);
  await page.click('.vsp .vs-check'); await page.waitForTimeout(100);
  check((await t('.vs-score')) === '4 of 4 right' && (await t('.vs-qs')).includes('✓ Right.'), 'vsepr: quiz all right');
  await sels[0].selectOption(ans[0] === 'linear' ? 'octahedral' : 'linear'); await page.click('.vsp .vs-check');
  check((await t('.vs-score')) === '3 of 4 right' && (await t('.vs-qs')).includes('✗ Not') && (await t('.vs-qs')).includes('valence electrons'), 'vsepr: quiz wrong answer gets worked steps');
  await page.click('.vsp .vs-new'); await page.waitForTimeout(100);
  check((await t('.vs-score')) === '' && (await page.$$('.vsp .vs-q1')).length === 4, 'vsepr: new questions');
};
