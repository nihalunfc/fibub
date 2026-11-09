// #1083 pH scale explorer
export const path = '/learn/ph-scale-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ph-scale-explorer/`); await page.waitForSelector('.phx .phx-sw');
  const big = () => page.textContent('.phx .phx-big'), facts = () => page.textContent('.phx .phx-facts'), eq = () => page.textContent('.phx .phx-eq');
  const colour = (id) => page.textContent(`.phx .phx-sw[data-id="${id}"] .phx-cn`);
  check((await big()) === 'pH 7: neutral' && (await facts()).includes('the same'), 'ph: starts neutral (pure water)');
  const chip = async (id) => { const b = page.locator(`.phx .phx-chip[data-id="${id}"]`); await b.scrollIntoViewIfNeeded(); await b.click(); };
  await chip('lemon');
  check((await big()) === 'pH 2.2: strongly acidic' && (await facts()).includes('0.00631 mol/L') && (await facts()).includes('6.31 × 10⁴ × more H⁺') && (await eq()).includes('−log(0.00631) = 2.2'), 'ph: lemon juice worked example ' + (await facts()));
  check((await colour('blue-litmus')) === 'red' && (await colour('methyl-orange')) === 'red' && (await colour('phenolphthalein')) === 'colourless' && (await colour('turmeric')) === 'yellow' && (await colour('universal')) === 'red', 'ph: indicator colours for lemon');
  await page.selectOption('.phx .phx-dil', '100');
  check((await page.textContent('.phx .phx-dbig')) === 'pH 2.2 → 4.2' && (await page.textContent('.phx .phx-deq')).includes('2.2 + log(100) = 4.2'), 'ph: dilute 100 times');
  await page.selectOption('.phx .phx-dil', '10000000');
  check(/pH 2\.2 → 6\.9\d/.test(await page.textContent('.phx .phx-dbig')) && (await page.textContent('.phx .phx-deq')).includes('stops near 7'), 'ph: dilute 10 million times stays below 7');
  await chip('soap');
  check((await big()).startsWith('pH 10: basic') && (await colour('phenolphthalein')) === 'pink' && (await colour('turmeric')) === 'reddish-brown' && (await colour('red-litmus')) === 'blue', 'ph: soap is basic, indicators');
  check((await page.textContent('.phx .phx-dbig')).startsWith('pH 10 → 7.0'), 'ph: diluted base approaches 7');
  await page.selectOption('.phx .phx-dil', '1');
  await page.click('.phx .phx-lvl [data-l="11"]');
  check((await facts()).includes('[OH⁻]10⁻⁴ mol/L') && (await facts()).includes('pOH4') && (await eq()).includes('pOH = 14 − pH = 14 − 10 = 4') && await page.isVisible('.phx .phx-sw[data-id="phenolphthalein"] span:not(.phx-cn)'), 'ph: Class 11 level details');
  // drag on the scale
  const svg = page.locator('.phx .phx-svg'); await svg.scrollIntoViewIfNeeded(); const r = await svg.boundingBox();
  const xAt = (p) => r.x + ((10 + ((p + 0.5) / 15) * 320) / 340) * r.width;
  await page.mouse.move(xAt(9), r.y + r.height * 0.5); await page.mouse.down(); await page.mouse.move(xAt(3), r.y + r.height * 0.5, { steps: 5 }); await page.mouse.up();
  check((await big()).startsWith('pH 3: acidic') && !(await page.textContent('.phx .phx-desc')).includes('typical'), 'ph: drag along the scale to pH 3 ' + (await big()));
  await page.locator('.phx .phx-range').fill('8.5');
  check((await big()).startsWith('pH 8.5') && (await colour('phenolphthalein')) === 'light pink', 'ph: slider');
  await page.click('.phx .phx-lvl [data-l="10"]'); check(!(await facts()).includes('pOH'), 'ph: back to Class 10');
  const items = page.locator('.phx .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `ph: every worked answer accepted (${right}/${n})`);
};
