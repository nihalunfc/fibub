// #351 Embryo development timer
export const path = '/science/embryo-development-timer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const P = '.em ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await page.textContent(P + '.em-conv')) === '24 h at 28.5 °C = 29.81 h (1 d 5 h 49 min) at 25 °C', `embryo: Kimmel conversion (${await page.textContent(P + '.em-conv')})`);
  { const t = await page.textContent(P + '.em-tab'); check(t.includes('Heartbeat seen2427.91') && t.includes('Hatching window opens4855.81') && t.includes('Hours at 26 °C'), 'embryo: stage plan at 26 °C'); }
  check((await page.textContent(P + '.em-hout')).startsWith('24 h in all = 20.16 hpf at 28.5 °C. Last stage reached: Somites forming.'), 'embryo: temperature history');
  // Fertilisation time drives the clock column.
  await page.fill(P + '.em-start', '2026-03-02T08:00'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.em-tab tbody tr:nth-child(4)')).includes('Tue 3 Mar, 11:54'), 'embryo: expected time from fertilisation (24 / 0.86 = 27.91 h)');
  { await page.locator(P + '.em-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.em-csv')]); const f = OUT + 'em.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 7 && r[0] === 'stage,hours_at_reference,hours_at_26C,expected_utc' && r[4].startsWith('Heartbeat seen,24,27.907,'), 'embryo: stage plan CSV'); }
  // Outside the range warning.
  await page.fill(P + '.em-t2', '20'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.em-warn')).includes('outside 25–33 °C') && (await page.textContent(P + '.em-conv')).includes('= 45.28 h'), 'embryo: 20 °C warning, 24 / 0.53 h');
  await page.fill(P + '.em-t2', '5'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.em-err1')).includes('needs T above 10.36'), 'embryo: below Kimmel base message');
  // Degree-hours model.
  await page.selectOption(P + '.em-model', 'degree'); await page.fill(P + '.em-base', '12'); await page.fill(P + '.em-ref', '20'); await page.fill(P + '.em-h', '40'); await page.fill(P + '.em-t1', '20'); await page.fill(P + '.em-t2', '24'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.em-conv')) === '40 h at 20 °C = 26.67 h (1 d 2 h 40 min) at 24 °C' && await page.isVisible(P + '.em-base'), `embryo: degree-hours conversion (${await page.textContent(P + '.em-conv')})`);
  check((await page.textContent(P + '.em-hout')).includes('degree-hours above 12 °C') && (await page.textContent(P + '.em-tab')).includes('Hours (h at 20 °C)'), 'embryo: degree-hours history and plan');
  await page.fill(P + '.em-ref', '10'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.em-err1')).includes('reference temperature must be above the base'), 'embryo: bad reference message');
  await page.fill(P + '.em-ref', '20');
  // Own stage list and bad lines.
  await page.fill(P + '.em-stages', 'Tailbud, 30\nHatch, 90'); await page.fill(P + '.em-T', '16'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.em-tab')).includes('Tailbud3060') && (await page.textContent(P + '.em-tab')).includes('Hatch90180'), 'embryo: own stages at 16 °C (base 12, ref 20)');
  await page.fill(P + '.em-stages', 'Tailbud'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.em-err2')).includes('Stage line 1'), 'embryo: bad stage line message');
  await page.fill(P + '.em-hist', '6 hours'); await page.waitForTimeout(200);
  check((await page.textContent(P + '.em-err3')).includes('Temperature line 1'), 'embryo: bad history line message');
  { await page.locator(P + '.dl [data-f=docx]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=docx]')]); const f = OUT + 'em.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'embryo: Word report'); }
};
