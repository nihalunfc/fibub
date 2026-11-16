// #L341 Energy stores
export const path = '/learn/energy-stores/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/energy-stores/`); await page.waitForTimeout(300);
  const t = (s) => page.textContent('.es ' + s);
  check((await t('.es-out')) === 'Useful 900 J, wasted 100 J.', `energy-stores: kettle 1000 J (${await t('.es-out')})`);
  await page.selectOption('.es .es-dev', { index: 0 });
  check((await t('.es-out')) === 'Useful 100 J, wasted 900 J.', 'energy-stores: filament lamp 10% useful');
  await page.click('.es [data-level=gcse]');
  check((await t('.es-out')).endsWith('Efficiency 10%.') && (await t('.es-sub')).includes('Power in 500 W, useful power out 50 W'), `energy-stores: GCSE adds efficiency and power (${await t('.es-sub')})`);
  await page.$eval('.es .es-e', (e) => { e.value = '2000'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.es-out')).startsWith('Useful 200 J, wasted 1,800 J'), `energy-stores: 2000 J (${await t('.es-out')})`);
  { const a = await page.getAttribute('.es .lq-item', 'data-ans'); await page.fill('.es .lq-in', a); await page.click('.es .lq-check');
    check((await page.textContent('.es .lq-fb')) === 'Right.', 'energy-stores: quiz accepts the right answer'); }
};
