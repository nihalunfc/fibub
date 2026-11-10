// #1486 Power and bills
export const path = '/learn/power-bill/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/power-bill/`); await page.waitForTimeout(300);
  const set = async (sel, v) => { await page.fill(sel, String(v)); await page.dispatchEvent(sel, 'input'); };
  await set('.pb .pb-m', 60); await set('.pb .pb-h', 3); await set('.pb .pb-t1', 6);
  check(Math.abs(+(await page.getAttribute('.pb .pb-out', 'data-p1')) - 294) < 0.01, 'power-bill: 60 kg up 3 m in 6 s = 294 W');
  check(+(await page.getAttribute('.pb .pb-out', 'data-p1')) > +(await page.getAttribute('.pb .pb-out', 'data-p2')), 'power-bill: quicker runner has more power');
  await page.click('.pb .pb-mode [data-m="bill"]');
  const n = await page.locator('.pb .pb-hrs').count();
  for (let i = 0; i < n; i++) await page.locator('.pb .pb-hrs').nth(i).fill('0');
  await page.locator('.pb .pb-hrs').nth(4).fill('1'); await page.fill('.pb .pb-d', '1'); await page.dispatchEvent('.pb .pb-d', 'input');
  check(+(await page.getAttribute('.pb .pb-bout', 'data-kwh')) === 1, 'power-bill: 1 kW for 1 h = 1 kWh');
  { const a = await page.getAttribute('.pb .lq-item', 'data-ans'); await page.fill('.pb .lq-in', a); await page.click('.pb .lq-check');
    check((await page.textContent('.pb .lq-fb')) === 'Right.', 'power-bill: quiz accepts the right answer'); }
};
