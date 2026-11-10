// #1305 Kidney nephron filter
export const path = '/learn/nephron-filter/';
export default async ({ page, check, BASE }) => {
  const R = '.nph ';
  await page.goto(`${BASE}/learn/nephron-filter/`); await page.waitForSelector(R + '.nph-row');
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(150); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(100); };
  const txt = (s) => page.textContent(R + s);
  const small = (k) => txt(`.nph-row[data-k="${k}"] .nph-small`);
  check((await txt('.nph-big')) === '180 L filtered, 1.5 L of urine', `nephron: example (${await txt('.nph-big')})`);
  check((await txt('.nph-f1')) === 'Water: 1.5 L of urine ÷ 180 L filtered = 0.83 %, so 99.17 % is taken back.', 'nephron: water formula');
  check((await small('urea')) === '54 g filtered, 50 % back, 27 g in urine' && (await small('glucose')) === '162 g filtered, 100 % back, 0 g in urine', `nephron: urea and glucose (${await small('urea')})`);
  check((await small('salt')).includes('25200 mmol filtered, 99.4 % back, 151.2 mmol'), 'nephron: salt');
  check((await txt('.nph-f2')) === 'Urea in urine: 27 g ÷ 1.5 L = 18 g per litre.', 'nephron: urea concentration');
  check((await txt('.nph-pn')).startsWith('Glomerulus'), 'nephron: starts on the glomerulus');
  await page.locator(R + '[data-part="loop"] .nph-hit').scrollIntoViewIfNeeded();
  await page.$eval(R + '[data-part="loop"] .nph-hit', (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }))); await page.waitForTimeout(150);
  check((await txt('.nph-pn')).startsWith('Loop of Henle') && await page.$(R + '[data-part="loop"] .nph-tube.on') !== null, `nephron: tap the loop (${await txt('.nph-pn')})`);
  await slide('.nph-glu', 300);
  check((await small('glucose')).endsWith('216 g in urine') && (await txt('.nph-say')).includes('216 g a day spills'), 'nephron: high glucose spills');
  await slide('.nph-drink', 0.5);
  check((await txt('.nph-big')).endsWith('0.5 L of urine') && (await txt('.nph-f2')).endsWith('= 54 g per litre.'), 'nephron: little water, concentrated urine');
  await tap('.nph-level button[data-v="11"]');
  check((await txt('.nph-f2')).startsWith('Filtration: 125 mL a minute × 1440 minutes = 180 L a day') && (await txt('.nph-pt')).includes('counter-current'), 'nephron: Class 11');
  check((await page.$$(R + '.sm-q')).length === 4, 'nephron: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = (i < 3 ? /^(\d):/ : i === 3 ? /= (\S+) % is taken back\.$/ : /= (\S+) g\/L\.$/).exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `nephron: quiz ${i} (${w})`);
  }
};
