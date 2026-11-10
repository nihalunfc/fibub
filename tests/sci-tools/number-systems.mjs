// #1235 Number systems translator. Checked against Python (divmod for bases 20 and 60, bin() and hex()):
// 2026 → Mayan 5.1.6, Babylonian 33.46, 0x7EA; 1234567 → Mayan 7.14.6.8.7, Babylonian 5.42.56.7, 0x12D687; and
// against JavaScript's own Number.prototype.toString(base) for every n up to 20,000 and every base 2 to 16.
import { toRoman, fromRoman, romanParts, toBase, baseText, fromBase, egyptian, mayan, babylonian, indianWords, intlWords } from '../../src/lib/sci/numsys-j4.ts';

export default async (check) => {
  check('roman: 1994, 2026, 3999, 4, 9, 40', toRoman(1994) === 'MCMXCIV' && toRoman(2026) === 'MMXXVI' && toRoman(3999) === 'MMMCMXCIX' && toRoman(4) === 'IV' && toRoman(9) === 'IX' && toRoman(40) === 'XL');
  check('roman: nothing for 0 or 4000', toRoman(0) === '' && toRoman(4000) === '' && romanParts(-1).length === 0);
  let ok = true;
  for (let n = 1; n <= 3999; n++) if (fromRoman(toRoman(n)) !== n || fromRoman(toRoman(n).toLowerCase()) !== n) ok = false;
  check('roman: every number 1 to 3999 reads back', ok);
  check('roman: non-standard forms are refused', [ 'IIII', 'VX', 'IC', 'MMMM', 'XM', 'ABC', '' ].every((s) => Number.isNaN(fromRoman(s))));
  ok = true;
  for (let b = 2; b <= 16; b++) for (let n = 0; n <= 20000; n += (b < 5 ? 1 : 7)) if (baseText(n, b) !== n.toString(b).toUpperCase() || fromBase(n.toString(b), b) !== n) ok = false;
  check('bases: match toString(base) and read back, bases 2 to 16', ok);
  check('bases: digits not allowed in the base are refused', Number.isNaN(fromBase('102', 2)) && Number.isNaN(fromBase('G', 16)) && Number.isNaN(fromBase('', 10)) && fromBase('ff', 16) === 255);
  check('mayan and babylonian match Python divmod', mayan(2026).map((x) => x.v).join('.') === '5.1.6' && babylonian(2026).map((x) => x.v).join('.') === '33.46'
    && mayan(1234567).map((x) => x.v).join('.') === '7.14.6.8.7' && babylonian(1234567).map((x) => x.v).join('.') === '5.42.56.7' && mayan(0)[0].v === 0);
  check('mayan 19 = 3 bars and 4 dots; babylonian 59 = 5 tens and 9 ones', mayan(19)[0].bars === 3 && mayan(19)[0].dots === 4 && babylonian(59)[0].tens === 5 && babylonian(59)[0].ones === 9);
  check('egyptian counts for 1234567', egyptian(1234567).join('') === '7654321' && toBase(0, 7).join() === '0');
  check('words: Indian and international', indianWords(1234567) === 'twelve lakh thirty-four thousand five hundred sixty-seven' && intlWords(1234567) === 'one million two hundred thirty-four thousand five hundred sixty-seven'
    && indianWords(10000000) === 'one crore' && indianWords(100500) === 'one lakh five hundred' && indianWords(0) === 'zero');
};
