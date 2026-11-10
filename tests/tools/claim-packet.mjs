// #T910 Claim packet builder
import { readFileSync } from 'node:fs';
export const path = '/money/claim-packet/';
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/claim-packet/`); await page.waitForTimeout(400);
  await page.setInputFiles('.cp .cp-file', [{ name: 'a.png', mimeType: 'image/png', buffer: PNG }, { name: 'b.png', mimeType: 'image/png', buffer: PNG }]); await page.waitForTimeout(400);
  check((await page.locator('.cp .cp-rows tbody tr').count()) === 2, 'claim: 2 receipts listed');
  const rows = page.locator('.cp .cp-rows tbody tr');
  const fill = async (r, v) => { const ins = rows.nth(r).locator('input'); for (let i = 0; i < v.length; i++) await ins.nth(i).fill(v[i]); };
  await fill(0, ['2026-02-01', 'Dentist', 'Sam', 'Dental', '120', '']);
  await fill(1, ['2026-02-09', 'Pharmacy', 'Sam', 'Drugs', '45.50', '10']); await page.waitForTimeout(150);
  check((await page.textContent('.cp .cp-tp')).includes('165.50') && (await page.textContent('.cp .cp-tc')).includes('155.50'), 'claim: totals');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.cp .cp-pdf')]);
  const buf = readFileSync(await dl.path()).toString('latin1');
  const n = (buf.match(/\/Type\s*\/Page[^s]/g) || []).length;
  check(n === 4, `claim: PDF has 4 pages (${n})`);
  check((await page.textContent('.cp .cp-msg')).includes('4 pages'), 'claim: message shows page count');
};
