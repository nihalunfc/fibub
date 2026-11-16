// #934 Fibre optic calculator
export const path = '/science/fibre-optic-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.foc ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.fo-big'), facts = (n = '') => page.textContent(R + '.fo-facts' + n);
  check((await big()) === 'Single-mode at 1550 nm: V = 1.951, NA 0.120', `fibre: example single-mode (${await big()})`);
  { const f = await facts(); check(f.includes('±6.91°') && f.includes('1257 nm') && f.includes('b = 0.3999') && f.includes('1.44700') && f.includes('10.4 µm'), `fibre: example fibre facts ${f}`); }
  { const f = await facts('2'); check(f.includes('136 ps') && f.includes('3.24 GHz') && f.includes('Modal spreading0none'), `fibre: example spreading ${f}`); }
  { const f = await facts('3'); check((await page.textContent(R + '.fo-verdict')) === 'Works: 3.20 dB to spare after the 3 dB margin.' && f.includes('21.8 dB') && f.includes('−21.8 dBm') && f.includes('92.8 km'), `fibre: example budget ${await page.textContent(R + '.fo-verdict')}`); }
  check((await page.$$(R + '.fo-tab tr')).length === 2 && (await page.textContent(R + '.fo-tab')).includes('LP01') && await page.isVisible(R + '.fo-fig'), 'fibre: one guided mode and the power chart');
  // New options: what it would take, itemised loss budget and CSV, splitter and other losses, length unit.
  { const f = await facts('3'); check(f.includes('−3.20 dBm') && f.includes('0.661 %') && /Connectors you could add\s*6/.test(f), `fibre: what it would take (${f})`); }
  { const tb = await page.textContent(R + '.fo-lt'); check((await page.$$(R + '.fo-lt tr')).length === 7 && tb.includes('80 km × 0.250 dB/km') && tb.includes('21.8') && !tb.includes('Splitter'), `fibre: itemised budget (${tb})`); }
  await page.evaluate(() => document.querySelectorAll('.foc details').forEach((d) => { d.open = true; }));
  await page.fill(R + '.fo-sp', '8'); await page.fill(R + '.fo-spx', '0.5'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.fo-verdict')) === 'Does not work: 6.33 dB short (including the 3 dB margin).' && (await page.textContent(R + '.fo-lt')).includes('9.53') && (await facts('3')).includes('54.7 km'), `fibre: 1:8 splitter (${await page.textContent(R + '.fo-verdict')})`);
  await page.fill(R + '.fo-sp', '0'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.fo-err')).includes('Splitter ways'), 'fibre: bad splitter message');
  await page.fill(R + '.fo-sp', '1'); await page.fill(R + '.fo-ex', '2'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.fo-lt')).includes('Other losses') && (await page.textContent(R + '.fo-verdict')) === 'Works: 1.20 dB to spare after the 3 dB margin.', `fibre: other losses row (${await page.textContent(R + '.fo-verdict')})`);
  await page.fill(R + '.fo-ex', '0'); await page.selectOption(R + '.fo-lu', '1.609344'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.fo-L')) === '49.7097' && await page.isHidden(R + '.fo-err'), `fibre: miles convert the length (${await page.inputValue(R + '.fo-L')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fo-csv')]); check(d.suggestedFilename() === 'fibre-loss-budget.csv', 'fibre: loss budget CSV'); }
  await page.selectOption(R + '.fo-lu', '1'); await page.waitForTimeout(300);
  await page.fill(R + '.fo-l', '1000'); await page.waitForTimeout(300);
  check((await big()).startsWith('Multimode') && (await page.textContent(R + '.fo-tab')).includes('LP11') && (await page.inputValue(R + '.fo-pre')) === 'custom', 'fibre: below cut-off, LP11 appears');
  await page.selectOption(R + '.fo-pre', 'mms'); await page.waitForTimeout(800);
  check((await big()) === 'Multimode at 850 nm: V = 44.81, NA 0.242' && (await facts('2')).includes('67.6 ns') && (await page.textContent(R + '.fo-mnote')).includes('263 LP mode groups, 1022 modes'), `fibre: multimode step-index (${await page.textContent(R + '.fo-mnote')})`);
  await page.selectOption(R + '.fo-pre', 'mmg'); await page.waitForTimeout(400);
  check((await facts('2')).includes('222 ps') && (await page.textContent(R + '.fo-mnote')).includes('V²/4') && await page.isHidden(R + '.fo-mh'), 'fibre: graded index cuts modal spreading');
  await page.fill(R + '.fo-L', '10'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.fo-verdict')).startsWith('Does not work') && (await page.getAttribute(R + '.fo-verdict', 'class')).includes('bad'), 'fibre: too long a link fails the budget');
  await page.fill(R + '.fo-n2', '1.5'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.fo-err')).includes('lower than the core') && await page.isHidden(R + '.fo-out'), 'fibre: cladding above core message');
  await page.fill(R + '.fo-n2', '1.46'); await page.fill(R + '.fo-nc', '1.5'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.fo-err')).includes('whole numbers'), 'fibre: fractional connectors message');
  await page.fill(R + '.fo-nc', '2'); await page.fill(R + '.fo-d', '0'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.fo-err')).includes('core diameter'), 'fibre: bad core message');
  await page.selectOption(R + '.fo-pre', 'sm'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.fo-out') && (await big()).includes('V = 1.951'), 'fibre: back to the example');
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl [data-f=${fmt}]`)]); check(d.suggestedFilename().endsWith('.' + fmt), `fibre: ${fmt} download`); }
};
