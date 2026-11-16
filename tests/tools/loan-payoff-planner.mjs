// #11 Loan payoff planner (the main checks for EMI, presets and plans are in tests/run.mjs, section 6l)
export const path = '/money/loan-payoff-planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/loan-payoff-planner/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ const __op = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); for (const m of ['fill', 'selectOption', 'check', 'uncheck', 'click']) { const o = page[m].bind(page); page[m] = async (...a) => { await __op(); return o(...a); }; } /* WRAP-OPEN */  await page.waitForTimeout(400);
  const set = async (k, v) => { await page.fill(`.ln [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  await page.selectOption('.ln [data-k="cur"]', 'USD');
  await set('p', '300000'); await set('rate', '6'); await set('years', '25'); await set('months', '0'); await set('pay', '');
  check(/1,93[23]/.test(await page.textContent('.ln .ln-base')), `loan-payoff: 300,000 at 6% for 25 years is about 1,933 a month (${await page.textContent('.ln .ln-base')})`);
  check(/Working for the first payment: interest = .*1,500/.test(await page.textContent('.ln .ln-work')), `loan-payoff: shows the working for the first payment (${await page.textContent('.ln .ln-work')})`);
  check(/debt-free in .* and save .* in interest/.test(await page.textContent('.ln .ln-ans')), `loan-payoff: plain one-line answer (${await page.textContent('.ln .ln-ans')})`);
  await set('moextra', '200');
  const out = await page.textContent('.ln .ln-mo-out');
  check(/saves .*[\d,]+ in interest and finishes .*(year|month)/.test(out), `loan-payoff: extra every month shows interest and time saved (${out})`);
  check((await page.inputValue('.ln [data-k="moextrar"]')) === '200', 'loan-payoff: slider follows the typed monthly extra');
  await page.evaluate(() => { const r = document.querySelector('.ln [data-k="moextrar"]'); r.value = '100'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await page.inputValue('.ln [data-k="moextra"]')) === '100', 'loan-payoff: dragging the slider fills the monthly extra');
  const rowsBefore = (await page.$$('.ln .ln-row')).length;
  await page.click('.ln .ln-mo-add'); await page.waitForTimeout(100);
  check((await page.$$('.ln .ln-row')).length === rowsBefore + 1, 'loan-payoff: "Add this to my plan" adds a monthly prepayment');
  await set('moextra', '');
  check((await page.textContent('.ln .ln-mo-out')) === '' && !/NaN/.test(await page.textContent('.ln')), 'loan-payoff: blank extra shows nothing and no NaN');
  await set('p', '');
  check(!(await page.isHidden('.ln .ln-err')) && !/NaN/.test(await page.textContent('.ln')), 'loan-payoff: blank amount shows a friendly message');
};
