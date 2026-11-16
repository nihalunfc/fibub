// LinkedIn post formatter
export const path = '/everyday/linkedin-post-formatter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/linkedin-post-formatter/`);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.lf-in', 'Hello world #one #two');
  const st = await page.textContent('.lf-stats');
  check(/4 words/.test(st) && /2 hashtags/.test(st), `linkedin: stats count words and hashtags (${st})`);
  await page.selectOption('.lf-bullet', '✓');
  await page.fill('.lf-in', 'a\nb');
  await page.evaluate(() => { const t = document.querySelector('.lf-in'); t.focus(); t.setSelectionRange(0, 3); });
  await page.click('[data-do=bullets]');
  check((await page.inputValue('.lf-in')) === '✓ a\n✓ b', 'linkedin: tick bullet style');
};
