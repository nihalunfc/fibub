// #T850 URL encoder
export const path = '/everyday/url-encoder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/url-encoder/`); await page.waitForTimeout(300);
  const R = '.ue ';
  check((await page.inputValue(R + '.ue-enc')) === 'a%20b%26c%3Dd', 'url: a b&c=d -> a%20b%26c%3Dd');
  await page.fill(R + '.ue-enc', 'h%C3%A9llo%20world'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.ue-plain')) === 'héllo world', 'url: decodes');
  check((await page.$$(R + '.ue-tab tbody tr')).length === 2 && (await page.textContent(R + '.ue-tab tbody tr td')) === 'q', 'url: query table has 2 rows');
  await page.fill(R + '.ue-enc', '100%zz'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.ue-err'), 'url: bad % shows an error');
  await page.fill(R + '.ue-plain', 'a b&c=d'); await page.selectOption(R + '.ue-mode', 'uri'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.ue-enc')) === 'a%20b&c=d' && (await page.isHidden(R + '.ue-err')), 'url: whole-address mode keeps & and =');
};
