// #L324 Sine cosine law
export const path = '/learn/sine-cosine-law/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/sine-cosine-law/`); await page.waitForTimeout(300);
  const facts = async () => (await page.textContent('.scl .scl-facts')).replace(/\s+/g, ' ');
  // Worked example from the guide: A 40, B 65, a 10 gives b 14.1, c 15.03, C 75.
  const f0 = await facts();
  check(f0.includes('14.1') && f0.includes('15.03') && f0.includes('75°'), 'sine-cosine-law: worked example (b 14.1, c 15.03, C 75°) ' + f0);
  await page.selectOption('.scl .scl-case', 'SSS'); // 3, 4, 5
  check((await facts()).includes('Angle C90°'), 'sine-cosine-law: 3-4-5 has a right angle');
  const ins = await page.$$('.scl .scl-in'); await ins[0].fill('2'); await ins[1].fill('3'); await ins[2].fill('6');
  check(await page.isVisible('.scl .scl-err'), 'sine-cosine-law: 2-3-6 is not a triangle');
  await page.click('.scl [data-level="11"]'); await page.selectOption('.scl .scl-case', 'SSA'); // 8, 10, 40
  check(await page.isVisible('.scl .scl-pick'), 'sine-cosine-law: ambiguous case offers two triangles');
  { const a = await page.getAttribute('.scl .lq-item', 'data-ans'); await page.fill('.scl .lq-in', a); await page.click('.scl .lq-check');
    check((await page.textContent('.scl .lq-fb')) === 'Right.', 'sine-cosine-law: quiz accepts the right answer'); }
};
