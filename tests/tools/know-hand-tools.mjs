// #L373 Know your hand tools (home skills engine: tool cards as steps, tool wall labels, which-tool quiz)
export const path = '/learn/know-hand-tools/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/know-hand-tools/`); await page.waitForTimeout(300);
  const R = '.kht';
  check((await page.locator(`${R} .sk-step`).count()) === 9, 'know-hand-tools: 9 tool cards');
  check((await page.textContent(`${R} .sk-progress`)) === '0 of 9 steps done', 'know-hand-tools: progress starts at 0');
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`); await page.click(`${R} .sk-step:nth-child(3) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '2 of 9 steps done', 'know-hand-tools: ticks count');
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-know-hand-tools-v1'))) === null, 'know-hand-tools: nothing stored without Remember');
  check((await page.locator(`${R} [data-part]`).count()) === 13, 'know-hand-tools: 13 tools on the wall');
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('clamp');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('G-clamp'), 'know-hand-tools: tap a tool shows its name');
  await page.click(`${R} .sk-mode button:nth-child(2)`);
  { const t = await page.textContent(`${R} .sk-label-out strong`); const id = await page.evaluate((n) => [...document.querySelectorAll('.kht [data-part]')].find((g) => g.dataset.name === n).dataset.part, t);
    await tap(id); check((await page.textContent(`${R} .sk-label-out`)).startsWith('Yes'), 'know-hand-tools: test mode accepts the right tool'); }
  check((await page.locator(`${R} .lq-item`).count()) === 5, 'know-hand-tools: quiz has 5 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', 'know-hand-tools: quiz accepts the right answer'); }
};
