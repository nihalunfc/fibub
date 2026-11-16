// #L345 Electrolysis lab
export const path = '/learn/electrolysis-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/electrolysis-lab/`); await page.waitForTimeout(300);
  const o = page.locator('.el .el-out');
  check((await o.getAttribute('data-cathode')) === 'Pb' && (await o.getAttribute('data-anode')) === 'Br₂', 'electrolysis-lab: molten PbBr2 gives lead and bromine');
  await page.selectOption('.el .el-sel', '2');
  check((await o.getAttribute('data-cathode')) === 'H₂' && (await o.getAttribute('data-anode')) === 'Cl₂', 'electrolysis-lab: brine gives hydrogen and chlorine');
  await page.selectOption('.el .el-sel', '4');
  check((await o.getAttribute('data-akind')) === 'dissolves', 'electrolysis-lab: copper anode dissolves');
  await page.selectOption('.el .el-sel', '3');
  await page.click('.el [data-level="11"]');
  await page.fill('.el .el-i', '2'); await page.dispatchEvent('.el .el-i', 'input');
  await page.fill('.el .el-t', '960'); await page.dispatchEvent('.el .el-t', 'input');
  const f = page.locator('.el .el-fout');
  check(Math.abs(+(await f.getAttribute('data-q')) - 1920) < 0.5 && Math.abs(+(await f.getAttribute('data-mass')) - 0.632) < 0.005, 'electrolysis-lab: 2 A for 960 s deposits 0.632 g of copper');
  check((await page.textContent('.el .el-hc')).includes('Cu²⁺ + 2e⁻ → Cu'), 'electrolysis-lab: half-equation shown at the higher level');
  { const a = await page.getAttribute('.el .lq-item', 'data-ans'); await page.locator('.el .lq-item').first().locator('.lq-choice').nth(+a).click();
    check((await page.locator('.el .lq-fb').first().textContent()) === 'Right.', 'electrolysis-lab: quiz accepts the right choice'); }
};
