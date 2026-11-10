// #1301 Digestion journey
export const path = '/learn/digestion-journey/';
export default async ({ page, check, BASE }) => {
  const R = '.dgj ';
  await page.goto(`${BASE}/learn/digestion-journey/`); await page.waitForSelector(R + '.dgj-bar');
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(150); };
  const txt = (s) => page.textContent(R + s);
  check((await txt('.dgj-name')) === 'Stop 1 of 7: Mouth' && (await txt('.dgj-enz')).includes('Salivary amylase'), 'digestion: starts in the mouth');
  check((await txt('.dgj-bar[data-n="starch"] .dgj-small')) === '42 g whole, 18 g maltose', `digestion: starch after the mouth (${await txt('.dgj-bar[data-n="starch"] .dgj-small')})`);
  await tap('.dgj-next'); await tap('.dgj-next');
  check((await txt('.dgj-name')).includes('Stomach') && (await txt('.dgj-enz')).includes('Pepsin') && (await txt('.dgj-bar[data-n="protein"] .dgj-small')) === '10.8 g whole, 7.2 g peptides', 'digestion: stomach, pepsin, peptides');
  check(!(await txt('.dgj-enz')).includes('pepsinogen'), 'digestion: Class 10 hides the Class 11 lines');
  await tap('.dgj-level button[data-v="11"]');
  check((await txt('.dgj-enz')).includes('pepsinogen'), 'digestion: Class 11 adds pepsinogen');
  // tap stop 5 in the picture
  await page.locator(R + '[data-stop="4"] circle.dgj-stop').scrollIntoViewIfNeeded(); await page.locator(R + '[data-stop="4"] circle.dgj-stop').click(); await page.waitForTimeout(150);
  check((await txt('.dgj-name')) === 'Stop 5 of 7: Small intestine' && (await txt('.dgj-big')) === '90 g of 100 g absorbed', `digestion: small intestine absorbs (${await txt('.dgj-big')})`);
  await tap('.dgj-next'); await tap('.dgj-next');
  check((await txt('.dgj-sum')).startsWith('Egested: 10 g') && await page.isDisabled(R + '.dgj-next'), 'digestion: fibre egested at the end');
  await tap('.dgj-meals button[data-v="paneer"]');
  check((await txt('.dgj-big')) === '61 g of 63 g absorbed', `digestion: paneer meal (${await txt('.dgj-big')})`);
  await page.$eval(R + '.dgj-g[data-n="fibre"]', (el) => { el.value = '30'; el.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.dgj-sum')).startsWith('Egested: 30 g') && (await page.getAttribute(R + '.dgj-meals button[data-v="paneer"]', 'aria-pressed')) === 'false', 'digestion: own fibre slider');
  await tap('.dgj-play'); await page.waitForTimeout(400);
  check((await txt('.dgj-name')).includes('Mouth') && (await txt('.dgj-play')) === 'Stop', 'digestion: play starts at the mouth');
  await page.waitForTimeout(2000);
  check((await txt('.dgj-name')).includes('Oesophagus'), 'digestion: play moves on');
  await tap('.dgj-play');
  check((await txt('.dgj-play')) === 'Play the journey', 'digestion: play stops');
  // quiz
  check((await page.$$(R + '.sm-q')).length === 4, 'digestion: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = i < 4 ? /^(\d):/.exec(w) : /= (\S+) g of starch/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `digestion: quiz ${i} (${w})`);
  }
};
