// #1299 Chlor-alkali process
export const path = '/learn/chlor-alkali/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/chlor-alkali/`); await page.waitForSelector('.ca .ca-fig rect');
  const R = '.ca ', txt = (s) => page.textContent(R + s);
  const cells = async () => (await page.locator(R + '.ca-tab tbody td').allTextContents());
  check((await txt('.ca-steps')).includes('= 7200 C') && (await txt('.ca-steps')).includes('= 0.07462 mol'), 'chlor: 2 A for 60 min, 7200 C');
  { const c = await cells(); check(c[0] === 'Chlorine, Cl₂' && c[1] === '0.03731' && c[2] === '2.645' && c[3] === '0.9249' && c[10] === '2.985' && c[11] === '—', `chlor: table (${c.join(' | ')})`); }
  await page.selectOption(R + '.ca-u', '3600'); await page.fill(R + '.ca-t', '1');
  { const c = await cells(); check(c[10] === '2.985', 'chlor: 1 hour is the same'); }
  await page.fill(R + '.ca-i', '4'); { const c = await cells(); check(c[10] === '5.969', 'chlor: double the current, double the NaOH'); }
  await page.fill(R + '.ca-i', '0'); check(await page.isVisible(R + '.ca-err') && (await cells()).length === 0, 'chlor: zero current message');
  await page.fill(R + '.ca-i', '10'); await page.selectOption(R + '.ca-u', '1'); await page.fill(R + '.ca-t', '9648.5');
  { const c = await cells(); check(c[9] === '1' && c[10] === '40', `chlor: 10 A for 9648.5 s makes 1 mol NaOH (${c[9]}, ${c[10]})`); }
  check((await page.locator(R + '.ca-fig .ca-b1').count()) === 0, 'chlor: no bubbles when off');
  await page.locator(R + '.ca-run').scrollIntoViewIfNeeded();
  await page.click(R + '.ca-run'); await page.waitForTimeout(300);
  check((await page.locator(R + '.ca-fig .ca-b1').count()) === 8 && (await txt('.ca-fig')).includes('DC supply: on') && (await txt('.ca-run')) === 'Switch off', 'chlor: switched on, bubbles');
  await page.click(R + '.ca-run'); await page.waitForTimeout(100);
  check((await page.locator(R + '.ca-fig .ca-b1').count()) === 0 && (await txt('.ca-fig')).includes('DC supply: off'), 'chlor: switched off');
  const items = page.locator('.ca .cq-item');
  check((await items.count()) === 3, 'chlor: three questions');
  for (let i = 0; i < 3; i++) {
    const it = items.nth(i); await it.locator('.cq-show').click();
    const ans = /Answer: (.+)\.$/.exec(await it.locator('.cq-work').textContent())[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    check((await it.locator('.cq-res').textContent()) === 'Right!', `chlor: quiz ${i + 1} (${ans})`);
  }
};
