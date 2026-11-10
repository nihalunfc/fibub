// #1239 Divisibility test machine. Checked against Python's % operator: remainders on dividing by 2..11 for
// 98736 → [0,0,0,1,0,1,0,6,6,0], 123456789 → [1,0,1,4,3,1,5,0,9,5], 918082 → [0,1,2,2,4,4,2,1,2,0],
// 2520 → [0,…,0,1]; and on 3,000 random numbers up to 30 digits each rule's verdict must match the true remainder.
import { DIVISORS, cleanDigits, digitSum, altSum, digitSumChain, digitalRoot, chain7, rule } from '../../src/lib/sci/divis-j4.ts';

export default async (check) => {
  const P = { 98736: [0, 0, 0, 1, 0, 1, 0, 6, 6, 0], 123456789: [1, 0, 1, 4, 3, 1, 5, 0, 9, 5], 918082: [0, 1, 2, 2, 4, 4, 2, 1, 2, 0], 2520: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1] };
  check('divis: remainders match Python for the examples', Object.entries(P).every(([n, r]) => DIVISORS.every((d, i) => rule(n, d).rem === r[i])));
  let ok = true, seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 3000; k++) {
    const len = 1 + Math.floor(rnd() * 30); let s = String(1 + Math.floor(rnd() * 9));
    for (let i = 1; i < len; i++) s += Math.floor(rnd() * 10);
    if (k % 7 === 0) s = String(BigInt(s) * 7n * 11n);
    for (const d of DIVISORS) {
      const v = rule(s, d), t = Number(v.test), truth = BigInt(s) % BigInt(d) === 0n;
      if (v.yes !== truth) ok = false;
      // The number the rule looks at must give the same answer as the whole number.
      if (d !== 6 && ((d === 7 ? BigInt(v.test) % 7n === 0n : t % d === 0) !== truth)) ok = false;
    }
    const nine = Number(BigInt(s) % 9n);
    if (digitSum(s) % 9 !== nine || ((altSum(s) % 11) + 11) % 11 !== Number(BigInt(s) % 11n) || digitalRoot(s) !== (nine || 9)) ok = false;
  }
  check('divis: 3,000 random numbers: every rule agrees with the true remainder', ok);
  check('divis: chains and roots', digitSumChain('98736').join() === '33,6' && digitSumChain('7').length === 0 && digitalRoot('0') === 0 && digitalRoot('918') === 9 && altSum('918082') === -22);
  check('divis: 7 chain for 98736: 9873 − 12 = 9861, 986 − 2 = 984, 98 − 8 = 90, 9 − 0 = 9', chain7('98736').map((c) => String(c.to)).join() === '9861,984,90,9');
  check('divis: cleaning input', cleanDigits('12,345') === '12345' && cleanDigits('007') === '7' && cleanDigits('0') === '0' && cleanDigits('1.5') === null && cleanDigits('') === null);
};
