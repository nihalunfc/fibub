// #1490 Spring energy
export const path = '/learn/spring-energy/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/spring-energy/`); await page.waitForTimeout(300);
  const facts = () => page.textContent('.se .se-facts');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('0.5 J') && f.includes('1.41 m/s'), 'spring-energy: k=100, x=10 cm, 0.5 kg: 0.5 J and v = 1.41 m/s'); }
  await setR('.se .se-x', 20);
  check((await facts()).includes('2 J'), 'spring-energy: double x, four times the energy');
  await setR('.se .se-x', 10); await setR('.se .se-u', 0.2);
  { const f = await facts(); check(f.includes('1.27 m/s') && f.includes('0.41 m'), `spring-energy: friction 0.2 gives 1.27 m/s and slides 0.41 m (${f})`); }
  await setR('.se .se-x', 1); await setR('.se .se-u', 0.5);
  check((await facts()).includes('does not move'), 'spring-energy: too much friction, no start');
  await setR('.se .se-x', 10); await setR('.se .se-u', 0);
  await page.click('.se .se-go'); await page.waitForTimeout(700);
  check((await page.$eval('.se .se-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) n++; return n; })) > 200, 'spring-energy: animation draws');
  { const a = await page.getAttribute('.se .lq-item', 'data-ans'); await page.fill('.se .lq-in', a); await page.click('.se .lq-check');
    check((await page.textContent('.se .lq-fb')) === 'Right.', 'spring-energy: quiz accepts the right answer'); }
};
