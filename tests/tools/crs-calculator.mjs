// #T931 CRS calculator
export const path = '/everyday/crs-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/crs-calculator/`); await page.waitForTimeout(400);
  const R = '.crs ';
  const total = async () => +(await page.getAttribute(R + '.crs-big', 'data-total'));
  const cell = async (label) => page.evaluate(([r, l]) => { for (const tr of document.querySelectorAll(r + '.crs-tab tr')) if (tr.children[0].textContent.startsWith(l)) return +tr.children[1].textContent; return NaN; }, [R, label]);
  const sel = async (k, v) => { await page.selectOption(R + `[data-k="${k}"]`, v); await page.waitForTimeout(80); };
  check((await total()) === 419, `crs: single 29 master's CLB 9 -> 419 (${await total()})`);
  check((await cell('Core human capital')) === 369 && (await cell('Age')) === 110 && (await cell('First official language')) === 124 && (await cell('Skill transferability')) === 50, 'crs: sub-totals core 369, age 110, language 124, transferability 50');
  await sel('spouse', 'yes');
  check((await total()) === 392 && (await cell('Age')) === 100, `crs: with spouse -> 392, age 100 (${await total()})`);
  await sel('sEdu', 'bach'); await page.check(R + '[data-k="sHasLang"]'); await page.waitForTimeout(80);
  check((await total()) === 412, `crs: spouse bachelor's + CLB 7 adds 20 -> 412 (${await total()})`);
  await sel('spouse', 'no'); await page.check(R + '[data-k="pnp"]'); await page.waitForTimeout(80);
  check((await total()) === 1019, `crs: nomination adds 600 -> 1019 (${await total()})`);
  await page.click(R + '.crs-reset'); await page.waitForTimeout(80);
  await sel('cdn', '3'); await sel('hw', '2'); await sel('foreign', '3');
  check((await total()) === 603, `crs: 3 years Canada high-wage 2x + 3 years foreign -> 603 (${await total()})`);
  await page.click(R + '.crs-reset'); await page.waitForTimeout(80); await sel('cdn', '3'); await sel('offer', '2');
  check((await cell('Job offer')) === 100 && (await total()) === 519, `crs: job offer 100 beats 3 years Canada (64), not both -> 519 (${await total()})`);
};
