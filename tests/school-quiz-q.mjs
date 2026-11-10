// Shared "Check yourself" check for the Learn tools of NCERT helper q (chemquiz.ts blocks): fill every worked
// answer and expect "Right!", mark a wrong one, and draw new questions.
export const quiz = async (page, check, sel, label, want = 5) => {
  const items = page.locator(`${sel} .cq-item`); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === want && right === n, `${label}: every worked answer accepted (${right}/${n})`);
  const it = items.nth(0); await it.locator('.cq-in').fill('99999999'); await it.locator('.cq-check').click();
  check((await it.locator('.cq-res').textContent()).startsWith('Not quite'), `${label}: a wrong answer is marked wrong`);
  const before = await page.textContent(`${sel} .cq-list`); await page.locator(`${sel} .cq-new`).click();
  check((await page.locator(`${sel} .cq-item`).count()) === want && (await page.textContent(`${sel} .cq-list`)) !== '' && before !== null, `${label}: new questions`);
};
