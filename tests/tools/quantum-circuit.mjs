// #927 quantum circuit simulator
export const path = '/science/quantum-circuit/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/quantum-circuit/`); await page.waitForTimeout(1200);
  const big = () => page.textContent('.qci .qc-big'), ot = () => page.textContent('.qci .qc-otab');
  const setSrc = async (s) => { await page.fill('.qci .qc-src', s); await page.waitForTimeout(700); };
  check((await big()) === '3 qubits, 4 gates: 2 possible outcomes', 'circuit: GHZ example');
  { const t = await ot(); const c = await page.$$eval('.qci .qc-otab tr', (r) => r.slice(1).map((x) => [x.cells[0].textContent, x.cells[1].textContent, +x.cells[2].textContent])); check(c.length === 2 && c.every((x) => x[1] === '0.5') && c[0][2] + c[1][2] === 1024 && t.includes('111'), 'circuit: 000 and 111 at 0.5 with 1024 shots'); }
  check((await page.textContent('.qci .qc-btab')).includes('q2') && (await page.$$eval('.qci .qc-btab tr', (r) => r.slice(1).map((x) => x.cells[4].textContent))).every((x) => x === '0'), 'circuit: entangled qubits have zero-length Bloch vectors');
  { const t = await page.textContent('.qci .qc-atab'); check(t.includes('|000⟩') && t.includes('−22.5°') && t.includes('22.5°'), 'circuit: state vector phases'); }
  check(await page.isVisible('.qci .qc-dia') && await page.isVisible('.qci .qc-hist'), 'circuit: diagram and histogram');
  await page.click('.qci .qc-new'); await page.waitForTimeout(300);
  await page.selectOption('.qci .qc-g', 'h'); await page.fill('.qci .qc-qs', '0'); await page.click('.qci .qc-add');
  await page.selectOption('.qci .qc-g', 'cx'); check((await page.inputValue('.qci .qc-qs')) === '0,1', 'circuit: two-qubit gate asks for two qubits'); await page.click('.qci .qc-add');
  await page.click('.qci .qc-meas'); await page.waitForTimeout(300);
  { const s = await page.inputValue('.qci .qc-src'); check(s.includes('h q[0];') && s.includes('cx q[0],q[1];') && s.includes('creg c[2];') && s.includes('measure q[1] -> c[1];'), 'circuit: built a Bell circuit with the gate picker'); }
  check((await big()) === '2 qubits, 2 gates: 2 possible outcomes' && (await ot()).includes('00') && (await ot()).includes('11'), 'circuit: Bell outcomes');
  await page.selectOption('.qci .qc-g', 'rx'); await page.fill('.qci .qc-par', 'pi'); await page.fill('.qci .qc-qs', '1'); await page.click('.qci .qc-add'); await page.waitForTimeout(300);
  { const s = await page.inputValue('.qci .qc-src'); check(s.indexOf('rx(pi) q[1];') < s.indexOf('measure'), 'circuit: added gates go before the measurements'); }
  check((await ot()).includes('01') && (await ot()).includes('10'), 'circuit: rx(pi) flips q1');
  await page.click('.qci .qc-undo'); await page.waitForTimeout(300);
  { const s = await page.inputValue('.qci .qc-src'); check(!s.includes('measure q[1] -> c[1];') && s.includes('measure q[0] -> c[0];'), 'circuit: remove last line'); }
  await setSrc('OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\nx q[0];\n');
  check((await ot()).includes('001') && (await page.textContent('.qci .qc-otab')).includes('no measure'), 'circuit: q[0] is the rightmost bit');
  await setSrc('OPENQASM 2.0;\ninclude "qelib1.inc";\ngate bell a,b { h a; cx a,b; }\nqreg q[2];\nbell q[0],q[1];\n');
  check((await big()) === '2 qubits, 2 gates: 2 possible outcomes', 'circuit: custom gate definition');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qci .qc-qasm')]); const f = OUT + 'c.qasm'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('OPENQASM 2.0;') && s.includes('h q[0];\ncx q[0],q[1];'), 'circuit: OpenQASM export expands the custom gate'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qci .qc-scsv')]); const f = OUT + 'sv.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 5 && r[0] === 'index,basis_state,re,im,probability' && r[1].startsWith('0,00,0.707106781187'), 'circuit: state vector CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qci .qc-csv')]); const f = OUT + 'oc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'outcome,probability,counts' && r.length === 3, 'circuit: outcomes CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qci .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'circuit: image report'); }
  writeFileSync(OUT + 'qft.qasm', 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[20];\nh q;\ncu1(pi/2) q[0],q[1];\n');
  await page.setInputFiles('.qci .qc-file', OUT + 'qft.qasm'); await page.waitForTimeout(2500);
  check((await big()).startsWith('20 qubits, 21 gates: 1,048,576') || (await big()).startsWith('20 qubits, 21 gates: 1048576'), `circuit: 20 qubits from a file (${await big()})`);
  check(await page.isDisabled('.qci .qc-scsv'), 'circuit: state vector CSV off above 16 qubits');
  await setSrc('OPENQASM 2.0;\nqreg q[2];\nfoo q[0];\n');
  check((await page.textContent('.qci .qc-err')).includes('Line 3: unknown gate "foo"') && await page.isHidden('.qci .qc-out'), 'circuit: unknown gate message');
  await setSrc('OPENQASM 2.0;\nqreg q[25];\n');
  check((await page.textContent('.qci .qc-err')).includes('more than'), 'circuit: too many qubits message');
  await setSrc('OPENQASM 2.0;\nqreg q[1];\ncreg c[1];\nmeasure q[0] -> c[0];\nx q[0];\n');
  check((await page.textContent('.qci .qc-err')).includes('after it was measured'), 'circuit: gate after measure message');
  await page.click('.qci .qc-ex'); await page.fill('.qci .qc-shots', '0'); await page.waitForTimeout(600);
  check((await page.textContent('.qci .qc-err')).includes('shots'), 'circuit: shots message');
};
