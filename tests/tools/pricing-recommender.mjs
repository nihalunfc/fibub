// #T1068 Pricing recommender
import { recommend, roundPrice } from '../../src/lib/biz/pricing.ts';
export const path = '/money/pricing-recommender/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 100 places; 50 booked now, 40 at this point last year, 80 final last year; price 100; competitors 110, 100, 120.
  // Pace 50/40 = 1.25, so the pick-up is (80 - 40) x 1.25 = 50 and the forecast 100 (Compression). Middle competitor price 110.
  // Target 110 x (1 + 15%) x (1 + 6%, the pace adjustment capped at 6%) = 134.09, held to +15% of 100 = 115.
  const set = { capacity: 100, floor: 0, ceiling: 1000, maxChange: 15, position: 0, round: '1', sens: 'normal', t1: 60, t2: 80, t3: 92, eventBoost: 10, adjLow: -6, adjMod: 0, adjHigh: 6, adjComp: 15 };
  const r = recommend(set, [{ date: '2026-12-01', ev: false, evName: '', otb: 50, otbLy: 40, finLy: 80, bar: 100, c0: 110, c1: 100, c2: 120, c3: '' }], '2026-11-22', (v) => '$' + v).out[0];
  check(r.tier === 'Compression' && r.fc === 100 && r.rec === 115 && r.action === 'Raise' && r.reason.includes('target was $134.09'), 'pricing maths: hand-worked pick-up example');
  const e = recommend({ ...set, maxChange: 100 }, [{ date: '2026-12-01', ev: false, evName: '', otb: 10, otbLy: 10, finLy: 20, bar: 100, c0: 90, c1: 90, c2: 90, c3: 90 }], '2026-11-22', (v) => '$' + v).out[0];
  check(e.tier === 'Low' && Math.abs(e.rec - 85) < 1 && e.action === 'Lower', 'pricing maths: a quiet day below competitors is lowered (' + e.rec + ')');
  check(roundPrice(131, '9') === 129 && roundPrice(134, '9') === 139 && roundPrice(132, '5') === 130 && roundPrice(10.3, '0.5') === 10.5, 'pricing maths: rounding modes');

  await page.goto(`${BASE}/money/pricing-recommender/`); await page.waitForTimeout(400);
  await page.selectOption('.pr .pr-cur', 'USD');
  check((await page.locator('.pr .pr-plan tbody tr').count()) === 30 && (await page.textContent('.pr .pr-kpis')).includes('Days to raise'), 'pricing: the example plan has 30 days');
  await page.evaluate(() => document.querySelectorAll('.pr details').forEach((d) => (d.open = true)));
  await page.fill('.pr [data-k="capacity"]', '100'); await page.fill('.pr [data-k="floor"]', '0'); await page.fill('.pr [data-k="ceiling"]', '1000'); await page.selectOption('.pr [data-k="round"]', '1');
  await page.fill('.pr .pr-paste', 'date\tbooked now\tlast year at this point\tfinal last year\tcurrent price\tcompetitor 1\tcompetitor 2\tcompetitor 3\n2027-06-01\t50\t40\t80\t100\t110\t100\t120');
  await page.click('.pr .pr-load'); await page.waitForTimeout(150);
  const row = async () => (await page.textContent('.pr .pr-plan tbody tr')).replace(/\s+/g, ' ');
  let t = await row();
  check((await page.locator('.pr .pr-plan tbody tr').count()) === 1 && t.includes('Compression') && t.includes('$115') && t.includes('+$15'), 'pricing: pasted day gives $115 (' + t + ')');
  await page.uncheck('.pr .pr-plan [data-acc]'); await page.waitForTimeout(100);
  check((await page.textContent('.pr .pr-take')).includes("no change is accepted"), 'pricing: unticking keeps today\'s price');
  await page.fill('.pr [data-k="floor"]', '60'); await page.fill('.pr [data-k="ceiling"]', '50'); await page.waitForTimeout(100);
  check((await page.textContent('.pr .pr-swarn')).includes('floor must be lower'), 'pricing: a ceiling below the floor is flagged');
};
