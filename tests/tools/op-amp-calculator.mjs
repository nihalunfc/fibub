// #625 op-amp circuit calculator
export const path = '/science/op-amp-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.opa ';
  await page.goto(`${BASE}/science/op-amp-calculator/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(R + c), facts = () => t('.op-facts');
  check((await t('.op-big')) === 'Inverting: gain −10 (20 dB)', `opamp: example (${await t('.op-big')})`);
  { const f = await facts(); check(f.includes('90.92 kHz') && f.includes('noise gain 1/β = 11') && f.includes('± 9.998 V at 1 kHz') && f.includes('3.502 V to spare') && f.includes('1.35 V peak') && f.includes('7.959 kHz'), `opamp: example bandwidth, swing and slew (${f})`); }
  check(await page.isVisible(R + '.op-bode') && await page.isVisible(R + '.op-wave'), 'opamp: Bode plot and waveform');
  await page.fill(R + '.op-amp', '2'); await page.waitForTimeout(100);
  check((await facts()).includes('yes: the output hits the swing limit'), 'opamp: clipping at 2 V in');
  await page.fill(R + '.op-f', '20k'); await page.waitForTimeout(100);
  check((await facts()).includes('too slow'), 'opamp: slew-rate limit at 20 kHz');
  await page.fill(R + '.op-amp', '1'); await page.fill(R + '.op-f', '1k');
  await page.selectOption(R + '.op-cfg', 'noninv'); await page.waitForTimeout(100);
  check((await t('.op-big')) === 'Non-inverting: gain 11 (20.8 dB)' && (await facts()).includes('very high'), 'opamp: non-inverting');
  await page.selectOption(R + '.op-cfg', 'diff'); await page.fill(R + '.op-v2', '0.5'); await page.waitForTimeout(100);
  check((await t('.op-big')) === 'Difference: gain 10 (20 dB)' && (await facts()).includes('perfect (ratios match)') && (await facts()).includes('48.8 dB') && (await facts()).includes('5 V DC'), `opamp: difference amplifier (${await facts()})`);
  await page.fill(R + '.op-r4', '101k'); await page.waitForTimeout(100);
  check((await facts()).includes('60.9 dB'), 'opamp: mismatched difference amp CMRR');
  await page.selectOption(R + '.op-cfg', 'sum'); await page.fill(R + '.op-dc', '1, 1, 1'); await page.fill(R + '.op-amp', '0'); await page.waitForTimeout(100);
  check((await t('.op-big')) === 'Summing: Vout = −10 × V1 − 5 × V2 − 2.5 × V3' && (await facts()).includes('Output−17.5 V') && (await facts()).includes('yes'), `opamp: summing, −17.5 V clips (${await t('.op-big')})`);
  check(await page.isHidden(R + '.op-wave'), 'opamp: no waveform without a sine');
  await page.fill(R + '.op-dc', '0.2, 0.2'); await page.waitForTimeout(100);
  check((await facts()).includes('Output−3 V'), 'opamp: summing two of three inputs');
  await page.selectOption(R + '.op-cfg', 'int'); await page.fill(R + '.op-dc', '0'); await page.fill(R + '.op-amp', '1'); await page.fill(R + '.op-rf', ''); await page.waitForTimeout(100);
  check((await t('.op-big')) === 'Integrator: unity gain at 1.592 kHz' && (await facts()).includes('none: any DC input'), `opamp: integrator (${await t('.op-big')})`);
  await page.fill(R + '.op-rf', '1M'); await page.fill(R + '.op-dc', '0.1'); await page.waitForTimeout(100);
  check((await facts()).includes('DC gain −100') && (await facts()).includes('−10 V DC'), 'opamp: integrator with Rf');
  await page.fill(R + '.op-rf', ''); await page.waitForTimeout(100);
  check((await facts()).includes('drifts to the − rail'), 'opamp: integrator drifts with DC in');
  await page.selectOption(R + '.op-cfg', 'dif'); await page.fill(R + '.op-r1', '100'); await page.fill(R + '.op-rf', '10k'); await page.fill(R + '.op-dc', '0'); await page.waitForTimeout(100);
  check((await t('.op-big')).startsWith('Differentiator: gain 0.62') && (await facts()).includes('159.2 kHz'), `opamp: differentiator (${await t('.op-big')})`);
  await page.fill(R + '.op-r1', '0'); await page.waitForTimeout(100);
  check((await facts()).includes('may ring or oscillate'), 'opamp: differentiator stability note');
  await page.fill(R + '.op-c', 'x'); await page.waitForTimeout(100);
  check((await t('.op-err')).includes('Give C'), 'opamp: bad capacitor message');
  await page.fill(R + '.op-c', '10n'); await page.fill(R + '.op-vp', '-20'); await page.waitForTimeout(100);
  check((await t('.op-err')).includes('supplies'), 'opamp: bad supply message');
  await page.fill(R + '.op-vp', '15'); await page.waitForTimeout(100);
  // Working line and resistor picker.
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => { d.open = true; }));
  await page.selectOption(R + '.op-cfg', 'inv'); await page.fill(R + '.op-r1', '10k'); await page.fill(R + '.op-rf', '100k'); await page.waitForTimeout(100);
  check((await t('.op-work')) === 'Working: gain = −Rf ÷ R1 = −100 kΩ ÷ 10 kΩ = −10' && (await page.getAttribute(R + '.op-big', 'aria-live')) === 'polite', `opamp: working line (${await t('.op-work')})`);
  check((await t('.op-dbig')).startsWith('With R1 = 10 kΩ: Rf = 100 kΩ, nearest E24 100 kΩ gives gain 10 (exact)'), `opamp: picker exact (${await t('.op-dbig')})`);
  await page.fill(R + '.op-tg', '7'); await page.selectOption(R + '.op-tser', '12'); await page.waitForTimeout(100);
  check((await t('.op-dbig')).includes('Rf = 70 kΩ, nearest E12 68 kΩ gives gain 6.800 (−2.9 % off)'), `opamp: picker E12 (${await t('.op-dbig')})`);
  await page.selectOption(R + '.op-tser', '24'); await page.waitForTimeout(100);
  check((await t('.op-dsub')).includes('R1 = 13 kΩ, Rf = 91 kΩ, gain 7 (exact)'), `opamp: best pair (${await t('.op-dsub')})`);
  await page.click(R + '.op-use'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.op-r1')) === '13k' && (await page.inputValue(R + '.op-rf')) === '91k' && (await t('.op-big')) === 'Inverting: gain −7 (16.9 dB)', `opamp: use these resistors (${await t('.op-big')})`);
  await page.selectOption(R + '.op-cfg', 'noninv'); await page.fill(R + '.op-tg', '0.5'); await page.waitForTimeout(100);
  check((await t('.op-dbig')).includes('cannot have a gain below 1'), 'opamp: non-inverting gain below 1');
  await page.fill(R + '.op-tg', 'x'); await page.waitForTimeout(100);
  check((await t('.op-dbig')).includes('Give the gain you want'), 'opamp: bad target gain');
  await page.selectOption(R + '.op-cfg', 'int'); await page.fill(R + '.op-rf', ''); await page.waitForTimeout(100);
  check((await t('.op-dbig')).includes('Pick the inverting'), 'opamp: picker needs a gain circuit');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'opamp: Word download'); }
};
