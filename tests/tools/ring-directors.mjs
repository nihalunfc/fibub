// #1366 Ortho, para and meta directors (logic in tests/sci-tools/ring-directors.mjs)
export const path = '/learn/ring-directors/';
export default async ({ page, check, BASE }) => {
  const R = '.rdx ';
  const t = (s) => page.textContent(R + s);
  const tap = async (id) => { const b = page.locator(R + `.rd-subs button[data-s="${id}"]`); await b.scrollIntoViewIfNeeded(); await b.click(); };
  await page.goto(`${BASE}/learn/ring-directors/`); await page.waitForTimeout(400);
  check((await t('.rd-big')) === '–CH₃ sends the new group ortho and para', `directors: toluene (${await t('.rd-big')})`);
  check((await t('.rd-facts')).includes('1-methyl-2-nitrobenzene and 1-methyl-4-nitrobenzene') && (await t('.rd-facts')).includes('a little faster than benzene'), `directors: toluene facts (${await t('.rd-facts')})`);
  const green = async (sel) => page.evaluate((sel) => { const c = document.querySelector(sel); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 1] > 80 && d[i] < 60 && d[i + 2] < 90) n++; return n; }, sel);
  check((await green('.rd-fig')) > 300, 'directors: target positions shaded green');
  await tap('NO2'); await page.selectOption(R + '.rd-e', 'bromination');
  check((await t('.rd-big')) === '–NO₂ sends the new group meta' && (await t('.rd-facts')).includes('1-bromo-3-nitrobenzene') && (await t('.rd-facts')).includes('much slower'), `directors: nitrobenzene (${await t('.rd-facts')})`);
  check((await t('.rd-rh')).includes('pulls electrons'), 'directors: −R explanation');
  await tap('Cl'); await page.selectOption(R + '.rd-e', 'chlorination');
  check((await t('.rd-facts')).includes('1,2-dichlorobenzene and 1,4-dichlorobenzene') && (await t('.rd-facts')).includes('deactivating group'), 'directors: chlorobenzene');
  await tap('OH'); await page.selectOption(R + '.rd-e', 'nitration');
  check((await t('.rd-facts')).includes('2-nitrophenol and 4-nitrophenol') && (await t('.rd-rh')).includes('lone pair'), 'directors: phenol');
  await tap('COOH'); check((await t('.rd-facts')).includes('3-nitrobenzoic acid'), 'directors: benzoic acid');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 3, 'directors: three quiz questions');
  const q1 = await t('.smq-q:nth-child(1) .smq-text'); const op = /–(OH|NH₂|OCH₃|CH₃|Cl|Br) /.test(q1 + ' ');
  await page.click(R + `.smq-q:nth-child(1) .smq-choices button:nth-child(${op ? 1 : 2})`); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', `directors: quiz answer (${q1})`);
};
