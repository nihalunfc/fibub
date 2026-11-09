// #340 von Bertalanffy growth fitter
export const path = '/science/von-bertalanffy-fitter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.vbg ';
  const t = async (c) => (await page.textContent(R + c)) ?? '';
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(400); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  check((await t('.vb-big')) === 'L∞ 60.9 cm, K 0.212 per year, t₀ −0.7 years', 'von Bertalanffy: example fit');
  { const f = await t('.vb-facts'); check(f.includes('60.88 ± 3.11 cm') && f.includes('54.6 to 67.1') && f.includes('0.2123 ± 0.0303') && f.includes('0.151 to 0.273') && f.includes('2.9') && f.includes('2.45 cm') && f.includes('L∞ 60.4 cm, K 0.223'), 'von Bertalanffy: SEs, intervals, φ\', Ford-Walford'); }
  check((await t('.vb-fwnote')).includes('12.1 + 0.7998'), 'von Bertalanffy: Ford-Walford line');
  check(await page.isVisible(R + '.vb-fig1') && await page.isVisible(R + '.vb-fig2'), 'von Bertalanffy: both charts');
  { const tb = await t('.vb-tab'); check(tb.includes('Mean length (cm)') && tb.split('\n').length >= 1, 'von Bertalanffy: table by age'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vb-csv')]); const f = OUT + 'vb.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 51 && rows[0] === 'age,length_cm,fitted_cm,residual' && rows[1].startsWith('1,'), 'von Bertalanffy: CSV'); }
  await page.selectOption(R + '.vb-u', 'mm'); await page.waitForTimeout(400);
  check((await t('.vb-big')).includes('60.9 mm') && (await t('.vb-facts')).includes('φ\'0.896'), 'von Bertalanffy: mm unit changes φ\'');
  await page.selectOption(R + '.vb-u', 'cm');
  await fill('.vb-data', '1,20\n2,30\n3,38\n4,44\n5,48\n6,51');
  check((await t('.vb-big')).startsWith('L∞ 6') && await page.isVisible(R + '.vb-fig2'), 'von Bertalanffy: small exact-ish set');
  await fill('.vb-data', '1,20\n2,30\n3,38'); check((await t('.vb-err')).includes('at least 4 fish') && await page.isHidden(R + '.vb-out'), 'von Bertalanffy: too few fish message');
  await fill('.vb-data', '1,20\n1,22\n2,30\n2,31'); check((await t('.vb-err')).includes('3 different ages'), 'von Bertalanffy: too few ages message');
  await fill('.vb-data', '1,20\n2,-3'); check((await t('.vb-err')).includes('Row 2: give the length'), 'von Bertalanffy: bad length message');
  await fill('.vb-data', '1,20\n2,30\n3,38\n4,44\n5,48\n6,51\n7,53');
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check((await d.suggestedFilename()) === `von-bertalanffy.${f}`, `von Bertalanffy: ${f} download`); }
};
