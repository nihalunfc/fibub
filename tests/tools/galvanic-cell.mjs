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
  const items = page.locator('.gc .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `galvanic: every worked answer accepted (${right}/${n})`);
};
