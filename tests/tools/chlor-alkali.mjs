// #1296 Chlor-alkali process
export const path = '/learn/chlor-alkali/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/chlor-alkali/`); await page.waitForSelector('.ca .ca-na');
  const R = '.ca ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.ca-na')).length === 6 && (await page.$$(R + '.ca-bub')).length === 10, 'chlor: ions and bubbles drawn');
  const p1 = await page.getAttribute(R + '.ca-na', 'cx'); await page.waitForTimeout(400); const p2 = await page.getAttribute(R + '.ca-na', 'cx');
  check(p1 !== p2, 'chlor: animation moves the ions');
  await page.click(R + '.ca-play'); await page.waitForTimeout(100); const p3 = await page.getAttribute(R + '.ca-na', 'cx'); await page.waitForTimeout(300);
  check((await txt('.ca-play')) === 'Play' && p3 === await page.getAttribute(R + '.ca-na', 'cx'), 'chlor: pause stops it');
  await page.uncheck(R + '.ca-lab'); await page.waitForTimeout(80);
  check((await page.$$(R + '.ca-ion')).length === 0, 'chlor: labels hidden');
  check((await txt('.ca-eq')).includes('2NaCl(aq) + 2H₂O(l) → 2NaOH(aq) + Cl₂(g) + H₂(g)') && await page.isHidden(R + '.ca-calc'), 'chlor: class 10 words, no calculator');
  await page.click(R + '.ca-lvl button[data-l="12"]'); await page.waitForTimeout(80);
  check((await txt('.ca-eq')).includes('2Cl⁻(aq) → Cl₂(g) + 2e⁻') && await page.isVisible(R + '.ca-calc'), 'chlor: class 12 half equations');
  const o = await txt('.ca-out');
  check(o.includes('= 36000 C') && o.includes('= 0.37311 mol') && o.includes('= 13.246 g') && o.includes('= 4.477 L') && o.includes('= 14.925 g') && o.includes('2.68 hours'), 'chlor: 10 A for 1 h');
  await page.fill(R + '.ca-i', '20'); await page.waitForTimeout(80);
  check((await txt('.ca-out')).includes('= 26.491 g'), 'chlor: doubling the current doubles chlorine');
  await page.fill(R + '.ca-e', '50'); await page.waitForTimeout(80);
  check((await txt('.ca-out')).includes('= 13.246 g'), 'chlor: 50 % efficiency halves it');
  await page.selectOption(R + '.ca-v', '22.4'); await page.waitForTimeout(80);
  check((await txt('.ca-out')).includes('= 4.179 L'), 'chlor: 22.4 L/mol');
  await page.fill(R + '.ca-e', '150'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.ca-err'), 'chlor: efficiency over 100 rejected');
  await page.fill(R + '.ca-e', '100'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.ca-err'), 'chlor: message clears');
  const items = page.locator('.ca .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 4 && right === n, `chlor: every worked answer accepted (${right}/${n})`);
};
