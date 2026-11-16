// #L335 Earth's seasons
export const path = '/learn/earth-seasons/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/earth-seasons/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.es .es-out')).length > 0, 'earth-seasons: shows a result');
  { const a = await page.getAttribute('.es .lq-item', 'data-ans'); await page.fill('.es .lq-in', a); await page.click('.es .lq-check');
    check((await page.textContent('.es .lq-fb')) === 'Right.', 'earth-seasons: quiz accepts the right answer'); }
};
