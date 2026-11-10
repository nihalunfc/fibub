// #1387 animal classification key (key checked in tests/sci-tools/animal-key.mjs)
export const path = '/learn/animal-key/';
export default async ({ page, check, BASE }) => {
  const R = '.akey ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/animal-key/`); await page.waitForTimeout(400);
  check((await t('.ak-q')) === 'How are the cells organised?' && (await t('.ak-title')) === 'Follow the branches', 'key: starts at Q1');
  check((await page.$$eval(R + '.ak-tree .ak-t', (e) => e.length)) === 11, 'key: 11 phyla in the tree');
  await page.click(R + '.ak-opts button:nth-child(2)'); await page.click(R + '.ak-opts button:nth-child(2)');
  check((await t('.ak-q')) === 'What kind of body cavity?' && (await page.$$eval(R + '.ak-e.ak-hot', (e) => e.length)) === 2, 'key: two answers, path drawn');
  await page.click(R + '.ak-opts button:nth-child(2)');
  check((await t('.ak-title')) === 'Phylum Aschelminthes (Nematoda)' && await page.isHidden(R + '.ak-ask'), `key: reaches roundworms (${await t('.ak-title')})`);
  await page.click(R + '.ak-back');
  check((await t('.ak-q')) === 'What kind of body cavity?', 'key: back one step');
  await page.click(R + '.ak-reset');
  check((await t('.ak-q')) === 'How are the cells organised?', 'key: start again');
  await page.selectOption(R + '.ak-an', 'starfish');
  check((await t('.ak-title')) === 'Phylum Echinodermata' && (await page.$$eval(R + '.ak-path li', (e) => e.length)) === 3 && (await t('.ak-leaf')).includes('Starfish belongs here'), 'key: starfish');
  await page.selectOption(R + '.ak-an', 'earthworm');
  check((await t('.ak-title')) === 'Phylum Annelida' && (await page.$$eval(R + '.ak-path li', (e) => e.length)) === 6, 'key: earthworm, six answers');
  await page.selectOption(R + '.ak-an', 'balanoglossus');
  check((await t('.ak-title')) === 'Phylum Hemichordata', 'key: acorn worm');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'key: five quiz questions');
  await page.click(R + '.smq-q:nth-child(2) .smq-choices button:nth-child(1)'); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'key: quiz answer');
};
