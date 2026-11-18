// #T1039 Gig fee
export const path = '/everyday/gig-fee-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/gig-fee-calculator/`); await page.waitForTimeout(300);
  const row = (t) => page.evaluate((s) => { const r = [...document.querySelectorAll('.gf .gf-body tr')].find((x) => x.firstElementChild.textContent.startsWith(s)); return r ? r.lastElementChild.textContent : ''; }, t);
  check((await row('Minimum fee')) === '$305.56' && (await row('Quote')) === '$336.11', `gig: minimum 305.56 and quote 336.11 (${await row('Minimum fee')})`);
  check((await row('Deposit')) === '$100.83' && (await row('Balance')) === '$235.28', 'gig: deposit and balance');
  check((await row('What you keep')) === '$202.00' && (await row('Effective')).startsWith('$33.67'), 'gig: keep 202.00, 33.67 per hour');
  await page.selectOption('.gf .gf-cur', '£'); await page.fill('.gf [data-k=setH]', '3'); await page.waitForTimeout(100);
  check((await row('Hours counted')) === '7' && (await row('Minimum fee')).startsWith('£'), 'gig: currency and hours change');
  await page.evaluate(() => document.querySelector('.gf details').open = true);
  await page.fill('.gf [data-k=agentPct]', '100'); await page.waitForTimeout(100);
  check((await page.textContent('.gf .gf-warn')).includes('under 100%'), 'gig: 100% agent cut message');
};
