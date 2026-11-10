// #1308 Hormones and blood sugar feedback
export const path = '/learn/hormone-feedback/';
export default async ({ page, check, BASE }) => {
  const R = '.hfb ';
  await page.goto(`${BASE}/learn/hormone-feedback/`); await page.waitForSelector(R + '.hfb-g');
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(150); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(100); };
  const txt = (s) => page.textContent(R + s);
  check((await txt('.hfb-gn')) === 'Pancreas' && (await txt('.hfb-gh')) === 'Insulin and glucagon', 'hormones: starts on the pancreas');
  await page.locator(R + 'circle[data-g="thyroid"]').scrollIntoViewIfNeeded(); await page.locator(R + 'circle[data-g="thyroid"]').click(); await page.waitForTimeout(100);
  check((await txt('.hfb-gn')) === 'Thyroid gland' && (await txt('.hfb-gt')).includes('goitre') && !(await txt('.hfb-gt')).includes('calcitonin'), 'hormones: tap the thyroid');
  check((await txt('.hfb-big')) === 'At 08:00 blood glucose is 123 mg/dL' && (await txt('.hfb-say')).includes('releases insulin'), `hormones: 08:00 (${await txt('.hfb-big')})`);
  check((await txt('.hfb-facts')).includes('129 mg/dL at 07:44') && (await txt('.hfb-facts')).includes('Time above 1400 h'), `hormones: healthy facts (${await txt('.hfb-facts')})`);
  check((await page.$$(R + '.hfb-loop .hfb-box.on')).length === 2, 'hormones: insulin half of the loop lit');
  await slide('.hfb-t', 630);
  check((await txt('.hfb-say')).includes('glucagon') && (await txt('.hfb-big')).includes('16:30'), 'hormones: run, glucagon');
  await tap('.hfb-body button[data-v="none"]');
  check((await txt('.hfb-facts')).includes('218 mg/dL') && (await txt('.hfb-facts')).includes('Time above 1408.9 h') && (await txt('.hfb-say')).includes('type 1'), `hormones: no insulin (${await txt('.hfb-facts')})`);
  await tap('.hfb-body button[data-v="weak"]');
  check((await txt('.hfb-facts')).includes('156 mg/dL'), 'hormones: weak insulin');
  await tap('.hfb-body button[data-v="healthy"]');
  for (const c of await page.$$(R + '.hfb-e')) { await c.scrollIntoViewIfNeeded(); await c.uncheck(); }
  await page.waitForTimeout(100);
  check((await txt('.hfb-facts')).includes('Highest90 mg/dL') && (await txt('.hfb-facts')).includes('Lowest90 mg/dL'), 'hormones: no meals, flat');
  await tap('.hfb-level button[data-v="11"]');
  check((await txt('.hfb-say')).includes('negative feedback') && (await txt('.hfb-gt')).includes('calcitonin'), 'hormones: Class 11');
  check((await page.$$(R + '.sm-q')).length === 4, 'hormones: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /^(\d):/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `hormones: quiz ${i}`);
  }
};
