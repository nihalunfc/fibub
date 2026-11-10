// #1302 Double circulation
export const path = '/learn/heart-circulation/';
export default async ({ page, check, BASE }) => {
  const R = '.hcx ';
  await page.goto(`${BASE}/learn/heart-circulation/`); await page.waitForSelector(R + '.hcx-fig circle.me');
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(150); };
  const txt = (s) => page.textContent(R + s);
  check((await txt('.hcx-big')) === 'Blood goes round once in about 57 seconds', `circulation: example lap (${await txt('.hcx-big')})`);
  check((await txt('.hcx-f1')) === 'Cardiac output = heart rate × stroke volume = 75 × 70 mL = 5250 mL a minute = 5.25 L a minute', 'circulation: output formula');
  { const f = await txt('.hcx-facts'); check(f.includes('Chambers4') && f.includes('per lap2') && f.includes('1512') && f.includes('7560 L'), `circulation: facts (${f})`); }
  // the cells move
  const pos = () => page.$eval(R + 'circle.me', (c) => c.getAttribute('cx') + ',' + c.getAttribute('cy'));
  const a = await pos(); await page.waitForTimeout(500); const b = await pos();
  check(a !== b, 'circulation: blood cells move');
  const colours = await page.$$eval(R + '.hcx-fig circle', (cs) => new Set(cs.map((c) => c.getAttribute('class').split(' ')[0])).size);
  check(colours === 2, 'circulation: human has two colours (no mixing)');
  await tap('.hcx-pause'); const p1 = await pos(); await page.waitForTimeout(400);
  check(p1 === await pos() && (await txt('.hcx-pause')) === 'Play', 'circulation: pause');
  check((await txt('.hcx-now')).startsWith('The ringed cell is in the') && (await page.$$(R + '.hcx-route li.on')).length === 1, 'circulation: tracked cell shown in the route');
  await tap('.hcx-pause');
  await page.fill(R + '.hcx-hr', '150'); await page.waitForTimeout(100);
  check((await txt('.hcx-big')) === 'Blood goes round once in about 29 seconds' && (await txt('.hcx-f1')).includes('10.5 L'), 'circulation: heart rate 150');
  await tap('.hcx-animal button[data-v="frog"]');
  check((await txt('.hcx-facts')).includes('Chambers3') && (await txt('.hcx-say')).includes('Three chambers') && await page.isVisible(R + '.hcx-lmix'), 'circulation: frog');
  const frogMix = await page.$$eval(R + '.hcx-fig line.mix', (l) => l.length);
  check(frogMix > 3, 'circulation: frog vessels show mixed blood');
  await tap('.hcx-animal button[data-v="fish"]');
  check((await txt('.hcx-facts')).includes('per lap1') && (await txt('.hcx-route')).includes('gill') && await page.isHidden(R + '.hcx-lmix'), 'circulation: fish single circulation');
  await tap('.hcx-animal button[data-v="human"]'); await tap('.hcx-level button[data-v="11"]');
  check((await txt('.hcx-fig')).includes('tricuspid') && (await txt('.hcx-say')).includes('only artery') && (await txt('.hcx-facts')).includes('Time per beat'), 'circulation: Class 11 labels');
  await page.fill(R + '.hcx-hr', '75');
  check((await page.$$(R + '.sm-q')).length === 4, 'circulation: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = i < 3 ? /^(\d):/.exec(w) : i === 3 ? /= (\S+) L a minute\.$/.exec(w) : /= (\S+) s\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `circulation: quiz ${i} (${w})`);
  }
};
