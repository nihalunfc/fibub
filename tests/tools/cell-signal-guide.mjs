// #T952 Cell Signal
export const path = '/everyday/cell-signal-guide/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/cell-signal-guide/`); await page.waitForTimeout(300);
  check(/cannot scan cell towers/.test(await page.textContent('.csg .note')), 'cell-signal-guide: says plainly what a browser cannot do');
  check(/^Fair/.test(await page.textContent('.csg .csg-rate')), 'cell-signal-guide: -95 dBm LTE is Fair');
  await page.fill('.csg .csg-dbm', '-75');
  check(/^Excellent/.test(await page.textContent('.csg .csg-rate')), 'cell-signal-guide: -75 dBm LTE is Excellent');
  await page.selectOption('.csg .csg-tech', 'umts'); await page.fill('.csg .csg-dbm', '-95');
  check(/^Fair/.test(await page.textContent('.csg .csg-rate')), 'cell-signal-guide: -95 dBm 3G is Fair');
  for (const [c, word] of [['ca', 'CRTC'], ['in', 'Tarang Sanchar'], ['uk', 'Ofcom'], ['us', 'FCC']]) {
    await page.click(`.csg [data-c="${c}"]`);
    check((await page.textContent('.csg .csg-country')).includes(word), `cell-signal-guide: ${c} lists ${word}`);
  }
  await page.click('.csg .csg-sample');
  check(await page.$$eval('.csg .csg-sum tbody tr', (r) => r.length) === 3, 'cell-signal-guide: sample compares three networks');
  check(/Strongest signal in your readings: Network B \(average -94 dBm/.test(await page.textContent('.csg .csg-best')), 'cell-signal-guide: Network B is strongest at -94 dBm');
  await page.fill('.csg .csg-place', 'Park'); await page.fill('.csg .csg-net', 'Network C'); await page.fill('.csg .csg-ldbm', '-90');
  await page.click('.csg .csg-add'); await page.waitForTimeout(200);
  check(await page.$$eval('.csg .csg-all tbody tr', (r) => r.length) === 7, 'cell-signal-guide: a reading is added');
  check(await page.evaluate(() => localStorage.getItem('fibub-cellreadings-v1') === null), 'cell-signal-guide: nothing stored unless ticked');
};
