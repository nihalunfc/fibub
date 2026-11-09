// #342 respirometry calculator
export const path = '/science/respirometry-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.rsp ';
  const big = () => page.textContent(R + '.rs-big'), facts = () => page.textContent(R + '.rs-facts');
  await page.goto(`${BASE}/science/respirometry-calculator/`); await page.waitForTimeout(500);
  check((await big()) === 'V̇O₂ = 3.054 mL/min (183.3 mL/h)', 'respirometry: example V̇O₂');
  { const f = await facts(); check(f.includes('2.296 mL/min') && f.includes('0.752') && f.includes('1.012 W') && f.includes('87.45 kJ/day') && f.includes('499.2') && f.includes('6.109 mL O₂/(g·h)'), 'respirometry: example V̇CO₂, RQ, watts, Haldane flow, per gram'); }
  check((await page.textContent('.prose, main')).includes('not for clinical use'), 'respirometry: study and teaching note');
  await page.selectOption(R + '.rs-en', 'weir'); await page.waitForTimeout(250);
  check((await facts()).includes('1.016 W'), 'respirometry: Weir energy');
  await page.selectOption(R + '.rs-en', 'fixed'); await page.fill(R + '.rs-j', '20'); await page.waitForTimeout(250);
  check((await facts()).includes('1.018 W'), 'respirometry: fixed J per mL');
  await page.selectOption(R + '.rs-en', 'lighton');
  await page.selectOption(R + '.rs-at', 'out'); await page.waitForTimeout(250);
  check((await facts()).includes('incurrent is 500.76'), 'respirometry: flow measured after the chamber');
  await page.selectOption(R + '.rs-at', 'in');
  await page.selectOption(R + '.rs-stp', 'meas'); await page.fill(R + '.rs-T', '22'); await page.fill(R + '.rs-P', '99.5'); await page.waitForTimeout(250);
  check((await facts()).includes('454.4 mL/min'), 'respirometry: flow corrected to STPD');
  await page.selectOption(R + '.rs-stp', 'stpd'); await page.fill(R + '.rs-T', '20'); await page.fill(R + '.rs-P', '101.3');
  await page.click(R + '.rs-mode [data-m=o2]'); await page.waitForTimeout(250);
  check((await big()).startsWith('V̇O₂ = 3.641 mL/min') && (await facts()).includes('assumed RQ of 0.8') && await page.isHidden(R + '.rs-fico2'), 'respirometry: O₂ only with CO₂ scrubbed');
  await page.click(R + '.rs-mode [data-m=air]'); await page.waitForTimeout(250);
  check((await big()).startsWith('V̇O₂ = 0.3208 mL/min') && (await facts()).includes('R² = 0.9992') && await page.isVisible(R + '.rs-fig'), 'respirometry: closed air chamber with plot');
  await page.selectOption(R + '.rs-wet', 'dry'); await page.waitForTimeout(250);
  check((await big()).startsWith('V̇O₂ = 0.3283'), 'respirometry: dry chamber air');
  await page.fill(R + '.rs-blank', '-0.005'); await page.waitForTimeout(250);
  check((await facts()).includes('net of blank −0.03171'), 'respirometry: blank slope taken off');
  await page.click(R + '.rs-mode [data-m=water]'); await page.waitForTimeout(250);
  check((await facts()).includes('1.079 mg O₂/h') && (await big()).startsWith('V̇O₂ = 0.0126'), 'respirometry: closed water chamber');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rs-csv')]); const f = OUT + 'resp.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('Quantity,Value') && t.includes('O2 uptake (mg/h),1.079') && t.includes('RQ,0.8 (assumed)') && t.includes('Slope (mg/L per min),-0.0367143'), 'respirometry: CSV download'); }
  await page.fill(R + '.rs-data', '0, 8\n5, 8.2'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.rs-err')).includes('does not fall') && await page.isHidden(R + '.rs-out'), 'respirometry: rising O₂ message');
  await page.click(R + '.rs-mode [data-m=both]'); await page.fill(R + '.rs-feo2', '21.5'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.rs-err')).includes('must be lower'), 'respirometry: bad gas reading message');
  await page.fill(R + '.rs-feo2', '20.36'); await page.fill(R + '.rs-flow', ''); await page.waitForTimeout(300);
  check((await page.textContent(R + '.rs-err')).includes('flow rate'), 'respirometry: missing flow message');
};
