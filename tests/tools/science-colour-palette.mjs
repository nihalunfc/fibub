// #808 science colour palette
export const path = '/science/science-colour-palette/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/science-colour-palette/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.scp .sp-big'), code = () => page.inputValue('.scp .sp-code');
  check((await big()) === 'Colour-blind safe at ΔE 10: closest neighbours 11.3 (Protanopia)', 'palette: example sequential headline');
  check((await code()) === '#e8f3ff\n#89ccff\n#2ba4dc\n#007a9c\n#005161\n#002a30\n', 'palette: example sequential colours');
  { const f = await page.textContent('.scp .sp-facts'); check(f.includes('GreyscaleΔE 10.2') && f.includes('3 of 6 below 3:1'), 'palette: greyscale and contrast facts'); }
  { const t = await page.textContent('.scp .sp-tab'); check(t.includes('#e8f3ff') && t.includes('96, ') && t.includes('Low') && t.includes('OK'), 'palette: colour table'); }
  check(await page.isVisible('.scp .sp-sw') && await page.isVisible('.scp .sp-bars') && await page.isVisible('.scp .sp-heat'), 'palette: swatches, bars and heatmap');
  await page.fill('.scp .sp-n', '12'); await page.waitForTimeout(400);
  check((await big()).startsWith('Hard to tell apart') && (await code()).trim().split('\n').length === 12, 'palette: 12 steps are too close');
  await page.fill('.scp .sp-n', '6'); await page.fill('.scp .sp-l2', '99'); await page.waitForTimeout(400);
  check((await page.textContent('.scp .sp-err')) === 'Lightest must be above darkest (both 0 to 100).', 'palette: bad lightness message');
  await page.fill('.scp .sp-l2', '26'); await page.fill('.scp .sp-hue', '20'); await page.waitForTimeout(400);
  check(await page.isHidden('.scp .sp-err') && !(await code()).startsWith('#e8f3ff'), 'palette: hue changes the colours');
  await page.fill('.scp .sp-hue', '250'); await page.waitForTimeout(300);
  // Diverging: odd number, light middle.
  await page.click('.scp .sp-kind [data-k=diverging]'); await page.waitForTimeout(400);
  { const c = (await code()).trim().split('\n'); check(c.length === 7 && c[3] === '#f2f2f2' && (await big()).startsWith('Colour-blind safe'), `palette: diverging with a light middle (${c[3]})`); }
  check(await page.isHidden('.scp .sp-hue') && await page.isVisible('.scp .sp-ha'), 'palette: diverging settings shown');
  // Qualitative: best start hue.
  await page.click('.scp .sp-kind [data-k=qualitative]'); await page.waitForTimeout(800);
  check((await big()) === 'Colour-blind safe at ΔE 10: closest pair 12.1 (Protanopia)' && (await page.getAttribute('.scp .sp-qh', 'placeholder')) === 'best: 49', 'palette: qualitative picks the safest start hue');
  await page.fill('.scp .sp-qh', '0'); await page.waitForTimeout(600);
  check(!(await big()).includes('12.1'), 'palette: fixed start hue');
  await page.fill('.scp .sp-qh', ''); await page.waitForTimeout(600);
  // Custom list.
  await page.click('.scp .sp-kind [data-k=custom]'); await page.waitForTimeout(400);
  check((await big()) === 'Hard to tell apart: #33aa44 and #ee8822 differ by ΔE 4.15 with protanopia' && (await page.textContent('.scp .sp-facts')).includes('DeuteranopiaΔE 9.19'), 'palette: custom list flags green and orange');
  await page.check('.scp .sp-ord'); await page.waitForTimeout(300);
  check((await page.textContent('.scp .sp-facts')).includes('closest neighbours'), 'palette: ordered custom list compares neighbours');
  await page.fill('.scp .sp-hex', '#000000 #fff #nothex'); await page.waitForTimeout(400);
  check((await page.textContent('.scp .sp-err')).startsWith('"#nothex" is not a hex colour'), 'palette: bad hex message');
  await page.fill('.scp .sp-hex', '#0072b2, #e69f00'); await page.waitForTimeout(400);
  // Background.
  await page.fill('.scp .sp-bg', '#000000'); await page.waitForTimeout(400);
  check((await page.inputValue('.scp .sp-bgc')) === '#000000' && (await page.textContent('.scp .sp-tab')).includes(':1'), 'palette: dark background');
  await page.fill('.scp .sp-bg', 'black'); await page.waitForTimeout(400);
  check((await page.textContent('.scp .sp-err')).includes('background must be a hex'), 'palette: bad background message');
  await page.fill('.scp .sp-bg', '#ffffff'); await page.waitForTimeout(300);
  // Warning level.
  await page.fill('.scp .sp-warn', '60'); await page.waitForTimeout(400);
  check((await big()).startsWith('Hard to tell apart'), 'palette: stricter warning level');
  await page.fill('.scp .sp-warn', '10'); await page.waitForTimeout(300);
  // Preview vision.
  await page.selectOption('.scp .sp-vis', 'grey'); await page.waitForTimeout(300);
  check((await page.getAttribute('.scp .sp-bars', 'aria-label')).includes('Greyscale'), 'palette: preview in greyscale');
  // Exports.
  await page.fill('.scp .sp-name', 'Two groups');
  await page.selectOption('.scp .sp-fmt', 'css'); check((await code()).includes('--two-groups-1: #0072b2;'), 'palette: CSS export');
  await page.selectOption('.scp .sp-fmt', 'matplotlib'); check((await code()).includes('LinearSegmentedColormap.from_list("two_groups", two_groups)'), 'palette: matplotlib export (ordered list: a colour map)');
  await page.selectOption('.scp .sp-fmt', 'r'); check((await code()).includes('two_groups <- c("#0072b2", "#e69f00")'), 'palette: R export');
  await page.selectOption('.scp .sp-fmt', 'json');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.scp .sp-dl')]); const f = OUT + 'pal.json'; await d.saveAs(f); const j = JSON.parse(readFileSync(f, 'utf8')); check(d.suggestedFilename() === 'Two-groups.json' && j.colours.length === 2 && j.name === 'Two groups', 'palette: JSON download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.scp .dl [data-f=pdf]')]); const f = OUT + 'pal.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'palette: PDF report'); }
};
