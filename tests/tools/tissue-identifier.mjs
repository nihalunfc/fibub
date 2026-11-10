// #1255 Tissue identifier
export const path = '/learn/tissue-identifier/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/tissue-identifier/?seed=7`); await page.waitForSelector('.tz .tz-fig circle');
  const R = '.tz ', txt = (s) => page.textContent(R + s);
  check((await txt('.tz-name')) === 'Parenchyma' && (await page.$$(R + '.tz-chips button')).length === 15 && (await page.$$(R + '.tz-fig .tz-mk')).length === 3, 'tissue: starts on parenchyma with 3 features');
  await page.click(R + '.tz-fig .tz-mk >> nth=0');
  check((await txt('.tz-cap')) === '1. Spaces between the cells' && (await page.$$(R + '.tz-feats li.on')).length === 1, 'tissue: tap a feature');
  const pics = new Set();
  for (const id of ['meristem', 'parenchyma', 'collenchyma', 'sclerenchyma', 'xylem', 'phloem', 'epidermis', 'squamous', 'columnar', 'blood', 'bone', 'skeletal', 'smooth', 'cardiac', 'neuron']) {
    await page.click(`${R}.tz-chips [data-t=${id}]`);
    pics.add(await page.$eval(R + '.tz-fig', (s) => s.innerHTML.length + ':' + s.childElementCount));
  }
  check(pics.size === 15, `tissue: 15 different drawings (${pics.size})`);
  check((await txt('.tz-name')) === 'Nervous tissue (neuron)' && (await txt('.tz-where')).includes('spinal cord'), 'tissue: neuron facts');
  await page.click(R + '.tz-feats li:nth-child(3) button');
  check((await txt('.tz-cap')).startsWith('3. Axon'), 'tissue: feature list button');
  check((await page.$$(R + '.tz-mus tr')).length === 7, 'tissue: muscle table');
  // Identify: answer wrong, then right.
  await page.click(R + '.tz-mode [data-m=identify]');
  check(await page.isHidden(R + '.tz-pick') && await page.isHidden(R + '.tz-about') && (await page.$$(R + '.tz-opts button')).length === 4 && (await page.$$(R + '.tz-fig .tz-mk')).length === 0, 'tissue: identify hides the name and marks');
  const ids = await page.$$eval(R + '.tz-opts button', (b) => b.map((x) => x.dataset.t));
  const picked = ids[0];
  await page.click(`${R}.tz-opts [data-t=${picked}]`);
  const fb = await txt('.tz-fb');
  check(/^(Right|Not this time)/.test(fb) && (await page.$$(R + '.tz-opts button.ok')).length === 1 && await page.isVisible(R + '.tz-about') && (await page.$$(R + '.tz-fig .tz-mk')).length >= 2, `tissue: answered (${fb})`);
  check((await txt('.tz-score')).startsWith(fb.startsWith('Right') ? '1 of 1' : '0 of 1'), 'tissue: score');
  const okId = await page.$eval(R + '.tz-opts button.ok', (b) => b.dataset.t);
  check(fb.startsWith('Right') === (okId === picked), 'tissue: the green answer is the right one');
  await page.click(R + '.tz-next');
  check((await txt('.tz-fb')) === '' && (await page.$$(R + '.tz-opts button.ok')).length === 0, 'tissue: next drawing');
  await page.click(R + '.tz-mode [data-m=explore]');
  check(await page.isVisible(R + '.tz-pick'), 'tissue: back to explore');
  const items = await page.$$(R + '.lq-item');
  for (const [i, it] of items.entries()) {
    const ans = Number(await it.getAttribute('data-ans')), ch = await it.$$('.lq-choice'); await ch[ans].click();
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', `tissue: quiz ${i + 1}`);
  }
  check(items.length === 4, 'tissue: four questions');
};
