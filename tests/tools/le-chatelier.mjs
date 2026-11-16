// #1087 Le Chatelier sandbox
export const path = '/learn/le-chatelier/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/le-chatelier/`); await page.waitForSelector('.lc .lc-svg rect.bx');
  const big = () => page.textContent('.lc .lc-big'), why = () => page.textContent('.lc .lc-why'), ice = () => page.textContent('.lc .lc-ice'), eq = () => page.textContent('.lc .lc-eq'), facts = () => page.textContent('.lc .lc-facts');
  const tap = async (sel) => { const b = page.locator(`.lc ${sel}`); await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(1100); };
  check((await big()) === 'At equilibrium. Change something.' && (await facts()).includes('0.514 mol') && (await facts()).includes('0.972 mol') && (await eq()).includes('= 0.5'), 'lechatelier: Haber start equilibrium');
  await tap('[data-c=squeeze]');
  check((await big()) === 'You halved the volume: shifts right →' && (await why()).includes('Q jumps to 0.125') && (await ice()).includes('−3x') && (await ice()).includes('+2x'), 'lechatelier: squeeze worked example');
  check((await page.textContent('.lc .lc-qk')).includes('Q = 0.5') && (await page.textContent('.lc .lc-svg')).includes('V = 0.5 L'), 'lechatelier: Q settles back to K');
  const nh3 = async () => Number((await facts()).match(/NH₃([\d.]+) mol/)[1]);
  const a = await nh3(); check(a > 0.972, 'lechatelier: more ammonia after squeezing ' + a);
  await tap('[data-c=heat]'); check((await big()).includes('heated by 50 K: ← shifts left') && (await why()).includes('exothermic') && (await nh3()) < a, 'lechatelier: heat Haber');
  await tap('[data-c=catalyst]'); check((await big()).includes('no shift') && (await why()).includes('catalyst'), 'lechatelier: catalyst');
  await tap('[data-c=reset]'); check((await big()) === 'At equilibrium. Change something.', 'lechatelier: start again');
  await tap('.lc-sp [data-c=add][data-i="0"]'); check((await big()).includes('added 0.5 mol N₂: shifts right →') && (await why()).includes('Q < K'), 'lechatelier: add N2');
  await tap('.lc-sp [data-c=remove][data-i="2"]'); check((await big()).includes('removed 0.5 mol NH₃: shifts right →'), 'lechatelier: remove NH3');
  await page.selectOption('.lc .lc-rx', 'hi'); await page.waitForTimeout(200);
  await tap('[data-c=squeeze]'); check((await big()).includes('no shift') && (await why()).includes('same number of gas molecules'), 'lechatelier: HI squeeze no shift');
  await page.selectOption('.lc .lc-rx', 'n2o4'); await page.waitForTimeout(200);
  const brown0 = await page.locator('.lc .lc-svg rect.brown').count();
  await tap('[data-c=heat]'); check((await big()).includes('shifts right') && (await why()).includes('endothermic') && (await page.locator('.lc .lc-svg rect.brown').count()) > brown0, 'lechatelier: heat N2O4 more brown NO2');
  await tap('[data-c=expand]'); await tap('[data-c=expand]'); check(await page.locator('.lc [data-c=expand]').isDisabled(), 'lechatelier: volume limit');
  const items = page.locator('.lc .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `lechatelier: every worked answer accepted (${right}/${n})`);
  // Solve my numbers card
  const S = (k) => `.lc .lc-solve [data-k="${k}"]`, ans = () => page.textContent(S('answer')), wk = () => page.textContent(S('working'));
  check((await ans()) === 'The equilibrium shifts to the right, towards the products.' && (await wk()).includes('left = 4, right = 2'), `lc solve: pressure on ammonia (${await ans()})`);
  await page.selectOption(S('example'), '1'); check((await ans()) === 'The equilibrium shifts to the left, towards the reactants.' && (await wk()).includes('K decreases'), `lc solve: cooling endothermic (${await ans()})`);
  await page.selectOption(S('example'), '2'); check((await ans()).startsWith('No shift: equal moles of gas'), `lc solve: equal moles (${await ans()})`);
  await page.selectOption(S('example'), '3'); check((await ans()).startsWith('No shift') && (await wk()).includes('constant volume'), `lc solve: inert gas (${await ans()})`);
  await page.selectOption(S('example'), '4'); check((await ans()).includes('to the right') && (await wk()).includes('Q falls below K'), `lc solve: add reactant (${await ans()})`);
  await page.selectOption(S('change'), 'catalyst'); check((await ans()).startsWith('No shift: a catalyst'), `lc solve: catalyst (${await ans()})`);
  await page.selectOption(S('change'), 'inertP'); await page.fill(S('nr'), '1'); await page.fill(S('np'), '2'); check((await ans()).includes('to the right'), `lc solve: inert gas at constant pressure (${await ans()})`);
  await page.fill(S('np'), '1.5'); check((await ans()).includes('whole numbers'), 'lc solve: fractional moles refused');
  await page.selectOption(S('find'), 'qk'); await page.selectOption(S('example'), '5'); check((await ans()) === 'Q > K, so the reaction shifts to the left (reverse) until Q = K.', `lc solve: Q vs K (${await ans()})`);
  await page.fill(S('Q'), '0.5'); check((await ans()).startsWith('Q equals K'), 'lc solve: Q equals K');
  await page.fill(S('K'), '0'); check((await ans()).includes('more than 0'), 'lc solve: K zero refused');
  await page.selectOption(S('find'), 'vh'); await page.selectOption(S('example'), '6'); check((await ans()) === 'K at the new temperature is 0.328 (bigger than before).' && (await wk()).includes('= 1.19'), `lc solve: van 't Hoff (${await ans()})`);
  await page.fill(S('T2'), '330'); check((await ans()).includes('must be different'), 'lc solve: equal temperatures');
};
