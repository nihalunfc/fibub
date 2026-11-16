// #L351 Magnification
export const path = '/learn/microscope-magnification/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/microscope-magnification/`); await page.waitForTimeout(300);
  await page.selectOption('.mm .mm-obj', '40');
  await page.selectOption('.mm .mm-spec', '0'); // onion cell, 250 um
  await page.evaluate(() => document.querySelector('.mm .mm-cv').setRuler(100));
  const o = page.locator('.mm .mm-out');
  check((await o.getAttribute('data-mag')) === '400', 'microscope-magnification: x10 eyepiece with x40 objective is x400');
  check(Math.abs(+(await o.getAttribute('data-actual-um')) - 250) < 3, 'microscope-magnification: 100 mm image at x400 is 250 um');
  await page.selectOption('.mm .mm-unit', 'mm');
  check(Math.abs(+(await o.getAttribute('data-actual')) - 0.25) < 0.01, 'microscope-magnification: unit switch gives 0.25 mm');
  await page.selectOption('.mm .mm-obj', '4');
  check((await o.getAttribute('data-fov')) === '4.500', 'microscope-magnification: field of view at x4 is 4.5 mm');
  check((await page.getAttribute('.mm .mm-calout', 'data-um')) === '2.5000', 'microscope-magnification: 40 divisions to 10 stage divisions is 2.5 um');
  { const a = await page.getAttribute('.mm .lq-item', 'data-ans'); await page.fill('.mm .lq-in', a); await page.click('.mm .lq-check');
    check((await page.textContent('.mm .lq-fb')) === 'Right.', 'microscope-magnification: quiz accepts the right answer'); }
};
