// #636 PID tuning simulator
export const path = '/science/pid-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/pid-simulator/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.pid .pi-big'), facts = () => page.textContent('.pid .pi-facts'), mf = () => page.textContent('.pid .pi-mfacts');
  const set = async (sel, v) => { await page.fill(`.pid ${sel}`, v); await page.waitForTimeout(450); };
  check((await big()) === 'Overshoot 4.78 %, settles in 12.3 s', `pid: example step response (${await big()})`);
  { const f = await facts(); check(f.includes('2.59 s') && f.includes('peak 1.048 at 7.55 s') && f.includes('integral action removes it') && f.includes('Slowest closed-loop poles') && f.includes('stable'), 'pid: rise time, peak, steady-state error, poles'); }
  { const m = await mf(); check(m.includes('10.9 dB (× 3.5)') && m.includes('67.7°') && m.includes('2.52 s'), 'pid: gain, phase and delay margins'); }
  check((await page.textContent('.pid .pi-plant')).startsWith('G(s) = (2) / (5s + 1) · e^(−1s)'), 'pid: plant formula');
  for (const c of ['.pi-step', '.pi-u', '.pi-mag', '.pi-ph']) check(await page.isVisible(`.pid ${c}`), `pid: figure ${c}`);
  { const z = await page.textContent('.pid .pi-zn'); check(z.includes('2.551') && z.includes('1.371') && z.includes('1.186') && (await page.textContent('.pid .pi-znote')).includes('Ku = 4.251'), 'pid: Ziegler-Nichols table'); }
  // Use the reaction-curve PID row
  await page.locator('.pid .pi-use').nth(5).scrollIntoViewIfNeeded(); await page.locator('.pid .pi-use').nth(5).click(); await page.waitForTimeout(400);
  check((await page.inputValue('.pid .pi-kp')) === '3' && (await page.inputValue('.pid .pi-ki')) === '1.5' && (await page.inputValue('.pid .pi-kd')) === '1.5' && (await big()) !== 'Overshoot 4.78 %, settles in 12.3 s', 'pid: Use fills the Z-N gains');
  // Slider moves Kp
  await page.locator('.pid .pi-kps').fill('1.5'); await page.waitForTimeout(400);
  check((await page.inputValue('.pid .pi-kp')) === '1.5', 'pid: Kp slider');
  // Derivative on measurement removes the kick: controller output at t=0 drops
  await set('.pi-kp', '1.2'); await set('.pi-ki', '0.3'); await set('.pi-kd', '0.5');
  const csv1 = async (name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pid .pi-csv')]); const f = OUT + name; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };
  { const rows = await csv1('pid1.csv'); const u0 = Number(rows[1].split(',')[3]); check(rows[0] === 'time_s,setpoint,output_y,controller_u' && Math.abs(u0 - 13.2) < 1e-6, `pid: response CSV, derivative kick u(0) = Kp + Kd/Tf = 13.2 (${u0})`); }
  await page.selectOption('.pid .pi-don', 'y'); await page.waitForTimeout(400);
  { const rows = await csv1('pid2.csv'); check(Math.abs(Number(rows[1].split(',')[3]) - 1.2) < 1e-6, 'pid: derivative on output: no kick, u(0) = Kp'); }
  await page.selectOption('.pid .pi-don', 'e');
  // Load disturbance and test settings
  await page.click('.pid summary'); await set('.pi-dist', '0.5'); await set('.pi-dat', '30'); await set('.pi-tend', '60');
  check((await facts()).includes('Load disturbance0.5 at 30 s') && (await facts()).includes('integral action brings it back'), 'pid: load disturbance');
  await page.selectOption('.pid .pi-band', '0.05'); await page.waitForTimeout(400);
  check((await facts()).includes('Settling time (±5 %)'), 'pid: 5 % settling band');
  await set('.pi-dist', '0'); await set('.pi-tend', '');
  // P only: steady-state error
  await set('.pi-ki', '0'); await set('.pi-kd', '0');
  check((await facts()).includes('no integral action') && (await facts()).includes('Steady-state error0.2'), `pid: P-only steady-state error 1 − 2.4/3.4`);
  // Unstable
  await set('.pi-kp', '6');
  check((await big()).startsWith('Unstable') && (await mf()).includes('−2.99 dB') && (await mf()).includes('−42.3°'), 'pid: unstable loop, negative margins');
  // Second order model
  await page.selectOption('.pid .pi-model', 'so'); await set('.pi-L', '0'); await set('.pi-kp', '2'); await set('.pi-ki', '1'); await set('.pi-kd', '0.2'); await set('.pi-tff', '0.02');
  check((await page.textContent('.pid .pi-plant')) === 'G(s) = (4) / (s^2 + 1.2s + 4)' && (await facts()).includes('Closed-loop poles'), 'pid: second-order plant without dead time');
  // Transfer function model
  await page.selectOption('.pid .pi-model', 'tf'); await set('.pi-num', '-1 1'); await set('.pi-den', '1 3 2'); await set('.pi-kp', '0.4'); await set('.pi-ki', '0.3'); await set('.pi-kd', '0.1'); await set('.pi-tff', '0.1');
  { const m = await mf(); check(m.includes('17 dB') && m.includes('80°'), `pid: transfer-function plant margins (GM 7.045 = 17 dB, PM 79.95°)`); }
  check((await facts()).includes('dips') , 'pid: right-half-plane zero shows the wrong-way dip');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pid .pi-bcsv')]); const f = OUT + 'bode.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 401 && rows[0] === 'omega_rad_s,magnitude_dB,phase_deg', 'pid: Bode CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.pid .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `pid-simulation.${fmt}`, `pid: ${fmt} report`); }
  // Bad input
  await set('.pi-den', '1'); check((await page.textContent('.pid .pi-err')).includes('needs at least one power of s') && await page.isHidden('.pid .pi-out'), 'pid: plant without a pole');
  await set('.pi-den', '1 1'); await set('.pi-num', '1 0 0'); check((await page.textContent('.pid .pi-err')).includes('improper'), 'pid: improper plant');
  await set('.pi-num', 'x'); check((await page.textContent('.pid .pi-err')).includes('highest power of s first'), 'pid: unreadable coefficients');
  await set('.pi-num', '1'); await set('.pi-kp', '0'); await set('.pi-ki', '0'); await set('.pi-kd', '0'); check((await page.textContent('.pid .pi-err')).includes('at least one gain'), 'pid: all gains zero');
  await set('.pi-kd', '1'); await set('.pi-tff', ''); check((await page.textContent('.pid .pi-err')).includes('With Kp = 0'), 'pid: derivative filter needed');
  await page.selectOption('.pid .pi-model', 'fo'); await set('.pi-kp', '1'); await set('.pi-tau', '0'); check((await page.textContent('.pid .pi-err')).includes('time constant'), 'pid: bad time constant');
  await set('.pi-tau', '5'); await set('.pi-L', '-1'); check((await page.textContent('.pid .pi-err')).includes('dead time'), 'pid: bad dead time');
  await set('.pi-L', '1'); check(await page.isVisible('.pid .pi-out'), 'pid: recovers');
};
