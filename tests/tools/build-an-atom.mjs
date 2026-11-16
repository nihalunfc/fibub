// #1081 Build an atom
export const path = '/learn/build-an-atom/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/build-an-atom/`); await page.waitForSelector('.bat .bat-svg circle');
  const big = () => page.textContent('.bat .bat-big'), facts = () => page.textContent('.bat .bat-facts'), eq = () => page.textContent('.bat .bat-eq');
  const tap = async (k, sign, times = 1) => { const b = page.locator(`.bat .bat-r[data-k=${k}] .bat-${sign === '+' ? 'plus' : 'minus'}`); await b.scrollIntoViewIfNeeded(); for (let i = 0; i < times; i++) await b.click(); };
  check((await big()).includes('⁷Li') && (await big()).includes('Lithium'), 'atom: starts as lithium-7');
  check(await page.locator('.bat .bat-svg circle.p').count() === 3 && await page.locator('.bat .bat-svg circle.n').count() === 4 && await page.locator('.bat .bat-svg circle.el').count() === 3, 'atom: picture has 3 p, 4 n, 3 e');
  await page.selectOption('.bat .bat-pick', '11');
  { const f = await facts(); check((await big()).includes('²³Na') && f.includes('Sodium (Na)') && f.includes('K 2, L 8, M 1') && f.includes('written 2,8,1') && f.includes('Valency of sodium1loses') && f.includes('100 %'), 'atom: sodium example ' + f.slice(0, 120)); }
  check((await eq()).includes('11 + 12 = 23') && (await eq()).includes('11 − 11 = 0'), 'atom: formulas with live numbers');
  await tap('e', '-');
  { const f = await facts(); check((await big()).includes('²³Na⁺') && f.includes('+1') && f.includes('cation') && f.includes('K 2, L 8') && (await eq()).includes('11 − 10 = +1'), 'atom: Na+ after removing an electron'); }
  check(await page.locator('.bat .bat-svg circle.el').count() === 10, 'atom: picture lost one electron');
  await page.click('.bat .bat-neutral'); check(!(await big()).includes('⁺'), 'atom: make it neutral');
  await page.selectOption('.bat .bat-pick', '6'); await tap('n', '+', 2);
  { const f = await facts(); check((await big()).includes('¹⁴C') && f.includes('Carbon-14') && f.includes('carbon dating'), 'atom: carbon-14 isotope'); }
  await page.selectOption('.bat .bat-pick', '17'); await tap('e', '+');
  check((await big()).includes('³⁵Cl⁻') && (await facts()).includes('anion') && (await facts()).includes('M 8'), 'atom: chloride ion');
  await page.selectOption('.bat .bat-pick', '1'); await tap('p', '-');
  check(await page.locator('.bat .bat-r[data-k=p] .bat-minus').isDisabled() && (await page.textContent('.bat .bat-desc')).includes('lone neutron') === false, 'atom: minus disabled at zero protons');
  check((await page.textContent('.bat .bat-desc')).includes('add a proton') || (await page.textContent('.bat .bat-desc')).includes('lone neutron'), 'atom: empty atom message');
  // Check yourself: reveal each answer, type it, it is marked right.
  const items = page.locator('.bat .cq-item'); const n = await items.count();
  check(n === 5, 'atom: five practice questions');
  let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(right === n, `atom: every worked answer is accepted (${right}/${n})`);
  await items.nth(0).locator('.cq-in').fill('999'); await items.nth(0).locator('.cq-check').click();
  check((await items.nth(0).locator('.cq-res').textContent()).startsWith('Not quite'), 'atom: a wrong answer is marked');
  const q0 = await items.nth(0).locator('.cq-q').textContent(); let changed = false;
  for (let k = 0; k < 5 && !changed; k++) { await page.click('.bat .cq-new'); changed = (await items.nth(0).locator('.cq-q').textContent()) !== q0 || (await items.nth(2).locator('.cq-q').textContent()) !== q0; }
  check(changed && (await items.nth(0).locator('.cq-res').isHidden()), 'atom: new questions');
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/build-an-atom/`); await page.waitForTimeout(600);
  {
  const S = '.bat-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  await pre(0);
  check((await ans()) === 'Sodium atom: 11 protons, 12 neutrons, 11 electrons.' && (await work()).includes('Neutrons = A − Z = 23 − 11 = 12') && (await work()).includes('2, 8, 1'), `atom solve: sodium (${await ans()})`);
  await pre(1); check((await ans()) === 'Chlorine negative ion (anion): 17 protons, 18 neutrons, 18 electrons.', `atom solve: chloride (${await ans()})`);
  await pre(2); check((await ans()) === 'Magnesium positive ion (cation): 12 protons, 12 neutrons, 10 electrons.', `atom solve: magnesium ion (${await ans()})`);
  await pre(3); check((await ans()) === 'The average atomic mass is 35.5 u.' && (await work()).includes('3550 ÷ 100 = 35.5'), `atom solve: chlorine average (${await ans()})`);
  await pre(4); check((await ans()) === 'The isotope of mass 10 is 20 % and the one of mass 11 is 80 %.', `atom solve: boron abundance (${await ans()})`);
  await pre(0); await page.fill(S + '[data-k="sv-A"]', '5'); check((await ans()).includes('cannot be smaller than the atomic number'), `atom solve: A below Z (${await ans()})`);
  await page.fill(S + '[data-k="sv-Z"]', '0'); await page.fill(S + '[data-k="sv-A"]', '1'); check((await ans()).includes('1 to 118'), `atom solve: Z of 0 (${await ans()})`);
  await pre(3); await page.fill(S + '[data-k="sv-ab"]', '50 20'); check((await ans()).includes('add up to 70'), `atom solve: abundances must add to 100 (${await ans()})`);
  }
};
