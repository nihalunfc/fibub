// #1365 Markovnikov addition predictor (logic in tests/sci-tools/markovnikov-addition.mjs)
export const path = '/learn/markovnikov-addition/';
export default async ({ page, check, BASE }) => {
  const R = '.mkx ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/markovnikov-addition/`); await page.waitForTimeout(400);
  check((await t('.mk-big')) === 'Propene + HBr → 2-bromopropane', `markov: propene (${await t('.mk-big')})`);
  check((await t('.mk-opts')).includes('CH₃–C⁺H–CH₃') && (await t('.mk-opts')).includes('6 α-H') && (await t('.mk-win')).includes('Secondary (2°) carbocation'), `markov: cation cards (${await t('.mk-opts')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.mk-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 1] > 80 && d[i] < 60 && d[i + 2] < 90) n++; return n; });
  check(px > 50, `markov: green path drawn (${px} px)`);
  await page.check(R + '.mk-px');
  check((await t('.mk-big')) === 'Propene + HBr → 1-bromopropane' && (await t('.mk-prod')).includes('Anti-Markovnikov') && (await t('.mk-opts')).includes('CH₃–C•H–CH₃'), `markov: peroxide (${await t('.mk-big')})`);
  check((await t('.mk-s2')).includes('CH₃–CH₂–CH₂Br'), `markov: radical step (${await t('.mk-s2')})`);
  await page.selectOption(R + '.mk-r', 'HCl'); check((await t('.mk-big')) === 'Propene + HCl → 2-chloropropane', 'markov: HCl ignores peroxide');
  await page.selectOption(R + '.mk-r', 'H2O'); check((await t('.mk-big')).endsWith('propan-2-ol') && await page.isHidden(R + '.mk-px-l'), 'markov: hydration');
  await page.selectOption(R + '.mk-a', 'methylpropene'); await page.selectOption(R + '.mk-r', 'HBr');
  check((await t('.mk-big')) === '2-Methylpropene + HBr → 1-bromo-2-methylpropane', `markov: methylpropene with peroxide (${await t('.mk-big')})`);
  await page.uncheck(R + '.mk-px'); check((await t('.mk-big')).endsWith('2-bromo-2-methylpropane') && (await t('.mk-opts')).includes('Tertiary'), 'markov: tertiary');
  await page.selectOption(R + '.mk-a', 'but2ene'); check((await page.$$eval(R + '.mk-opt', (e) => e.length)) === 1 && (await t('.mk-prod')).includes('only one product'), 'markov: symmetric');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 3, 'markov: three quiz questions');
  await page.click(R + '.smq-q:nth-child(3) .smq-choices button:nth-child(1)'); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', 'markov: quiz answer');
};
