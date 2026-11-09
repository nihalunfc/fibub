// #634 modulation and BER: theory against scipy.special.erfc / scipy.integrate.quad (Craig's integral for 8-PSK)
// and against an independent exact QAM BER (sum over Gray PAM transition probabilities with scipy.stats.norm); the
// seeded simulation against theory and an independent NumPy Monte Carlo (400,000 symbols, default_rng).
import * as B from '../../src/lib/sci/eng-modem.ts';
export default async (check) => {
  const rel = (a, b, r) => Math.abs(a - b) <= r * Math.abs(b);
  const ref = {
    bpsk: [[4, 0.012500818040737566, 0.012500818040737566], [8, 0.00019090777407599314, 0.00019090777407599314]],
    qpsk: [[4, 0.012500818040737566, 0.024845365629787453], [8, 0.00019090777407599314, 0.00038177910237391366]],
    '8psk': [[4, 0.04578963458547459, 0.13736890375642377], [8, 0.006181051744216656, 0.018543155232649967]],
    '16qam': [[4, 0.058623737283404385, 0.2207293354761536], [8, 0.009247213741474412, 0.03664681110244028], [12, 0.00013865868881262526, NaN]],
    '64qam': [[4, 0.11852269700831115, 0.5739725179072928], [8, 0.052333862848892194, 0.2892825380373787], [12, 0.009723985083124257, NaN]],
  };
  for (const [m, rows] of Object.entries(ref)) for (const [e, ber, ser] of rows) {
    const t = B.theory(m, B.db(e));
    check(`ber: ${m} theory at ${e} dB vs SciPy (BER ${ber.toExponential(4)})`, rel(t.ber, ber, 1e-6) && (Number.isNaN(ser) || rel(t.ser, ser, 1e-6)));
  }
  // Gray coding: nearest neighbours differ in exactly one bit, average energy 1.
  for (const m of Object.keys(B.ORDER)) {
    const p = B.constellation(m), dmin = Math.min(...p.flatMap((a, i) => p.slice(i + 1).map((b) => Math.hypot(a.i - b.i, a.q - b.q))));
    const nn = p.flatMap((a, i) => p.slice(i + 1).filter((b) => Math.abs(Math.hypot(a.i - b.i, a.q - b.q) - dmin) < 1e-9).map((b) => a.bits ^ b.bits));
    const es = p.reduce((s, a) => s + a.i * a.i + a.q * a.q, 0) / p.length;
    check(`ber: ${m} Gray labels (neighbours differ by one bit), Es = 1, labels unique`, nn.every((x) => (x & (x - 1)) === 0 && x > 0) && Math.abs(es - 1) < 1e-12 && new Set(p.map((a) => a.bits)).size === p.length);
  }
  // Simulation (seed 1, 200,000 symbols) against theory, as the NumPy Monte Carlo also agrees with theory.
  const numpy = { bpsk: [0.0127525, 0.00022], qpsk: [0.01260125, 0.00019125], '8psk': [0.045434166666666664, 0.006164166666666667], '16qam': [0.05829, 0.009265625], '64qam': [0.11807625, 0.05207791666666667] };
  for (const [m, nb] of Object.entries(numpy)) [4, 8].forEach((e, j) => {
    const s = B.simulate(m, B.db(e), 200000, 1), t = B.theory(m, B.db(e)), [lo, hi] = B.wilson(s.bitErr, s.bits, 4.5);
    check(`ber: ${m} simulation at ${e} dB brackets theory and NumPy (${s.ber.toExponential(3)} vs ${nb[j].toExponential(3)})`, lo <= t.ber * (m === '8psk' ? 1.01 : 1) && hi >= t.ber * (m === '8psk' ? 0.99 : 1) && lo <= nb[j] * 1.02 && hi >= nb[j] * 0.98);
  });
  { const a = B.simulate('16qam', B.db(6), 5000, 42, 100), b = B.simulate('16qam', B.db(6), 5000, 42, 100); check('ber: same seed, same noise; keeps points for the plot', a.bitErr === b.bitErr && a.rx.length === 100 && a.rx[5].i === b.rx[5].i); }
  check('ber: Eb/N0 for BPSK at 1e-6 is 10.53 dB', Math.abs(B.ebn0For('bpsk', 1e-6) - 10.5298) < 1e-3);
  { const [lo, hi] = B.wilson(10, 1000); check('ber: Wilson interval (by hand: 0.005441 to 0.018310 for 10 in 1000)', Math.abs(lo - 0.0054408) < 1e-6 && Math.abs(hi - 0.0183095) < 1e-6); }
};
