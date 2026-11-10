// #1483 static-charge
export const path = '/learn/static-charge/';
export default async ({ page, check, BASE }) => {
  const R = '.sc ';
  const at = (n) => page.getAttribute('.sc', 'data-' + n);
  const setR = (sel, v) => page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await page.goto(`${BASE}/learn/static-charge/`); await page.waitForTimeout(300);
  check((await at('qa')) === '-5' && (await at('wool')) === '10', 'static-charge: rubbing moves electrons to the balloons (A -5, wool +10 with B also rubbed on it)');
  check((await at('force')) === 'repel', 'static-charge: two negative balloons repel');
  await page.selectOption(R + '.sc-bt', 'pos');
  check((await at('force')) === 'attract', 'static-charge: opposite charges attract');
  check((await at('net')) === '0', 'static-charge: net charge conserved (0)');
  await setR('.sc-a', '9'); await page.selectOption(R + '.sc-bt', 'neg');
  check((await at('net')) === '0' && (await at('qa')) === '-9' && (await at('wool')) === '14', 'static-charge: conserved with both balloons rubbed on wool');
  await page.selectOption(R + '.sc-bt', 'none');
  check((await at('force')) === 'none', 'static-charge: unrubbed balloon, no force');
  await setR('.sc-a', '0');
  check((await page.textContent(R + '.sc-out')).startsWith('Nothing rubbed'), 'static-charge: 0 rubs = neutral');
  { const a = await page.getAttribute(R + '.lq-item', 'data-ans'); await page.fill(R + '.lq-in', a); await page.click(R + '.lq-check');
    check((await page.textContent(R + '.lq-fb')) === 'Right.', 'static-charge: quiz accepts the right answer'); }
};
