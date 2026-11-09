// #1082 Electron configuration filler
export const path = '/learn/electron-configuration/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/electron-configuration/`); await page.waitForSelector('.ecf .ecf-svg rect.bx');
  const big = () => page.textContent('.ecf .ecf-big'), facts = () => page.textContent('.ecf .ecf-facts'), qn = () => page.textContent('.ecf .ecf-q'), msg = () => page.textContent('.ecf .ecf-msg');
  const box = (sub, i) => page.locator(`.ecf rect.bx[data-sub="${sub}"][data-box="${i}"]`);
  const tapBox = async (sub, i) => { await box(sub, i).scrollIntoViewIfNeeded(); await box(sub, i).click(); };
  check((await big()) === '1s² 2s² 2p⁴' && (await facts()).includes('[He] 2s² 2p⁴') && (await facts()).includes('Unpaired electrons2'), 'econfig: starts on oxygen');
  check(await page.locator('.ecf path.ar').count() === 8, 'econfig: 8 arrows drawn for oxygen');
  await page.click('.ecf .ecf-minus');
  check((await big()) === '1s² 2s² 2p³' && (await qn()).includes('Electron 7 (2p, box 3, spin up): n = 2, l = 1, ml = +1, ms = +½'), 'econfig: nitrogen worked example and last electron');
  await page.selectOption('.ecf .ecf-el', '24');
  check((await big()).endsWith('4s¹ 3d⁵') && await page.isVisible('.ecf .ecf-exc') && (await page.textContent('.ecf .ecf-exc')).includes('[Ar] 3d⁴ 4s²') && (await page.textContent('.ecf .ecf-exc')).includes('half full') && (await facts()).includes('Unpaired electrons6'), 'econfig: chromium exception');
  await page.selectOption('.ecf .ecf-el', '29');
  check((await page.textContent('.ecf .ecf-exc')).includes('completely full') && (await facts()).includes('[Ar] 3d¹⁰ 4s¹'), 'econfig: copper exception');
  await page.locator('.ecf .ecf-range').fill('19');
  check((await big()).endsWith('4s¹') && await page.isHidden('.ecf .ecf-exc') && (await qn()).includes('n = 4, l = 0, ml = 0'), 'econfig: slider to potassium');
  await tapBox('1s', 0); check((await qn()).includes('(1s, box 1, spin up): n = 1, l = 0, ml = 0, ms = +½'), 'econfig: tap an arrow for quantum numbers');
  await tapBox('1s', 0); check((await qn()).includes('spin down') && (await qn()).includes('ms = −½'), 'econfig: tap again for the paired electron');
  await tapBox('3d', 0); check((await qn()).includes('empty'), 'econfig: empty box');
  // Fill it yourself
  await page.selectOption('.ecf .ecf-el', '7'); await page.click('.ecf .ecf-mode [data-m=self]');
  check((await msg()).includes('Place 7 electrons for Nitrogen') && await page.locator('.ecf path.ar').count() === 0, 'econfig: self mode starts empty');
  await tapBox('2s', 0); check((await msg()).startsWith('Aufbau principle: fill 1s first'), 'econfig: Aufbau refused');
  await tapBox('1s', 0); await tapBox('1s', 0); await tapBox('1s', 0);
  check((await msg()).startsWith('Pauli exclusion principle'), 'econfig: Pauli refused');
  await tapBox('2s', 0); await tapBox('2s', 0); await tapBox('2p', 0); await tapBox('2p', 0);
  check((await msg()).startsWith("Hund's rule"), 'econfig: Hund refused');
  await tapBox('2p', 1); await page.click('.ecf .ecf-undo'); await tapBox('2p', 1); await tapBox('2p', 2);
  check((await msg()).startsWith('Done! That is Nitrogen') && (await big()) === '1s² 2s² 2p³', 'econfig: nitrogen filled by hand');
  await tapBox('3s', 0); check((await msg()).includes('All 7 electrons are placed'), 'econfig: no more than Z');
  await page.click('.ecf .ecf-clear'); check(await page.locator('.ecf path.ar').count() === 0, 'econfig: start again');
  await page.click('.ecf .ecf-mode [data-m=watch]'); check(await page.locator('.ecf path.ar').count() === 7, 'econfig: back to watch');
  // Check yourself
  const items = page.locator('.ecf .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `econfig: every worked answer accepted (${right}/${n})`);
  await items.nth(0).locator('.cq-in').fill('1s2 2s9'); await items.nth(0).locator('.cq-check').click();
  check((await items.nth(0).locator('.cq-res').textContent()).startsWith('Not quite'), 'econfig: wrong configuration marked');
};
