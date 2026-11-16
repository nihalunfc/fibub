// #L347 Crude oil fractions
export const path = '/learn/crude-oil-fractions/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/crude-oil-fractions/`); await page.waitForTimeout(300);
  await page.fill('.co .co-n', '8'); await page.dispatchEvent('.co .co-n', 'input');
  const o = page.locator('.co .co-out');
  check((await o.getAttribute('data-formula')) === 'C₈H₁₈' && (await o.getAttribute('data-bp')) === '125.7' && (await o.getAttribute('data-frac')) === 'petrol', 'crude-oil-fractions: octane boils at 125.7 °C and is in petrol');
  await page.fill('.co .co-n', '16'); await page.dispatchEvent('.co .co-n', 'input');
  check((await o.getAttribute('data-frac')) === 'diesel' && (await o.getAttribute('data-state')) === 'liquid', 'crude-oil-fractions: C16 is diesel and still a liquid at 20 °C');
  await page.fill('.co .co-cn', '10'); await page.dispatchEvent('.co .co-cn', 'input');
  await page.fill('.co .co-ck', '8'); await page.dispatchEvent('.co .co-ck', 'input');
  const q = page.locator('.co .co-ceq');
  check((await q.getAttribute('data-eq')) === 'C₁₀H₂₂ → C₈H₁₈ + C₂H₄' && (await q.getAttribute('data-balanced')) === 'true', 'crude-oil-fractions: decane cracks to octane + ethene, balanced');
  await page.locator('.co .co-col').click({ position: { x: 150, y: 310 } });
  check((await page.getAttribute('.co .co-fname', 'data-frac')) === 'bitumen', 'crude-oil-fractions: tapping the bottom of the column picks bitumen');
  { const a = await page.getAttribute('.co .lq-item', 'data-ans'); await page.locator('.co .lq-item').first().locator('.lq-choice').nth(+a).click();
    check((await page.locator('.co .lq-fb').first().textContent()) === 'Right.', 'crude-oil-fractions: quiz accepts the right choice'); }
};
