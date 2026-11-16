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
  // New options. Start from a clean page.
  await page.goto(`${BASE}/everyday/password-generator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const setR = async (k, v) => { await page.$eval(R + `[data-k="${k}"]`, (e, val) => { e.value = val; e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(100); };
  await setR('lenslide', '32');
  p = await pws();
  check((await page.inputValue(R + '[data-k="len"]')) === '32' && p.every((x) => x.length === 32), 'password-generator: slider 32 sets the length box and the passwords');
  await page.fill(R + '[data-k="len"]', '40'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="lenslide"]')) === '40', 'password-generator: typed length moves the slider');
  await page.click(R + '[data-preset="wifi"]'); await page.waitForTimeout(100);
  p = await pws();
  check(p.every((x) => x.length === 20 && /^[a-zA-Z0-9]+$/.test(x) && !/[0Oo1lI]/.test(x)) && (await bits()) === '116.1 bits', `password-generator: Wi-Fi preset 20 letters and digits, no look-alikes, 116.1 bits (${await bits()})`);
  await page.click(R + '[data-preset="everyday"]'); await page.waitForTimeout(100);
  check((await bits()) === '129.4 bits', 'password-generator: everyday preset back to 129.4 bits');
  await page.click(R + '[data-preset="long"]'); await page.waitForTimeout(100);
  check((await pws()).every((x) => x.length === 64) && (await bits()) === '414.4 bits', 'password-generator: very long preset 64 characters, 414.4 bits');
  await page.click(R + '[data-preset="everyday"]');
  // Fewer symbols and excluded characters
  await page.check(R + '[data-k="easy"]'); await page.waitForTimeout(100);
  p = await pws();
  check(p.every((x) => [...x].filter((c) => !/[a-zA-Z0-9]/.test(c)).every((c) => '!@#$%&*?-_'.includes(c))) && (await bits()) === '123.2 bits', `password-generator: fewer symbols limits them to 10, 123.2 bits (${await bits()})`);
  await page.uncheck(R + '[data-k="easy"]'); await page.fill(R + '[data-k="excl"]', 'abc'); await page.waitForTimeout(100);
  p = await pws();
  check(p.every((x) => !/[abc]/.test(x)) && (await bits()) === '128.4 bits', `password-generator: excluded a b c never appear, 128.4 bits (${await bits()})`);
  await page.fill(R + '[data-k="excl"]', '');
  for (const sName of ['lower', 'upper', 'symbol']) await page.uncheck(R + `[data-set="${sName}"]`);
  await page.fill(R + '[data-k="excl"]', '0123456789'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pg-err')).includes('left out') && (await pws()).length === 0, 'password-generator: excluding every character gives a message');
  await page.fill(R + '[data-k="excl"]', '');
  for (const sName of ['lower', 'upper', 'symbol']) await page.check(R + `[data-set="${sName}"]`);
  // Passphrase
  await page.selectOption(R + '[data-k="mode"]', 'phrase'); await page.waitForTimeout(100);
  p = await pws();
  check(p.length === 5 && p.every((x) => /^[a-z]+(-[a-z]+){8}$/.test(x)) && (await bits()) === '83.4 bits', `password-generator: 9 lower-case words with hyphens, 83.4 bits (${p[0]})`);
  await page.check(R + '[data-k="cap"]'); await page.check(R + '[data-k="dig"]'); await page.waitForTimeout(100);
  p = await pws();
  check(p.every((x) => /^[A-Z][a-z]+(-[A-Z][a-z]+){8}-\d$/.test(x)) && (await bits()) === '86.8 bits', `password-generator: capitals and a digit, 86.8 bits (${p[0]})`);
  await page.selectOption(R + '[data-k="sep"]', ' '); await setR('wslide', '4');
  p = await pws();
  check((await page.inputValue(R + '[data-k="words"]')) === '4' && p.every((x) => /^[A-Z][a-z]+( [A-Z][a-z]+){3} \d$/.test(x)) && (await bits()) === '40.4 bits', `password-generator: 4 words with spaces, 40.4 bits (${p[0]})`);
  check((await page.textContent(R + '.pg-time')).includes('1 minute') || (await page.textContent(R + '.pg-time')).includes('minute') || (await page.textContent(R + '.pg-time')).includes('second'), 'password-generator: shows an example time to try every possibility');
  await page.fill(R + '[data-k="words"]', '20'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pg-err')).includes('3 to 12 words'), 'password-generator: 20 words is refused');
  // PIN
  await page.selectOption(R + '[data-k="mode"]', 'pin'); await page.waitForTimeout(100);
  p = await pws();
  check(p.length === 5 && p.every((x) => /^\d{6}$/.test(x)) && (await bits()) === '19.9 bits', 'password-generator: 6-digit PINs, 19.9 bits');
  await page.fill(R + '[data-k="pinlen"]', '3'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pg-err')).includes('4 to 12 digits'), 'password-generator: 3-digit PIN refused');
  await page.fill(R + '[data-k="count"]', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pg-err')).includes('1 to 100'), 'password-generator: 0 passwords refused');
};
