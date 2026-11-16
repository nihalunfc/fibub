// #L324 Sine cosine law
export const path = '/learn/sine-cosine-law/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/sine-cosine-law/`); await page.waitForTimeout(300);
  const facts = async () => (await page.textContent('.scl .scl-facts')).replace(/\s+/g, ' ');
  // Worked example from the guide: A 40, B 65, a 10 gives b 14.1, c 15.03, C 75.
  const f0 = await facts();
  check(f0.includes('14.1') && f0.includes('15.03') && f0.includes('75°'), 'sine-cosine-law: worked example (b 14.1, c 15.03, C 75°) ' + f0);
  check((await page.textContent('.scl .scl-ans')) === 'a = 10, b = 14.1, c = 15.03; A = 40°, B = 65°, C = 75°.', 'sine-cosine-law: answer sentence');
  { const w = await page.textContent('.scl .scl-work'); check(w.includes('C = 180° − 40° − 65° = 75°') && w.includes('b = a sin B / sin A = 10 × sin 65° / sin 40° = 10 × 0.9063 / 0.6428 = 14.1'), 'sine-cosine-law: working (' + w.slice(0, 120) + ')'); }
  await page.evaluate(() => document.querySelectorAll('.scl details').forEach((d) => (d.open = true)));
  await page.click('.scl .scl-pre button[data-sp^="SAS"]'); await page.waitForTimeout(100);
  check((await page.textContent('.scl .scl-ans')) === 'a = 11.26, b = 8, c = 12 km; A = 65°, B = 40.07°, C = 74.93°.' && (await page.textContent('.scl .scl-work')).includes('a² = b² + c² − 2bc cos A = 8² + 12² − 2(8)(12) cos 65° = 126.9, so a = 11.26'), 'sine-cosine-law: two ships (SAS) ' + await page.textContent('.scl .scl-ans'));
  await page.click('.scl .scl-pre button[data-sp^="SSS"]'); await page.waitForTimeout(100);
  { const e = (await page.textContent('.scl .scl-extra')).replace(/\s+/g, ' '); check(e.includes('1336.02 m²') && e.includes('185 m') && e.includes('obtuse, scalene'), 'sine-cosine-law: area, perimeter, kind (' + e + ')'); }
  check((await page.textContent('.scl .scl-ans')).includes('C = 98.25°'), 'sine-cosine-law: plot angles');
  await page.click('.scl .scl-pre button[data-sp^="AAS"]'); await page.waitForTimeout(100);
  await page.selectOption('.scl .scl-au', 'rad'); await page.waitForTimeout(100);
  check((await page.textContent('.scl .scl-ans')).includes('A = 0.91 rad, B = 1.24 rad, C = 0.99 rad') && (await page.textContent('.scl .scl-ans')).includes('b = 143.99'), 'sine-cosine-law: radians ' + await page.textContent('.scl .scl-ans'));
  await page.selectOption('.scl .scl-au', 'deg'); await page.waitForTimeout(100);
  { const i0 = await page.$('.scl .scl-in'); await i0.fill(''); await page.waitForTimeout(100); check((await page.textContent('.scl .scl-err')).includes('Type all three'), 'sine-cosine-law: blank entry'); }
  await page.selectOption('.scl .scl-case', 'SSS'); // 3, 4, 5
  check((await facts()).includes('Angle C90°'), 'sine-cosine-law: 3-4-5 has a right angle');
  const ins = await page.$$('.scl .scl-in'); await ins[0].fill('2'); await ins[1].fill('3'); await ins[2].fill('6');
  check(await page.isVisible('.scl .scl-err'), 'sine-cosine-law: 2-3-6 is not a triangle');
  await page.click('.scl [data-level="11"]'); await page.selectOption('.scl .scl-case', 'SSA'); // 8, 10, 40
  check(await page.isVisible('.scl .scl-pick'), 'sine-cosine-law: ambiguous case offers two triangles');
  { const a = await page.getAttribute('.scl .lq-item', 'data-ans'); await page.fill('.scl .lq-in', a); await page.click('.scl .lq-check');
    check((await page.textContent('.scl .lq-fb')) === 'Right.', 'sine-cosine-law: quiz accepts the right answer'); }
};
