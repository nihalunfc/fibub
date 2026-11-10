// #1357 names for new elements
export const path = '/learn/element-temp-name/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/element-temp-name/`); await page.waitForTimeout(600);
  const name = () => page.textContent('.en .en-name'), facts = () => page.textContent('.en .en-facts');
  check((await name()) === 'Ununennium (Uue)' && (await facts()).includes('period 8, group 1') && (await facts()).includes('none yet') && (await page.$$('.en .en-chip')).length === 4, 'element-temp-name: 119 Ununennium');
  check((await page.textContent('.en .en-backres')).includes('element 121'), 'element-temp-name: reads Unbiunium back as 121');
  await page.fill('.en .en-z', '122');
  check((await name()) === 'Unbibium (Ubb)' && (await facts()).includes('"bi" + "ium" → "bium"'), 'element-temp-name: 122 Unbibium with the bium rule');
  await page.fill('.en .en-z', '190');
  check((await name()) === 'Unennilium (Uen)' && (await facts()).includes('ennil'), 'element-temp-name: 190 Unennilium with the ennil rule');
  await page.fill('.en .en-z', '118');
  check((await name()) === 'Ununoctium (Uuo)' && (await facts()).includes('Oganesson (Og)') && (await facts()).includes('period 7, group 18'), 'element-temp-name: 118 was ununoctium, now oganesson');
  await page.click('.en .en-up'); await page.waitForTimeout(50);
  check((await page.inputValue('.en .en-z')) === '119' && (await page.inputValue('.en .en-zs')) === '119', 'element-temp-name: + 1 button and slider follow');
  await page.fill('.en .en-z', '42');
  check(!(await page.$eval('.en .en-err', (e) => e.hidden)) && (await name()) === '', 'element-temp-name: bad number message');
  await page.fill('.en .en-back', 'ubq');
  check((await page.textContent('.en .en-backres')).includes('Unbiquadium (Ubq) is element 124'), 'element-temp-name: symbol read back');
  await page.fill('.en .en-back', 'Unbizzium');
  check((await page.textContent('.en .en-backres')).startsWith('That is not'), 'element-temp-name: bad name message');
  check((await page.$$('.en .en-roots tbody tr')).length === 10, 'element-temp-name: roots table');
  const ans = await page.$eval('.en .sq-q', (e) => e.dataset.ans);
  await page.fill('.en .sq-q .sq-in', ans); await page.click('.en .sq-q .sq-check');
  check((await page.textContent('.en .sq-q .sq-res')) === 'Right!' && (await page.$$('.en .sq-q')).length === 4, 'element-temp-name: quiz');
};
