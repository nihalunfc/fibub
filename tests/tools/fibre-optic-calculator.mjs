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
