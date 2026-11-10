// #1212 virtual-microscope
export const path = '/learn/virtual-microscope/';
export default async ({ page, check, BASE }) => {
  const R = '.vmi ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForTimeout(400);
  check((await t('.vm-eq')) === 'Total magnification = eyepiece × objective = 10 × 4 = 40×', 'microscope: starts at 40×');
  check((await t('.vm-big')).includes('blurry'), 'microscope: starts out of focus');
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await setR('.vm-f', 46);
  check((await t('.vm-big')) === '40× total, in focus', 'microscope: 4× sharp at 46');
  await page.click(R + '.vm-obj button[data-o="40"]');
  check((await t('.vm-eq')).endsWith('10 × 40 = 400×') && (await t('.vm-big')).includes('blurry'), 'microscope: 40× needs refocus');
  await setR('.vm-f', 52);
  check((await t('.vm-big')) === '400× total, in focus', 'microscope: 40× sharp at 52');
  await page.selectOption(R + '.vm-eye', '15');
  check((await t('.vm-eq')).endsWith('15 × 40 = 600×'), 'microscope: 15× eyepiece');
  await page.selectOption(R + '.vm-eye', '10');
  const inked = async () => page.$eval(R + '.vm-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 60 && d[i] < 200) n++; return n; });
  const before = await inked(); await page.check(R + '.vm-stain'); const after = await inked();
  check(after > 1000 && after !== before, `microscope: stain changes the picture (${before} → ${after})`);
  for (const s of ['cheek', 'pond']) { await page.selectOption(R + '.vm-spec', s); check((await inked()) > 300, `microscope: ${s} drawn`); }
  check((await t('.vm-note')).startsWith('Pond water'), 'microscope: pond note');
  check((await t('.vm-facts')).includes('Objective lens') && !(await t('.vm-facts')).includes('Field of view'), 'microscope: Class 8 facts');
  await page.click(R + 'button[data-level="9"]');
  check((await t('.vm-facts')).includes('0.45 mm = 450 µm'), 'microscope: field of view 0.45 mm at 40×');
  await page.click(R + '.vm-mode button[data-m="measure"]');
  const cv = await page.$(R + '.vm-cv'); await cv.scrollIntoViewIfNeeded(); const b = await cv.boundingBox();
  await page.mouse.move(b.x + b.width / 2 - 50, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 + 50, b.y + b.height / 2, { steps: 4 }); await page.mouse.up();
  const exp = 100 * 450 / (b.width - 8), m = (await t('.vm-facts')).match(/Your ruler line([\d.]+) µm/);
  check(m && Math.abs(+m[1] - exp) / exp < 0.03, `microscope: ruler ${m && m[1]} µm ≈ ${exp.toFixed(1)}`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'microscope: five questions');
  for (const i of [0, 1, 2]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  for (const i of [3, 4]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'microscope: all five answered right');
};
