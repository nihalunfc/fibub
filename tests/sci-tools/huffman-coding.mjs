// #579 huffman-coding maths. Reference values from a Python script written for this check: heapq Huffman with the
// same tie rule (weight, then creation order; first popped gets 0) and an exact fractions.Fraction arithmetic coder
// with the same shortest-dyadic-interval tag rule.
import { huffman, encode, decode, tokens, countMessage, toIntegerCounts, arithEncode, arithDecode, canonicalCodes, fraction, decimal, log2ratio } from '../../src/lib/sci/huffman.ts';

const REF = [ // message, codes, average length, Huffman bits, low, high, arithmetic bits, information -log2 P
  ["abracadabra", {"a":"0","c":"100","d":"101","b":"110","r":"111"}, 2.090909090909091, "01101110100010101101110", "6874847395/25937424601", "75623371345/285311670611", "01000011110110101010100", 22.44410733057346],
  ["she sells sea shells by the sea shore", {"r":"0000","a":"0001","h":"001","s":"01","l":"100","b":"10100","y":"10101","t":"10110","o":"10111","e":"110"," ":"111"}, 3.081081081081081, "010011101110111010010001111011100001111010011101001000111110100101011111011000111011101110000111101001101110000110", "598335672450050063089416674431209814100577355804593245664/10555134955777783414078330085995832946127396083370199442517", "598335672450050063089416674431212796957196649583072660960/10555134955777783414078330085995832946127396083370199442517", "0000111010000011000001001101101101110100010010010100101011111100011011110110101011101011100011000101111000110011", 111.44680561946468],
  ["aaaaaaab", {"b":"0","a":"1"}, 1, "11111110", "5764801/16777216", "823543/2097152", "01011", 4.348515545596771],
  ["mississippi river", {"s":"00","p":"010","r":"011","m":"1000"," ":"1001","v":"1010","e":"1011","i":"11"}, 2.7058823529411766, "1000110000110000110100101110010111110101011011", "9253791630204939383/827240261886336764177", "9253791630217739383/827240261886336764177", "00000010110111010001101110101000100111000101000", 45.87722782681896],
];

export default async (check) => {
  for (const [msg, codes, avg, bits, lo, hi, abits, info] of REF) {
    const toks = tokens(msg), { syms, counts } = countMessage(toks);
    const h = huffman(syms, counts);
    check(`huffman: codes for "${msg}" match Python`, h.codes.every((c) => codes[c.sym] === c.code) && h.codes.length === Object.keys(codes).length);
    check(`huffman: average length for "${msg}"`, Math.abs(h.avg - avg) < 1e-12 && h.avg >= h.H - 1e-12 && h.avg < h.H + 1);
    check(`huffman: Kraft sum is 1 for "${msg}"`, Math.abs(h.kraft - 1) < 1e-12);
    const enc = encode(toks, h.codes);
    check(`huffman: encoded bits for "${msg}"`, enc === bits);
    check(`huffman: decodes back "${msg}"`, decode(enc, h.codes).toks.join('') === msg && decode(enc, h.codes).leftover === '');
    const can = canonicalCodes(h.codes);
    check(`huffman: canonical code keeps lengths and decodes "${msg}"`, can.every((c, i) => c.code.length === h.codes[i].code.length) && decode(encode(toks, can), can).toks.join('') === msg);
    const a = arithEncode(toks, syms, counts.map(BigInt));
    check(`arithmetic: final interval of "${msg}" matches Fraction`, fraction(a.lowN, a.den) === lo && fraction(a.highN, a.den) === hi);
    check(`arithmetic: tag bits of "${msg}"`, a.bits === abits && a.bits.length <= a.bound);
    check(`arithmetic: information of "${msg}"`, Math.abs(a.info - info) < 1e-9);
    check(`arithmetic: decodes "${msg}"`, arithDecode(a.bits, toks.length, syms, counts.map(BigInt)).join('') === msg);
  }
  const p = huffman(['a', 'b', 'c', 'd', 'e'], [0.4, 0.2, 0.2, 0.1, 0.1]);
  check('huffman: probabilities with ties match Python', JSON.stringify(p.codes.map((c) => c.code)) === '["11","00","01","100","101"]' && Math.abs(p.avg - 2.2) < 1e-12);
  const can = canonicalCodes(p.codes);
  check('huffman: canonical codes', JSON.stringify(can.map((c) => c.code)) === '["00","01","10","110","111"]');
  check('huffman: one symbol gets code 0', huffman(['x'], [5]).codes[0].code === '0' && huffman(['x'], [5]).avg === 1);
  check('huffman: zero weights dropped', huffman(['a', 'b', 'c'], [1, 0, 1]).codes.length === 2);
  check('huffman: bits that are no code word reported', (() => { try { decode('01', huffman(['x'], [5]).codes); return false; } catch (e) { return /not a code word/.test(e.message); } })());
  { const c = huffman(['a', 'b', 'c'], [2, 1, 1]).codes; const d = decode('0 10 1', c); check('huffman: spaces ignored, leftover bits kept', c.map((x) => x.code).join() === '0,10,11' && d.toks.join('') === 'ab' && d.leftover === '1'); }
  check('huffman: duplicate symbol rejected', (() => { try { huffman(['a', 'a'], [1, 1]); return false; } catch { return true; } })());
  check('arithmetic: weights to integer counts', JSON.stringify(toIntegerCounts(['0.25', '0.5', '0.25']).map(String)) === '["1","2","1"]' && JSON.stringify(toIntegerCounts(['1/3', '2/3']).map(String)) === '["1","2"]' && JSON.stringify(toIntegerCounts(['0.1', '0.15']).map(String)) === '["2","3"]');
  { const a = arithEncode(['b', 'a', 'c', 'b'], ['a', 'b', 'c'], toIntegerCounts(['0.25', '0.5', '0.25'])); check('arithmetic: probability model matches Fraction (45/128, 47/128, 0101101)', fraction(a.lowN, a.den) === '45/128' && fraction(a.highN, a.den) === '47/128' && a.bits === '0101101'); }
  check('arithmetic: unknown symbol rejected', (() => { try { arithEncode(['z'], ['a'], [1n]); return false; } catch (e) { return /not in the model/.test(e.message); } })());
  check('arithmetic: decimal of 45/128', decimal(45n, 128n, 10) === '0.3515625000');
  check('arithmetic: log2 of huge ratio', Math.abs(log2ratio(1n, 10n ** 400n) + 400 * Math.log2(10)) < 1e-9);
  check('huffman: word tokens when symbols are words', tokens('to be or', ['to', 'be', 'or']).length === 3 && tokens('abc', ['a', 'b', 'c']).length === 3);
};
