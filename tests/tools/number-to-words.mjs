// #1712 Number to words
export const path = '/documents/number-to-words/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/number-to-words/`); await page.waitForTimeout(400);
  const out = () => page.textContent('.ntw .ntw-out');
  await page.selectOption('.ntw .ntw-mode', 'plain'); await page.fill('.ntw .ntw-in', '1,25,50,000'); await page.waitForTimeout(100);
  check((await out()) === 'One Crore Twenty-Five Lakh Fifty Thousand', `ntw: indian words (${await out()})`);
  check((await page.textContent('.ntw .ntw-g-in')) === '1,25,50,000' && (await page.textContent('.ntw .ntw-g-intl')) === '12,550,000', 'ntw: both groupings');
  await page.selectOption('.ntw .ntw-sys', 'intl'); await page.waitForTimeout(100);
  check((await out()) === 'Twelve Million Five Hundred Fifty Thousand', 'ntw: international words');
  await page.selectOption('.ntw .ntw-mode', 'money'); await page.selectOption('.ntw .ntw-cur', 'USD'); await page.fill('.ntw .ntw-in', '1234.5'); await page.waitForTimeout(100);
  check((await out()) === 'One Thousand Two Hundred Thirty-Four Dollars and 50/100', `ntw: cheque dollars (${await out()})`);
  await page.selectOption('.ntw .ntw-cur', 'INR'); await page.fill('.ntw .ntw-in', '1250000.75'); await page.waitForTimeout(100);
  check((await out()) === 'Rupees Twelve Lakh Fifty Thousand and Seventy-Five Paise Only', `ntw: rupees (${await out()})`);
  await page.selectOption('.ntw .ntw-cur', 'AED'); await page.fill('.ntw .ntw-in', '0.5'); await page.selectOption('.ntw .ntw-case', 'upper'); await page.waitForTimeout(100);
  check((await out()) === 'DIRHAMS FIFTY FILS ONLY', `ntw: dirhams and upper case (${await out()})`);
  await page.fill('.ntw .ntw-in', 'abc'); await page.waitForTimeout(100);
  check(await page.isVisible('.ntw .ntw-err'), 'ntw: bad input message');
};
