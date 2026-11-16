// #L327 Moments lab
export const path = '/learn/moments-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/moments-lab/`); await page.waitForTimeout(300);
  const t = (s) => page.textContent('.ml ' + s);
  const set = (s, v) => page.$eval('.ml ' + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await t('.ml-out')).startsWith('Balanced'), `moments-lab: 10 N at 3 m each side balances (${await t('.ml-out')})`);
  check((await t('.ml-calc')).includes('Pivot force 20 N'), 'moments-lab: pivot force is total weight');
  await set('.ml-w2', 15);
  check((await t('.ml-out')).includes('clockwise (net moment 15 N m)') && !(await t('.ml-out')).includes('anticlockwise'), `moments-lab: 15 N on the right turns clockwise 15 N m (${await t('.ml-out')})`);
  await set('.ml-p', 3);
  check((await t('.ml-calc')).includes('Clockwise 75 N m, anticlockwise 0 N m'), `moments-lab: pivot moved (${await t('.ml-calc')})`);
  await page.click('.ml [data-level=alevel]'); await set('.ml-wb', 10); await set('.ml-p', 5); await set('.ml-w2', 10);
  check((await t('.ml-calc')).includes('Pivot force 30 N') && (await t('.ml-out')).startsWith('Balanced'), 'moments-lab: A-level beam weight at the centre adds to pivot force');
  { const a = await page.getAttribute('.ml .lq-item', 'data-ans'); await page.fill('.ml .lq-in', a); await page.click('.ml .lq-check');
    check((await page.textContent('.ml .lq-fb')) === 'Right.', 'moments-lab: quiz accepts the right answer'); }
};
