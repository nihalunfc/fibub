// #1437 Glucose ring flipper
export const path = '/learn/sugar-structures/';
export default async ({ page, check, BASE }) => {
  const R = '.sgs ';
  await page.goto(`${BASE}/learn/sugar-structures/`); await page.waitForTimeout(500);
  const say = () => page.textContent(R + '.sgs-say');
  const col = (i) => page.$$eval(R + '.sgs-tab tbody tr', (t, i) => t.map((r) => r.cells[i].textContent).join(','), i);
  check((await say()).startsWith('C2: –OH on the right in the Fischer projection → down'), 'sgs: C2 right → down');
  check((await col(2)) === 'down,down,up,down,ring O; CH₂OH up', `sgs: α-D-glucose table (${await col(2)})`);
  check((await page.$$eval(R + '.sgs-svg text', (t) => t.length)) > 20, 'sgs: drawing made');
  await page.click(R + '.sgs-an button[data-v=beta]'); await page.waitForTimeout(150);
  check((await col(2)).startsWith('up,down,up,down'), 'sgs: β C1 up');
  await page.click(R + '.sgs-c[data-c="1"]'); await page.waitForTimeout(150);
  check((await say()).includes('anomeric') && (await say()).includes('points up') && (await say()).includes('same face'), 'sgs: C1 explained');
  // tap C3 in the Fischer drawing
  const row = page.locator(R + '.sgs-row[data-c="3"] rect'); await row.scrollIntoViewIfNeeded(); await row.click(); await page.waitForTimeout(150);
  check((await say()).startsWith('C3: –OH on the left') && (await page.getAttribute(R + '.sgs-c[data-c="3"]', 'aria-pressed')) === 'true', 'sgs: tap Fischer row');
  await page.selectOption(R + '.sgs-sugar', 'galactose'); await page.waitForTimeout(150);
  check((await col(2)).startsWith('up,down,up,up'), 'sgs: galactose C4 up');
  await page.selectOption(R + '.sgs-sugar', 'l-glucose'); await page.click(R + '.sgs-c[data-c="5"]'); await page.waitForTimeout(150);
  check((await say()).includes('an L sugar') && (await say()).includes('points down'), 'sgs: L sugar');
  // mutarotation
  check((await page.textContent(R + '.sgs-mix')).endsWith('= +112.0°'), 'sgs: starts at +112');
  await page.fill(R + '.sgs-time', '60'); await page.dispatchEvent(R + '.sgs-time', 'input'); await page.waitForTimeout(150);
  const mix = await page.textContent(R + '.sgs-mix');
  check(/= \+8[12]\.\d°$/.test(mix), `sgs: 60 min (${mix})`);
  check((await page.textContent(R + '.sgs-facts')).includes('36.4 % α, 63.6 % β'), 'sgs: equilibrium shares');
  await page.click(R + '.sgs-start button[data-v=beta]'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.sgs-mix')).endsWith('= +18.7°') && (await page.inputValue(R + '.sgs-time')) === '0', 'sgs: start β');
  await page.click(R + '.sgs-play'); await page.waitForTimeout(1200); await page.click(R + '.sgs-play');
  check(Number(await page.inputValue(R + '.sgs-time')) > 10, 'sgs: play moves time');
  const px = await page.$eval(R + '.sgs-cv', (c) => c.toDataURL().length); check(px > 5000, 'sgs: graph drawn');
  // quiz
  const items = page.locator(R + '.lq-item'); const n = await items.count(); let ok = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i), ans = Number(await it.getAttribute('data-ans'));
    if (await it.locator('.lq-choice').count()) await it.locator('.lq-choice').nth(ans).click();
    else { await it.locator('.lq-in').fill(ans.toFixed(3)); await it.locator('.lq-check').click(); }
    if ((await it.locator('.lq-fb').textContent()) === 'Right.') ok++;
  }
  check(n === 5 && ok === 5, `sgs: quiz ${ok}/${n}`);
};
