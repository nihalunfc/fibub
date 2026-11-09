// #551 Dimensional analysis (Buckingham Pi) helper
export const path = '/science/buckingham-pi/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.bpi ';
  const txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}/science/buckingham-pi/`); await page.waitForTimeout(800);
  check((await txt('.bp-big')) === '7 variables − rank 3 = 4 dimensionless groups', 'pi: pipe flow example, 4 groups');
  check((await txt('.bp-rel')) === 'ΔP / (V^2 ρ) = φ(l / D, μ / (D V ρ), ε / D)', 'pi: pipe flow relation');
  { const t = await txt('.bp-mat'); check(t.includes('M (mass)') && t.includes('L (length)') && t.includes('T (time)') && !t.includes('Θ') && t.includes('−3'), 'pi: dimension matrix'); }
  check((await txt('.bp-vt')).includes('kg m^−1 s^−2'), 'pi: SI units shown');
  check((await page.$$(R + '.bp-ns tr')).length === 5 && (await page.$$(R + '.bp-pt tr')).length === 5, 'pi: null-space basis and group tables');
  // Change repeating variables: untick ρ, tick μ.
  await page.uncheck(R + '.bp-rep input[data-j="4"]'); await page.waitForTimeout(200);
  check((await txt('.bp-rerr')).includes('Choose 3 repeating variables') && await page.isHidden(R + '.bp-res'), 'pi: too few repeating variables');
  await page.check(R + '.bp-rep input[data-j="5"]'); await page.waitForTimeout(200);
  check((await txt('.bp-rel')).includes('D V ρ / μ'), 'pi: μ repeating gives the Reynolds number');
  await page.uncheck(R + '.bp-rep input[data-j="5"]'); await page.check(R + '.bp-rep input[data-j="2"]'); await page.waitForTimeout(200);
  check((await txt('.bp-rerr')).includes('not independent'), 'pi: dependent repeating variables');
  await page.uncheck(R + '.bp-rep input[data-j="2"]'); await page.check(R + '.bp-rep input[data-j="4"]'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bp-csv')]); const f = OUT + 'pi.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'row,ΔP,D,l,V,ρ,μ,ε' && rows[1] === 'M,1,0,0,0,1,1,0' && rows.some((r) => r.startsWith('Pi3,μ / (D V ρ),0,-1,0,-1,-1,1,0')), 'pi: CSV of matrix and groups'); }
  // Presets.
  await page.selectOption(R + '.bp-pre', { label: 'Simple pendulum' }); await page.waitForTimeout(300);
  check((await txt('.bp-rel')) === 'P^2 g / l = φ(θ0)', 'pi: pendulum, mass drops out');
  await page.selectOption(R + '.bp-pre', { label: 'Blast wave radius (Taylor)' }); await page.waitForTimeout(300);
  check((await txt('.bp-rel')) === 'R^5 ρ / (t^2 E) = constant', "pi: Taylor's blast wave");
  await page.selectOption(R + '.bp-pre', { label: 'Heat transfer from a pipe (convection)' }); await page.waitForTimeout(300);
  check((await txt('.bp-big')).includes('rank 4 = 3') && (await txt('.bp-mat')).includes('Θ (temperature)') && (await txt('.bp-rel')) === 'h D / k = φ(μ / (D V ρ), D V ρ cp / k)', 'pi: convection, Nusselt and two more');
  // Own variables, the quantity helper, and errors.
  await page.fill(R + '.bp-vars', 'f, T^-1, frequency\nρ, M L^-3\nd, L'); await page.waitForTimeout(500);
  check((await page.inputValue(R + '.bp-pre')) === 'own' && (await txt('.bp-big')).includes('3 variables − rank 3 = 0'), 'pi: no group possible yet');
  await page.selectOption(R + '.bp-q', { label: 'Surface tension (M T^-2)' }); await page.fill(R + '.bp-qn', 'σ'); await page.click(R + '.bp-add'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.bp-vars')).endsWith('σ, M T^-2, surface tension') && (await txt('.bp-rel')) === 'f^2 ρ d^3 / σ = constant', 'pi: added surface tension; droplet oscillation group');
  await page.fill(R + '.bp-vars', 'V, L T^-1\nx, kg'); await page.waitForTimeout(500);
  check((await txt('.bp-err')).includes('Line 2 (x)') && (await txt('.bp-err')).includes('not a base dimension') && await page.isHidden(R + '.bp-out'), 'pi: bad dimension message');
  await page.fill(R + '.bp-vars', 'V, L⁻¹ T\nθ, 1\nA, L/T^2/M'); await page.waitForTimeout(500);
  check((await txt('.bp-vt')).includes('M^−1 L T^−2') && (await txt('.bp-vt')).includes('1 (dimensionless)'), 'pi: superscripts and slashes');
  await page.fill(R + '.bp-vars', 'V'); await page.waitForTimeout(500);
  check((await txt('.bp-err')).includes('Line 1'), 'pi: line without dimensions');
  await page.selectOption(R + '.bp-pre', { label: 'Pump power' }); await page.waitForTimeout(300);
  check((await txt('.bp-rel')) === 'P / (ρ n^3 D^5) = φ(Q / (n D^3))', 'pi: pump power and flow coefficients');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(d.suggestedFilename() === 'buckingham-pi.png', 'pi: report image'); }
};
