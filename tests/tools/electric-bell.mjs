// #1482 electric-bell
export const path = '/learn/electric-bell/';
export default async ({ page, check, BASE }) => {
  const R = '.eb ';
  const attr = (n) => page.getAttribute('.eb', 'data-' + n);
  await page.goto(`${BASE}/learn/electric-bell/`); await page.waitForTimeout(300);
  const seen = new Set();
  for (let i = 0; i < 40; i++) { seen.add(await attr('closed')); await page.waitForTimeout(60); }
  check(seen.has('true') && seen.has('false'), 'electric-bell: circuit opens when the armature moves, and closes again');
  check((await page.textContent(R + '.eb-out')) === '5 rings per second', 'electric-bell: 1 A = 5 rings per second');
  await page.$eval(R + '.eb-i', (e) => { e.value = '2'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await page.textContent(R + '.eb-out')) === '10 rings per second', 'electric-bell: 2 A = 10 rings per second');
  const r1 = +(await attr('rings')); await page.waitForTimeout(800); check(+(await attr('rings')) > r1, 'electric-bell: rings counted while on');
  await page.$eval(R + '.eb-i', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(100);
  const r2 = await attr('rings'), seen2 = new Set();
  for (let i = 0; i < 15; i++) { seen2.add(await attr('closed')); await page.waitForTimeout(50); }
  check((await page.textContent(R + '.eb-out')) === 'The bell is silent' && (await attr('ringing')) === 'false' && seen2.size === 1 && (await attr('rings')) === r2, 'electric-bell: no current = no ring');
  { const a = await page.getAttribute(R + '.lq-item', 'data-ans'); await page.fill(R + '.lq-in', a); await page.click(R + '.lq-check');
    check((await page.textContent(R + '.lq-fb')) === 'Right.', 'electric-bell: quiz accepts the right answer'); }
};
