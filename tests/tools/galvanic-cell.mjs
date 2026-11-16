// #1089 Galvanic cell builder
export const path = '/learn/galvanic-cell/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/galvanic-cell/`); await page.waitForSelector('.gc .gc-svg .vm');
  const big = () => page.textContent('.gc .gc-big'), facts = () => page.textContent('.gc .gc-facts'), svgT = () => page.textContent('.gc .gc-svg');
  check((await big()) === 'E°cell = +1.10 V' && (await svgT()).includes('1.10') && (await svgT()).includes('Anode (−)'), 'galvanic: Daniell cell example');
  { const f = await facts(); check(f.includes('Zn(s) + Cu²⁺(aq) → Cu(s) + Zn²⁺(aq)') || f.includes('Cu²⁺(aq) + Zn(s) → Cu(s) + Zn²⁺(aq)'), 'galvanic: cell reaction ' + f.slice(0, 80)); check(f.includes('−213.0 kJ/mol') && f.includes('10^37.3') && f.includes('Zn(s) | Zn²⁺(aq) ‖ Cu²⁺(aq) | Cu(s)'), 'galvanic: ΔG, K, notation'); }
  check((await page.textContent('.gc .gc-eq')).includes('0.342 − (−0.762) = 1.104 V') || (await page.textContent('.gc .gc-eq')).includes('= 1.104 V'), 'galvanic: E° sum');
  check((await page.textContent('.gc .gc-svg')).includes('← NO₃⁻') && await page.locator('.gc .gc-svg .eflow').count() === 1, 'galvanic: salt bridge ions and electron flow');
  await page.locator('.gc .gc-cb').fill('-2');
  check((await page.textContent('.gc .gc-ob')) === '0.01 M' && (await page.textContent('.gc .gc-neq')).includes('= 100') && (await page.textContent('.gc .gc-neq')).includes('= 1.045 V') && (await svgT()).includes('1.04'), 'galvanic: Nernst with less copper ion');
  await page.locator('.gc .gc-cb').fill('0');
  await page.selectOption('.gc .gc-a', 'Ag'); await page.selectOption('.gc .gc-b', 'Mg');
  check((await big()) === 'E°cell = +3.17 V' && (await page.textContent('.gc .gc-sub')).startsWith('Mg is the anode') && (await svgT()).includes('Cathode (+)'), 'galvanic: magnesium–silver, anode on the right');
  await page.selectOption('.gc .gc-a', 'H2'); await page.selectOption('.gc .gc-b', 'Cu2');
  check((await page.textContent('.gc .gc-sub')).startsWith('The hydrogen electrode is the anode') && (await big()) === 'E°cell = +0.34 V', 'galvanic: hydrogen electrode');
  await page.selectOption('.gc .gc-b', 'H2'); check(await page.isVisible('.gc .gc-err') && (await page.textContent('.gc .gc-err')).includes('two different'), 'galvanic: same half-cell refused');
  await page.selectOption('.gc .gc-b', 'Zn');
  // typed concentrations, presets, own E° values
  await page.click('.gc .gc-chip[data-a="Zn"][data-b="Cu2"]');
  check((await big()) === 'E°cell = +1.10 V', 'galvanic: Daniell preset');
  await page.fill('.gc [data-k=conc-right]', '0.01');
  check((await page.textContent('.gc .gc-neq')).includes('= 1.045 V') && (await page.inputValue('.gc .gc-cb')) === '-2', 'galvanic: typed concentration moves slider and Nernst ' + (await page.textContent('.gc .gc-neq')));
  await page.fill('.gc [data-k=conc-right]', '0'); check(await page.isVisible('.gc .gc-err') && (await page.textContent('.gc .gc-err')).includes('above zero'), 'galvanic: zero concentration message');
  await page.fill('.gc [data-k=conc-right]', '1');
  await page.click('.gc .gc-chip[data-a="Mg"][data-b="Ag"]'); check((await big()) === 'E°cell = +3.17 V' && (await page.inputValue('.gc [data-k=conc-left]')) === '1', 'galvanic: Mg | Ag preset');
  const oa = () => page.textContent('.gc .gc-oans'), ow = () => page.textContent('.gc .gc-owork');
  check((await oa()) === 'E°cell = 1.10 V, so the reaction runs by itself as written.' && (await ow()).includes('= −212.3 kJ/mol') && (await ow()).includes('K = 10^37.2'), 'galvanic: own E° values ' + (await ow()));
  await page.fill('.gc [data-k=q]', '0.01'); check((await ow()).includes('= 1.159 V'), 'galvanic: own Nernst with Q ' + (await ow()));
  await page.fill('.gc [data-k=e-cathode]', '-0.76'); await page.fill('.gc [data-k=e-anode]', '0.34');
  check((await oa()).includes('−1.10 V is negative') && (await oa()).includes('Swap'), 'galvanic: negative E° message');
  await page.fill('.gc [data-k=n]', '0'); check(await page.isVisible('.gc .gc-oerr') && (await oa()) === '', 'galvanic: n must be a whole number');
  await page.fill('.gc [data-k=n]', ''); check(await page.isVisible('.gc .gc-oerr'), 'galvanic: blank n message');
  await page.selectOption('.gc .gc-a', 'Zn'); await page.selectOption('.gc .gc-b', 'Cu2');
  const items = page.locator('.gc .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `galvanic: every worked answer accepted (${right}/${n})`);
};
