// #1269 Dichotomous key explorer
export const path = '/learn/dichotomous-key/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/dichotomous-key/`); await page.waitForSelector('.dk .dk-gal button');
  const R = '.dk ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.dk-gal button')).length === 8 && (await txt('.dk-q')) === 'Does it have a backbone?', 'key: eight animals, first question');
  for (const a of ['yes', 'no', 'no', 'no', 'no']) await page.click(`${R}.dk-${a}`);
  check((await txt('.dk-res')) === 'It is a snake! (5 questions)' && (await page.$$(R + '.dk-path li')).length === 5 && await page.isDisabled(R + '.dk-yes'), 'key: snake in 5');
  await page.click(R + '.dk-gal [data-o=pigeon]');
  check((await txt('.dk-res')) === '' && (await page.$$(R + '.dk-path li')).length === 0, 'key: new mystery resets');
  await page.click(R + '.dk-yes'); await page.click(R + '.dk-no'); await page.click(R + '.dk-no'); await page.click(R + '.dk-yes');
  check((await txt('.dk-res')).includes('The key says frog') && (await txt('.dk-res')).includes('"Is it covered in feathers?" should be Yes'), `key: wrong answer explained (${await txt('.dk-res')})`);
  check((await page.$$(R + '.dk-ftree li.on')).length >= 4, 'key: route highlighted in the tree');
  await page.click(R + '.dk-rand');
  check(!(await page.$eval(R + '.dk-gal [data-o=pigeon]', (b) => b.getAttribute('aria-pressed') === 'true')), 'key: random mystery');
  await page.click(R + '.dk-mode [data-m=build]');
  check(await page.isVisible(R + '.dk-build') && (await page.$$(R + '.dk-grp div')).length === 8, 'key: build starts with all eight');
  const use = async (qid) => { await page.selectOption(R + '.dk-qs', qid); await page.click(R + '.dk-add'); };
  await use('backbone');
  check((await page.$$(R + '.dk-grp div')).length === 5, 'key: backbone splits off five');
  await use('six');
  check(await page.isVisible(R + '.dk-berr') && (await txt('.dk-berr')).includes("doesn't split"), 'key: useless question refused');
  await page.click(R + '.dk-undo');
  check((await page.$$(R + '.dk-grp div')).length === 8, 'key: undo');
  for (const qid of ['backbone', 'legs', 'wings', 'fur', 'fins', 'legs', 'wings']) await use(qid);
  check((await txt('.dk-bdone')).startsWith('Your key uses 7 questions') && await page.isVisible(R + '.dk-try'), `key: finished (${await txt('.dk-bdone')})`);
  await page.click(R + '.dk-try');
  check(await page.isVisible(R + '.dk-follow') && (await txt('.dk-q')) === 'Does it have a backbone?', 'key: follow my key');
  const items = await page.$$(R + '.lq-item');
  for (const [i, it] of items.entries()) {
    const ans = Number(await it.getAttribute('data-ans')), ch = await it.$$('.lq-choice');
    if (ch.length) await ch[ans].click(); else { await (await it.$('.lq-in')).fill(String(ans)); await (await it.$('.lq-check')).click(); }
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', `key: quiz ${i + 1}`);
  }
  check(items.length === 4, 'key: four questions');
};
