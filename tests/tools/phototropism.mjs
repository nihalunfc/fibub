// #1307 Phototropism plant
export const path = '/learn/phototropism/';
export default async ({ page, check, BASE }) => {
  const R = '.pht ';
  await page.goto(`${BASE}/learn/phototropism/`); await page.waitForSelector(R + '.pht-shoot', { state: 'attached' });
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(120); };
  const txt = (s) => page.textContent(R + s);
  check((await txt('.pht-big')) === 'Shaded side gets 72 % of the auxin', `tropism: start (${await txt('.pht-big')})`);
  for (let i = 0; i < 10; i++) await page.click(R + '.pht-one');
  await page.waitForTimeout(100);
  { const f = await txt('.pht-facts'); check(f.includes('Hours grown10') && f.includes('36° to the right') && f.includes('59 %'), `tropism: 10 hours (${f})`); }
  // move the lamp to the left with its slider (dragging it does the same)
  await page.$eval(R + '.pht-ang', (el) => { el.value = '-60'; el.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.pht-av')) === '60° to the left', 'tropism: lamp slider');
  for (let i = 0; i < 12; i++) await page.click(R + '.pht-one');
  await page.waitForTimeout(100);
  check((await txt('.pht-facts')).includes('to the left'), `tropism: lamp moved left, shoot follows (${await txt('.pht-facts')})`);
  await tap('.pht-exp button[data-v="cover"]');
  check((await txt('.pht-facts')).includes('Hours grown0') && (await page.$$(R + '.pht-foil')).length === 1, 'tropism: cover resets with a foil cap');
  for (let i = 0; i < 10; i++) await page.click(R + '.pht-one');
  check((await txt('.pht-facts')).includes('straight up') && (await txt('.pht-say')).includes('foil cap'), 'tropism: covered tip grows straight');
  await tap('.pht-exp button[data-v="cut"]');
  for (let i = 0; i < 5; i++) await page.click(R + '.pht-one');
  check((await txt('.pht-big')) === 'No tip, no auxin: no bending' && (await txt('.pht-facts')).includes('none'), 'tropism: cut tip');
  await tap('.pht-exp button[data-v="normal"]'); await tap('.pht-light button[data-v="dark"]'); await tap('.pht-pot button[data-v="side"]');
  for (let i = 0; i < 20; i++) await page.click(R + '.pht-one');
  check((await txt('.pht-say')).includes('geotropism') && /\d+° to the right/.test(await txt('.pht-facts')), `tropism: on its side in the dark (${await txt('.pht-facts')})`);
  await tap('.pht-light button[data-v="top"]'); await tap('.pht-pot button[data-v="up"]');
  await tap('.pht-play'); await page.waitForTimeout(900);
  const h = Number(/Hours grown(\d+)/.exec(await txt('.pht-facts'))[1]);
  await tap('.pht-play');
  check(h >= 2 && (await txt('.pht-play')) === 'Grow' && (await txt('.pht-facts')).includes('straight up'), `tropism: play from above stays straight (${h} h)`);
  check(await page.isHidden(R + '.pht-x11'), 'tropism: hormone table hidden at Class 10');
  await tap('.pht-level button[data-v="11"]');
  check(await page.isVisible(R + '.pht-x11') && (await txt('.pht-say')).includes('Darwin'), 'tropism: Class 11 adds hormones and history');
  check((await page.$$(R + '.sm-q')).length === 4, 'tropism: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /^(\d):/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `tropism: quiz ${i}`);
  }
};
