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
};
