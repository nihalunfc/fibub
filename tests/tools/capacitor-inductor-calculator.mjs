// #911 capacitor and inductor calculator
export const path = '/science/capacitor-inductor-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/capacitor-inductor-calculator/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.cic .ci-big'), facts = () => page.textContent('.cic .ci-facts'), err = () => page.textContent('.cic .ci-err');
  const g = async (v) => { await page.selectOption('.cic .ci-g', v); await page.waitForTimeout(250); };
  const fill = async (k, v) => { await page.fill(`.cic .ci-${k}`, v); await page.waitForTimeout(200); };
  check((await big()) === 'C = 88.60 pF' && (await facts()).includes('8.860 nC') && (await facts()).includes('443 nJ') && (await facts()).includes('0.100 kV/mm'), 'capind: example plates');
  await fill('d2', '1');
  check((await big()) === 'C = 72.18 pF' && (await facts()).includes('Field in layer 10.0815 kV/mm') && (await facts()).includes('Field in layer 20.0185 kV/mm'), 'capind: two dielectric layers');
  await fill('d2', '0'); await page.selectOption('.cic .ci-mat', '2.1'); await page.waitForTimeout(250);
  check((await page.inputValue('.cic .ci-er')) === '2.1' && (await big()) === 'C = 185.9 pF', 'capind: material menu fills εr');
  await fill('V', '5000');
  check((await page.textContent('.cic .ci-warn')) === '', 'capind: no air warning with PTFE');
  await fill('er', '1');
  check((await page.textContent('.cic .ci-warn')).includes('breaks down'), 'capind: air breakdown warning');
  await fill('V', '100');
  await g('coax');
  check((await big()) === 'C = 105.4 pF, L = 237.4 nH, Z₀ = 47.45 Ω' && (await facts()).includes('0.667 c'), 'capind: coax example');
  await fill('len', '10');
  check((await big()).startsWith('C = 1.054 nF, L = 2.374 µH'), 'capind: coax length');
  await g('sphere');
  check((await big()) === 'C = 11.13 pF' && (await facts()).includes('isolated sphere'), 'capind: isolated sphere');
  await fill('rb', '20');
  check((await big()) === 'C = 22.25 pF', 'capind: concentric spheres');
  await g('twin');
  check((await big()) === 'C = 15.78 pF, L = 705.1 nH, Z₀ = 211.4 Ω', 'capind: twin wires');
  await g('plane');
  check((await big()) === 'C = 26.96 pF, L = 412.7 nH, Z₀ = 123.7 Ω', 'capind: wire over a plane');
  await g('solenoid');
  check((await big()) === 'L = 67.10 µH' && (await facts()).includes('0.8499') && (await facts()).includes('78.96 µH') && (await facts()).includes('2.513 mT'), 'capind: solenoid with Nagaoka correction');
  await page.selectOption('.cic .ci-core', '10'); await page.waitForTimeout(250);
  check((await big()) === 'L = 789.6 µH' && (await facts()).includes('not used'), 'capind: solenoid with a core');
  await g('torect');
  check((await big()) === 'L = 55.45 µH' && (await facts()).includes('1.386 nH'), 'capind: rectangular toroid');
  await page.selectOption('.cic .ci-core', '2000'); await page.waitForTimeout(250);
  check((await big()) === 'L = 110.9 mH' && (await page.textContent('.cic .ci-warn')).includes('saturate'), 'capind: ferrite toroid and saturation warning');
  await g('toround');
  check((await big()) === 'L = 86.24 µH', 'capind: round toroid');
  for (const t of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.cic .dl [data-f=${t}]`)]); check(d.suggestedFilename() === `capacitor-inductor.${t}`, `capind: ${t} report`); }
  // Values are kept per shape.
  await g('torect'); check((await page.inputValue('.cic .ci-mr')) === '2000', 'capind: values kept when switching shape');
  // Bad input
  await fill('tdo', '30'); check((await err()).includes('outside diameter must be larger') && await page.isHidden('.cic .ci-out'), 'capind: toroid size message');
  await g('toround'); await fill('tr', '40'); check((await err()).includes('tube radius'), 'capind: tube radius message');
  await g('sphere'); await fill('rb', '5'); check((await err()).includes('outer sphere must be larger'), 'capind: sphere message');
  await g('coax'); await fill('do', '0.5'); check((await err()).includes('shield must be wider'), 'capind: coax message');
  await g('twin'); await fill('D', '0.5'); check((await err()).includes('more than one wire diameter'), 'capind: twin message');
  await g('plane'); await fill('h', '0.2'); check((await err()).includes('above the plane'), 'capind: plane message');
  await g('plate'); await fill('A', 'x'); check((await err()).includes('Plate area'), 'capind: bad number message');
  await fill('A', '100'); await fill('er', '0.5'); check((await err()).includes('εr is 1 or more'), 'capind: εr below 1 message');
  // RC and RL charge and discharge time.
  await g('rc');
  check((await big()) === 'τ = R × C = 1 s' && (await page.getAttribute('.cic .ci-big', 'aria-live')) === 'polite', `capind: RC time constant (${await big()})`);
  { const f = await facts(); check(f.includes('Time to 50 %693.1 ms') && f.includes('Time to 90 %2.303 s') && f.includes('Time to charge to 3 V916.3 ms') && f.includes('510.8 ms') && f.includes('After 500 ms charging1.967 V') && f.includes('3.033 V') && f.includes('500 µA'), `capind: RC facts (${f})`); }
  check(await page.isVisible('.cic .ci-fig'), 'capind: RC chart');
  await fill('tg', '5');
  check((await facts()).includes('never reached'), 'capind: RC target at the supply is never reached');
  await fill('tg', '0'); await fill('tt', '0');
  check(!(await facts()).includes('Time to charge to') && !(await facts()).includes('After'), 'capind: RC target and time can be skipped');
  await fill('V', '0'); check((await err()).includes('Supply voltage'), 'capind: RC zero supply message');
  await fill('V', '5'); await fill('R', '-3'); check((await err()).includes('Resistance R'), 'capind: RC negative resistance message');
  await fill('R', '10000');
  await g('rl');
  check((await big()) === 'τ = L / R = 5 ms', `capind: RL time constant (${await big()})`);
  { const f = await facts(); check(f.includes('Time for the current to reach 80 mA5.493 ms') && f.includes('After 10 ms103.8 mA') && f.includes('120 mA') && (await page.textContent('.cic .ci-warn')).includes('voltage spike'), `capind: RL facts (${f})`); }
};
