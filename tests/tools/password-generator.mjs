// #T936 Password generator
export const path = '/everyday/password-generator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/password-generator/`); await page.waitForTimeout(300);
  const R = '.pg ';
  const pws = () => page.$$eval(R + '.pg-pw', (l) => l.map((x) => x.textContent));
  const bits = () => page.textContent(R + '.pg-bitsn');
  let p = await pws();
  const sets = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
  check(p.length === 5 && p.every((x) => x.length === 20 && sets.every((r) => r.test(x))), `password-generator: 5 of length 20, each with every set (${p[0]})`);
  check((await bits()) === '129.4 bits', `password-generator: length 20, all sets -> 129.4 bits (${await bits()})`);
  await page.check(R + '[data-k="similar"]'); await page.fill(R + '[data-k="count"]', '50'); await page.waitForTimeout(150);
  p = await pws();
  check(p.length === 50 && p.every((x) => !/[0Oo1lI]/.test(x)) && (await bits()) === '127.3 bits', `password-generator: no look-alikes when ticked (${await bits()})`);
  check(new Set(p).size === 50, 'password-generator: 50 generated are all different');
  await page.fill(R + '[data-k="len"]', '200'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pg-err')).includes('8 to 128') && (await pws()).length === 0, 'password-generator: length over 128 is refused');
};
