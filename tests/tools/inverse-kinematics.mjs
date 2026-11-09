// #637 inverse kinematics for 2 and 3 link arms
export const path = '/science/inverse-kinematics/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.iks ';
  await page.goto(`${BASE}/science/inverse-kinematics/`); await page.waitForTimeout(600);
  check((await page.textContent(R + '.ik-big')) === 'θ1 = 62.956°, θ2 = -84.261°', 'ik: example elbow up');
  { const t = await page.textContent(R + '.ik-tab'); check(t.includes('Elbow down') && t.includes('-9.826') && t.includes('84.261'), 'ik: both solutions listed'); }
  check((await page.textContent(R + '.ik-facts')).includes('1.3416') && await page.isVisible(R + '.ik-fig'), 'ik: reach and drawing');
  await page.selectOption(R + '.ik-el', 'down'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ik-big')) === 'θ1 = -9.826°, θ2 = 84.261°', 'ik: elbow down');
  await page.check(R + '.ik-lim'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ik-facts')).includes('only elbow up is within the limits') && (await page.textContent(R + '.ik-tab')).includes('joint 2 outside'), 'ik: joint limits');
  await page.uncheck(R + '.ik-lim'); await page.selectOption(R + '.ik-el', 'up');
  await page.fill(R + '.ik-x', '1.8'); await page.fill(R + '.ik-y', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ik-big')).includes('(only solution)') && (await page.textContent(R + '.ik-facts')).includes('fully stretched'), 'ik: singular stretched pose');
  await page.fill(R + '.ik-x', '2.5'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ik-big')) === 'Out of reach' && (await page.textContent(R + '.ik-facts')).includes('0.7 too far'), 'ik: too far message');
  await page.fill(R + '.ik-x', '0.1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ik-facts')).includes('too close'), 'ik: too close message');
  { const t = await page.textContent(R + '.ik-ptab'); check(t.includes('out of reach') && t.includes('62.956'), 'ik: many targets (2 links)'); }
  await page.selectOption(R + '.ik-n', '3'); await page.fill(R + '.ik-x', '1.2'); await page.fill(R + '.ik-y', '0.5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.ik-big')) === 'θ1 = 67.494°, θ2 = -113.326°, θ3 = 75.832°' && (await page.textContent(R + '.ik-facts')).includes('wrist at (0.9402, 0.35)'), 'ik: 3-link with tool angle');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ik-csv')]); const f = OUT + 'ik.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0] === 'x,y,phi_deg,theta1_deg,theta2_deg,theta3_deg,note' && rows[5].endsWith('out of reach'), 'ik: joint angles CSV'); }
  await page.fill(R + '.ik-L2', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ik-err')).includes('link length') && await page.isHidden(R + '.ik-out'), 'ik: bad link length message');
  await page.fill(R + '.ik-L2', '0.8');
  await page.fill(R + '.ik-pts', '1, 1'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.ik-perr')).includes('tool angle'), 'ik: missing tool angle message');
  writeFileSync(OUT + 'ik-pts.csv', 'x,y,phi\n1.2,0.5,30\n0,1.5,90\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'ik-pts.csv'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.ik-ptab')).includes('67.494'), 'ik: targets opened from a file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'inverse-kinematics.png', 'ik: image report'); }
};
