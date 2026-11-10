// #T851 JWT decoder
export const path = '/everyday/jwt-decoder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/jwt-decoder/`); await page.waitForTimeout(300);
  const R = '.jd ', txt = (s) => page.textContent(R + s);
  check(JSON.parse(await txt('.jd-pay')).name === 'Asha' && JSON.parse(await txt('.jd-head')).alg === 'HS256', 'jwt: example decodes (HS256, Asha)');
  check((await txt('.jd-times')).includes('2023-11-14 22:13:20 UTC'), 'jwt: iat shows 2023-11-14');
  check((await txt('.jd-sig')).startsWith('BtJKPEY4') && (await txt('.jd-warn')).includes('not checked'), 'jwt: signature shown, not verified');
  await page.fill(R + '.jd-in', 'abc.def'); await page.waitForTimeout(80);
  check((await page.isVisible(R + '.jd-err')) && (await page.isHidden(R + '.jd-res')), 'jwt: malformed token shows an error');
  // exp in the past: {"exp":1700000000}
  await page.fill(R + '.jd-in', 'eyJhbGciOiJub25lIn0.eyJleHAiOjE3MDAwMDAwMDB9.'); await page.waitForTimeout(80);
  check((await txt('.jd-times')).includes('Expired') && (await txt('.jd-alg')).includes('none'), 'jwt: old exp says expired');
};
