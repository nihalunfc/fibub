// #1486 Power and bills
export const path = '/learn/power-bill/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/power-bill/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.pb .pb-out')).length > 0, 'power-bill: shows a result');
  { const a = await page.getAttribute('.pb .lq-item', 'data-ans'); await page.fill('.pb .lq-in', a); await page.click('.pb .lq-check');
    check((await page.textContent('.pb .lq-fb')) === 'Right.', 'power-bill: quiz accepts the right answer'); }
};
