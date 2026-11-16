// #1071 decay-dice
export const path = '/learn/decay-dice/';
export default async ({ page, check, BASE }) => {
  const R = '.dcd ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForTimeout(500);
  check((await t('.dd-big')) === '600 of 600 left after 0 throws', 'dice: start with 600');
  check((await t('.dd-eq')).includes('t½ = ln 2 / λ = 0.6931 / 0.1823 = 3.802 throws') && (await t('.dd-facts')).includes('keep throwing'), 'dice: expected half-life 3.802 throws (Python)');
  for (let i = 0; i < 4; i++) await page.click(R + '.dd-one');
  await page.waitForTimeout(100);
  { const m = (await t('.dd-big')).match(/^(\d+) of 600 left after 4 throws$/), n = m ? +m[1] : NaN;
    check(n > 220 && n < 360, `dice: about 289 left after 4 throws (${n})`);
    check((await t('.dd-eq')).includes('= 289.4 expected'), 'dice: expected 289.4 after 4 throws'); }
  for (let i = 0; i < 3; i++) await page.click(R + '.dd-one');
  { const f = await t('.dd-facts'), m = f.match(/throws([\d.]+) throws/), h = m ? +m[1] : NaN;
    check(h > 2.8 && h < 5, `dice: measured half-life near 3.8 (${h})`); }
  check((await page.$$eval(R + '.dd-tab tbody tr', (r) => r.length)) === 8, 'dice: table of the last 8 throws');
  await page.click(R + '.dd-auto'); await page.waitForTimeout(1200);
  check((await t('.dd-auto')) === 'Stop', 'dice: keep throwing');
  await page.click(R + '.dd-auto');
  check((await t('.dd-auto')) === 'Keep throwing' && /after (9|1\d) throws/.test(await t('.dd-big')), 'dice: stop');
  await page.selectOption(R + '.dd-p', '0.5'); await page.waitForTimeout(100);
  check((await t('.dd-big')) === '600 of 600 left after 0 throws' && (await t('.dd-facts')).includes('1 throws'), 'dice: coins, half-life 1 throw');
  await page.selectOption(R + '.dd-p', '0.05'); await page.waitForTimeout(100);
  check((await t('.dd-facts')).includes('13.51 throws'), 'dice: 20-sided half-life 13.51');
  await page.$eval(R + '.dd-N', (e) => { e.value = '50'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await t('.dd-big')) === '50 of 50 left after 0 throws', 'dice: 50 dice');
  await page.click(R + '.dd-reset');
  const inked = await page.$eval(R + '.dd-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 140 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 200, `dice: grid drawn (${inked})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'dice: five questions');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  { const a = +(await items[4].getAttribute('data-ans')); await (await items[4].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'dice: all five answered right');

  // "Solve my numbers" card helpers
  const sv = (ns, root = '') => ({
    ans: () => page.textContent(`${root}[data-k="${ns}-answer"]`),
    work: () => page.textContent(`${root}[data-k="${ns}-working"]`),
    find: (v) => page.selectOption(`${root}[data-k="${ns}-find"]`, v),
    ex: (i) => page.selectOption(`${root}[data-k="${ns}-example"]`, String(i)),
    ch: (k, v) => page.selectOption(`${root}[data-k="${ns}-${k}"]`, v),
    set: async (k, v, u) => { await page.fill(`${root}[data-k="${ns}-${k}"]`, v); if (u) await page.selectOption(`${root}[data-k="${ns}-${k}-unit"]`, u); },
    clear: () => page.click(`${root}.sv-clear`),
  });
  {
    const h = sv('hl');
    await page.locator('[data-k="hl-answer"]').scrollIntoViewIfNeeded();
    const a0 = await h.ans();
    check(a0.includes('The amount left is 10 ') && a0.includes('12.5% of the start'), `half-life: first example (${a0})`);
    check((await h.work()).includes('n = t ÷ T = 15 days ÷ 5 days = 3'), 'half-life: working shows n = 3');
    await h.ex(1); check((await h.ans()).startsWith('The time needed is 36 h') && (await h.ans()).includes('3 half-lives'), `half-life: find time (${await h.ans()})`);
    await h.ex(2); check((await h.ans()) === 'The half-life is 5 min.', `half-life: find half-life (${await h.ans()})`);
    await h.ex(3); check((await h.ans()).startsWith('The starting amount was 100 '), `half-life: find start (${await h.ans()})`);
    await h.ex(4); check((await h.ans()).startsWith('The amount left is 25 '), `half-life: carbon-14 (${await h.ans()})`);
    // Mixed units: 100 left after 2 days with T = 12 h is 4 half-lives: 6.25
    await h.clear(); await h.find('N'); await h.set('N0', '100'); await h.set('t', '2', 'days'); await h.set('T', '12', 'h');
    check((await h.ans()).startsWith('The amount left is 6.25 '), `half-life: days against hours (${await h.ans()})`);
    check((await h.work()).includes('Put t and T in one unit'), 'half-life: mixed units explained');
    // Not a whole number of half-lives: 100 after 1 half-life-and-a-half = 100 * 2^-1.5 = 35.4
    await h.set('t', '18', 'h'); check((await h.ans()).startsWith('The amount left is 35.4 '), `half-life: fractional n (${await h.ans()})`);
    // Edge cases
    await h.find('t'); await h.clear(); await h.set('N0', '100'); await h.set('N', '200'); await h.set('T', '5', 'days');
    check((await h.ans()).includes('bigger than the start'), `half-life: more left than start (${await h.ans()})`);
    await h.set('N', '0'); check((await h.ans()).includes('never reaches exactly zero'), 'half-life: zero left');
    await h.find('N'); await h.clear(); await h.set('N0', '100'); await h.set('t', '-1', 'days'); await h.set('T', '5', 'days');
    check((await h.ans()).includes('Time cannot be negative'), 'half-life: negative time');
    await h.set('t', '1', 'days'); await h.set('T', '0', 'days'); check((await h.ans()).includes('half-life must be above zero'), 'half-life: zero half-life');
    await h.clear(); check((await h.ans()).startsWith('Fill in'), 'half-life: blank asks for numbers');
    check(!/NaN|Infinity/.test(await page.textContent('.dd-solve')), 'half-life: never NaN or Infinity');
  }
};
