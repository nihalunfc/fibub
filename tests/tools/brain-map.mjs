// #1306 Brain map
export const path = '/learn/brain-map/';
export default async ({ page, check, BASE }) => {
  const R = '.brm ';
  await page.goto(`${BASE}/learn/brain-map/`); await page.waitForSelector(R + '[data-r="medulla"]');
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(150); };
  const part = async (id) => { const l = page.locator(`${R}[data-r="${id}"]`); await l.scrollIntoViewIfNeeded(); const b = await l.boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(150); };
  const txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.brm-r')).length === 11, 'brain: eleven parts drawn');
  await part('cerebellum');
  check((await txt('.brm-name')) === 'Cerebellum' && (await txt('.brm-t')).includes('balance') && (await txt('.brm-div')).startsWith('Hindbrain'), 'brain: tap the cerebellum');
  await part('medulla');
  check((await txt('.brm-name')) === 'Medulla' && (await txt('.brm-t')).includes('sneezing'), `brain: tap the medulla (${await txt('.brm-name')})`);
  await part('occipital');
  check((await txt('.brm-name')).startsWith('Occipital') && !(await txt('.brm-t')).includes('left half'), 'brain: occipital, Class 10');
  await tap('.brm-level button[data-v="11"]');
  check((await txt('.brm-t')).includes('left half'), 'brain: Class 11 adds detail');
  await tap('.brm-mode button[data-v="split"]');
  check(await page.isVisible(R + '.brm-leg') && (await page.$$(R + '.brm-r.d-hindbrain')).length === 3 && (await page.$$(R + '.brm-r.d-forebrain')).length === 5, 'brain: fore, mid, hind colours');
  await tap('.brm-mode button[data-v="find"]');
  check(await page.isVisible(R + '.brm-ask') && (await txt('.brm-ask')).startsWith('Which part does this?'), 'brain: find mode asks');
  // answer right using the lib's mapping from the page text
  const MAP = { '17 × 6': 'frontal', 'raise your hand': 'frontal', 'ice cube': 'parietal', 'song': 'temporal', 'read the words': 'occipital', 'thirsty': 'hypothalamus', 'sweat': 'hypothalamus', 'taller': 'pituitary', 'flash': 'midbrain', 'heart beats': 'medulla', 'sneeze': 'medulla', 'breathing': 'medulla', 'bicycle': 'cerebellum', 'narrow wall': 'cerebellum', 'hot pan': 'cord' };
  for (let i = 0; i < 3; i++) {
    const a = await txt('.brm-ask'), key = Object.keys(MAP).find((k) => a.includes(k));
    await part(MAP[key]);
    check((await txt('.brm-res')).startsWith('Right!') && (await page.$$(R + '.brm-r.good')).length === 1, `brain: find right answer ${i + 1} (${a})`);
    await tap('.brm-next');
  }
  check((await txt('.brm-score')) === '3 of 3 right, 3 in a row', `brain: score (${await txt('.brm-score')})`);
  { const a = await txt('.brm-ask'), key = Object.keys(MAP).find((k) => a.includes(k)), wrong = MAP[key] === 'occipital' ? 'cerebellum' : 'occipital';
    await part(wrong);
    check((await txt('.brm-res')).startsWith('Not quite') && (await page.$$(R + '.brm-r.bad')).length === 1 && (await page.$$(R + '.brm-r.good')).length >= 1 && (await txt('.brm-score')) === '3 of 4 right, 0 in a row', 'brain: wrong answer shows the right part'); }
  check((await page.$$(R + '.sm-q')).length === 4, 'brain: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /^(\d):/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `brain: quiz ${i}`);
  }
};
