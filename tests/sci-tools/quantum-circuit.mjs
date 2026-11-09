// #927 quantum circuit simulator: a 29-gate, 4-qubit circuit using every supported gate and a custom gate,
// against a NumPy simulator built from Kronecker products and scipy.linalg.expm (written for the tests);
// OpenQASM round trip; Bell and GHZ outcomes; reader error messages.
import * as Q from '../../src/lib/sci/phqc.ts';

const PROG = `OPENQASM 2.0;
include "qelib1.inc";
gate mygate(a,b) x,y { u3(a,b,0.3) x; cx x,y; rz(a/2) y; }
qreg q[2]; qreg r[2];
creg c[4];
h q;
u3(0.4,1.1,-0.7) r[0];
mygate(0.9, pi/3) q[1], r[1];
ccx q[0],q[1],r[0];
cswap r[1],q[0],r[0];
cu1(pi/5) q[0],r[1];
cu3(0.3,0.2,0.1) r[0],q[1];
crz(1.3) q[1],q[0];
ch r[1],r[0];
sx q[0]; sxdg r[1]; tdg q[1]; sdg r[0]; y q[0]; z r[1];
rzz(0.7) q[0],r[1]; rxx(0.5) q[1],r[0];
cy q[0],r[0]; cz r[1],q[1]; swap q[0],r[1]; p(0.25) r[0]; u2(0.1,0.2) q[1]; rx(0.3) q[0]; ry(0.6) r[1]; crx(0.4) r[0],q[0]; cry(0.8) q[1],r[1];
measure r[1] -> c[3];
`;
export default async (check) => {
  const c = Q.parseQasm(PROG), st = Q.run(c);
  const ref = [[-0.012871040528, 0.029942811544], [-0.031729570567, -0.020123459196], [-0.22199220549, 0.025766641112]];
  check('circuit: 29 gates, 4 qubits, amplitudes match the NumPy/SciPy simulator', c.ops.length === 29 && c.n === 4 && ref.every(([a, b], i) => Math.abs(st.re[i] - a) < 1e-11 && Math.abs(st.im[i] - b) < 1e-11));
  check('circuit: state stays normalised', Math.abs(Q.probabilities(st).reduce((a, b) => a + b, 0) - 1) < 1e-13);
  { const st2 = Q.run(Q.parseQasm(Q.toQasm(c))); check('circuit: OpenQASM export reads back to the same state', st2.re.every((x, i) => Math.abs(x - st.re[i]) < 1e-14 && Math.abs(st2.im[i] - st.im[i]) < 1e-14)); }
  { const g = Q.parseQasm(Q.EXAMPLE), s = Q.run(g), o = Q.outcomes(g, s, 1000, 7); check('circuit: GHZ example gives 000 and 111 at 0.5 each', o.probs.size === 2 && Math.abs(o.probs.get('000') - 0.5) < 1e-14 && Math.abs(o.probs.get('111') - 0.5) < 1e-14 && o.counts.get('000') + o.counts.get('111') === 1000);
    const b = Q.blochVectors(s); check('circuit: GHZ qubits each have a zero Bloch vector (fully entangled)', b.every((v) => Math.hypot(...v) < 1e-14)); }
  { const s = Q.run(Q.parseQasm('OPENQASM 2.0; include "qelib1.inc"; qreg q[1]; h q[0]; s q[0];')); const b = Q.blochVectors(s)[0]; check('circuit: H then S gives Bloch vector (0, 1, 0)', Math.abs(b[0]) < 1e-15 && Math.abs(b[1] - 1) < 1e-15 && Math.abs(b[2]) < 1e-15); }
  { const g = Q.parseQasm('OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[1];\nx q[1];\nmeasure q[1] -> c[0];\n'), o = Q.outcomes(g, Q.run(g)); check('circuit: measure maps q[1] to c[0] (little-endian)', o.probs.get('1') === 1 && o.probs.size === 1); }
  { const g = Q.parseQasm('OPENQASM 2.0;\nqreg q[3];\nx q[0];\n'), o = Q.outcomes(g, Q.run(g)); check('circuit: without measure, q[0] is the rightmost bit', o.probs.get('001') === 1); }
  { const t = Date.now(), g = Q.parseQasm(`OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[20];\nh q;\ncx q[0],q[19];\n`), s = Q.run(g); check(`circuit: 20 qubits, 21 gates in ${Date.now() - t} ms`, Math.abs(s.re[0] - 2 ** -10) < 1e-15); }
  const err = (src) => { try { Q.parseQasm(src); return ''; } catch (e) { return e.message; } };
  check('circuit: unknown gate reported with its line', err('OPENQASM 2.0;\nqreg q[1];\nfoo q[0];').startsWith('Line 3: unknown gate "foo"'));
  check('circuit: wrong qubit count reported', err('OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncx q[0];').includes('cx takes 0 parameters and 2 qubits'));
  check('circuit: out-of-range qubit reported', err('OPENQASM 2.0;\nqreg q[2];\nx q[2];').includes('outside q[2]'));
  check('circuit: gate after measure reported', err('OPENQASM 2.0;\nqreg q[1];\ncreg c[1];\nmeasure q[0] -> c[0];\nx q[0];').includes('after it was measured'));
  check('circuit: reset is refused plainly', err('OPENQASM 2.0;\nqreg q[1];\nreset q[0];').includes('not supported'));
  check('circuit: too many qubits refused', err('OPENQASM 2.0;\nqreg q[21];').includes('more than'));
  check('circuit: OpenQASM 3 refused', err('OPENQASM 3.0;\nqubit q;').includes('OpenQASM 2'));
  check('circuit: same qubit twice refused', err('OPENQASM 2.0;\nqreg q[2];\ncx q[0],q[0];').includes('same qubit twice'));
};
