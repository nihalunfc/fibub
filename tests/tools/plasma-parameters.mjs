// #952 plasma parameter calculator
export const path = '/science/plasma-parameters/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ppc ';
  await page.goto(`${BASE}/science/plasma-parameters/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.pp-big');
  check((await big()) === 'Debye length 74.3 µm, plasma frequency 89.8 GHz, β = 0.0322', 'plasma: tokamak-like example headline');
  { const t = await page.textContent(R + '.pp-out'); check(t.includes('47.7 µm') && t.includes('2.88 mm') && t.includes('8.44 km') && t.includes('7739 km/s') && t.includes('1.72 × 10⁸') && t.includes('17.1'), 'plasma: example gyroradii, mean free path, Alfvén speed, ND, ln Λ'); }
  check((await page.textContent(R + '.pp-pills')).includes('Collisionless') && await page.isVisible(R + '.pp-fig') && await page.isVisible(R + '.pp-fig2'), 'plasma: regime notes and both figures');
  await page.selectOption(R + '.pp-pre', 'glow'); await page.waitForTimeout(150);
  { const t = await page.textContent(R + '.pp-out'); check((await big()).startsWith('Debye length 105 µm') && !(await big()).includes('β') && t.includes('none (no field)') && (await page.inputValue(R + '.pp-a')) === '40', `plasma: glow discharge preset, no field (${await big()})`); }
  await page.selectOption(R + '.pp-pre', 'wind'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pp-col')).includes('Plasma beta'), 'plasma: solar wind preset');
  await page.selectOption(R + '.pp-pre', 'tokamak'); await page.waitForTimeout(150);
  await page.selectOption(R + '.pp-nu', '1e6'); await page.fill(R + '.pp-n', '1e14'); await page.waitForTimeout(150);
  check((await big()).startsWith('Debye length 74.3 µm'), 'plasma: per cm³ unit gives the same result');
  await page.selectOption(R + '.pp-tu', 'K'); await page.waitForTimeout(150);
  check(Math.abs(Number(await page.inputValue(R + '.pp-te')) - 1.16045e8) < 1e3 && (await big()).startsWith('Debye length 74.3 µm'), 'plasma: switching to kelvin converts the temperatures');
  await page.selectOption(R + '.pp-bu', '1e-4'); await page.fill(R + '.pp-b', '50000'); await page.waitForTimeout(150);
  check((await big()).endsWith('β = 0.0322'), 'plasma: gauss unit');
  await page.selectOption(R + '.pp-ion', '1,1'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.pp-a')) === '1' && (await page.textContent(R + '.pp-len')).includes('2.04 mm'), 'plasma: proton ion choice');
  await page.fill(R + '.pp-ln', '15'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pp-col')).includes('as you gave it'), 'plasma: Coulomb log override');
  await page.fill(R + '.pp-ti', '0'); await page.waitForTimeout(150);
  check(!(await page.textContent(R + '.pp-len')).includes('Ion mean free path'), 'plasma: cold ions');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pp-csv')]); const f = OUT + 'plasma.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'group,quantity,value,unit' && rows.length > 15 && rows.some((r) => r.startsWith('length,Debye length (electrons),') && Math.abs(Number(r.split(',')[2]) / 7.434e-5 - 1) < 1e-3), 'plasma: CSV of all values'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'plasma-parameters.pdf', 'plasma: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check(d.suggestedFilename() === 'plasma-parameters.docx', 'plasma: Word download'); }
  await page.fill(R + '.pp-n', 'abc'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pp-err')).includes('electron density') && await page.isHidden(R + '.pp-out'), 'plasma: bad density message');
  await page.fill(R + '.pp-n', '1e14'); await page.fill(R + '.pp-z', '1.5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pp-err')).includes('whole number'), 'plasma: bad charge message');
  await page.fill(R + '.pp-z', '1'); await page.fill(R + '.pp-l', '-2'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pp-err')).includes('plasma size'), 'plasma: bad size message');
  await page.fill(R + '.pp-l', '1'); await page.fill(R + '.pp-te', '0'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pp-err')).includes('electron temperature'), 'plasma: bad temperature message');
};
