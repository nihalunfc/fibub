// #T937 Password strength
export const path = '/everyday/password-strength/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/password-strength/`); await page.waitForTimeout(300);
  const R = '.ps ';
  const rate = () => page.textContent(R + '.ps-rate');
  const bitsOf = async (pw) => { await page.fill(R + '.ps-in', pw); await page.waitForTimeout(80); return parseFloat((await page.textContent(R + '.ps-sum')).match(/About ([\d.]+) bits/)[1]); };
  check((await rate()).startsWith('Type a password'), 'password-strength: empty asks for a password');
  check((await page.getAttribute(R + '.ps-in', 'type')) === 'password' && (await page.getAttribute(R + '.ps-in', 'autocomplete')) === 'off', 'password-strength: field is type=password, autocomplete off');
  const b0 = await bitsOf('password');
  check((await rate()) === 'Very weak' && (await page.textContent(R + '.ps-why')).includes('Found in the common-password list'), `password-strength: "password" very weak, in the list (${b0} bits)`);
  const b1 = await bitsOf('P@ssw0rd2024');
  check((await rate()) === 'Weak' || (await rate()) === 'Very weak', `password-strength: P@ssw0rd2024 still weak (${b1} bits, ${await rate()})`);
  const b2 = await bitsOf('Tr0ub4dor&3'); const b3 = await bitsOf('correct horse battery staple');
  check(b2 < b3, `password-strength: Tr0ub4dor&3 (${b2}) weaker than correct horse battery staple (${b3})`);
  await page.check(R + '.ps-show'); const t = await page.getAttribute(R + '.ps-in', 'type'); await page.click(R + '.ps-clear');
  check(t === 'text' && (await page.inputValue(R + '.ps-in')) === '' && (await rate()).startsWith('Type a password'), 'password-strength: show toggle and Clear');
  // New options
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '.ps-in', 'password');
  check((await page.locator(R + '.ps-chk li').count()) === 4 && (await page.textContent(R + '.ps-chk')).includes('Check: Common passwords: contains a word'), 'password-strength: checklist has 4 lines and flags a common password');
  check((await page.textContent(R + '.ps-tip')).includes('Pick something else'), 'password-strength: a common password gets the pick-something-else tip');
  await page.fill(R + '.ps-in', 'Abcdef12!');
  check((await page.textContent(R + '.ps-kinds')).startsWith('9 characters: 5 lower case, 1 upper case, 2 digits, 1 symbols or spaces.'), 'password-strength: kinds line counts 5/1/2/1');
  check((await page.textContent(R + '.ps-tip')).includes('11 more random characters') === false && (await page.textContent(R + '.ps-tip')).includes('more random character'), 'password-strength: short password gets a make-it-longer tip');
  // Personal words
  const plain = await bitsOf('nihal1990xqz');
  await page.fill(R + '.ps-pers', 'nihal 1990'); await page.waitForTimeout(80);
  const personal = parseFloat((await page.textContent(R + '.ps-sum')).match(/About ([\d.]+) bits/)[1]);
  check(plain === 48.5 && personal === 27.5 && (await page.textContent(R + '.ps-why')).includes('one of your own personal words') && (await rate()) === 'Very weak', `password-strength: personal words cut 48.5 to 27.5 bits (${plain}, ${personal})`);
  check((await page.textContent(R + '.ps-chk')).includes('Check: Your words: your password contains'), 'password-strength: checklist flags a personal word');
  await page.fill(R + '.ps-pers', '');
  // Compare two passwords
  await page.fill(R + '.ps-in', 'Tr0ub4dor&3'); await page.fill(R + '.ps-in2', 'correct horse battery staple'); await page.waitForTimeout(80);
  const c = await page.textContent(R + '.ps-cmp');
  check(c.includes('133.1 bits against 72.1') && c.includes('stronger by 61.0 bits') && c.includes('10^18'), `password-strength: compare says the phrase is stronger by 61.0 bits (${c})`);
  await page.fill(R + '.ps-in2', 'Tr0ub4dor&3'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.ps-cmp')).includes('about as strong'), 'password-strength: equal passwords are about as strong');
  await page.check(R + '.ps-show');
  check((await page.getAttribute(R + '.ps-in2', 'type')) === 'text', 'password-strength: show toggle also reveals the second field');
  await page.click(R + '.ps-clear');
  check((await page.inputValue(R + '.ps-in2')) === '' && (await page.textContent(R + '.ps-cmp')) === '', 'password-strength: Clear empties both fields');
  // Very long input stays quick and sane
  await page.fill(R + '.ps-in', 'aB3$'.repeat(75)); await page.waitForTimeout(150);
  check((await page.textContent(R + '.ps-kinds')).includes('first 256 characters') && !(await page.textContent(R)).includes('NaN'), 'password-strength: 300 characters analysed in the first 256, no NaN');
  // The password never reaches the address bar
  check(!(page.url().includes('aB3')), 'password-strength: password is not put in the page address');
};
