// #498 Contrast checker: WCAG 2.x contrast, nearest passing colour and readability against a hand Python
// implementation (luminance and ratio by formula; nearest colour by brute force over 100,001 HSL lightness steps
// with Python's colorsys; Flesch scores with the same word, sentence and syllable rules).
import * as C from '../../src/lib/sci/contrast.ts';
import { cvdMatrix, simulate } from '../../src/lib/sci/colourvision.ts';

export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t;
  check('contrast: parse colours', C.parseColour('#abc').join() === '170,187,204' && C.parseColour('1A2B3C').join() === '26,43,60' && C.parseColour('rgb(26, 43, 60)').join() === '26,43,60' && C.parseColour('26 43 60').join() === '26,43,60');
  const msg = (s) => { try { C.parseColour(s); return ''; } catch (e) { return e.message; } };
  check('contrast: bad colours explained', /transparency/.test(msg('#11223344')) && /0 to 255/.test(msg('rgb(300, 0, 0)')) && /not a colour/.test(msg('blueish')));
  check('contrast: ratios = Python', near(C.contrast([119, 119, 119], [255, 255, 255]), 4.478089453577214) && near(C.contrast([118, 118, 118], [255, 255, 255]), 4.542224959605253) && C.contrast([0, 0, 0], [255, 255, 255]) === 21 && near(C.contrast([255, 0, 0], [255, 255, 255]), 3.9984767707539985) && near(C.contrast([0, 102, 204], [240, 240, 240]), 4.884682246289802) && near(C.contrast([214, 39, 40], [44, 160, 44]), 1.4764770829451577));
  check('contrast: order does not matter, same colour is 1', C.contrast([255, 255, 255], [119, 119, 119]) === C.contrast([119, 119, 119], [255, 255, 255]) && C.contrast([9, 9, 9], [9, 9, 9]) === 1);
  check('contrast: ratio text is cut, not rounded', C.ratioText(4.4999) === '4.49:1' && C.ratioText(4.478) === '4.47:1' && C.ratioText(21) === '21.00:1');
  check('contrast: WCAG levels', C.LEVELS.map((l) => l.need).join() === '4.5,3,7,4.5,3');
  // Nearest passing colour = brute force in Python (11 cases).
  const cases = [
    [[119, 119, 119], [255, 255, 255], 4.5, '118,118,118'], [[255, 0, 0], [255, 255, 255], 4.5, '238,0,0'], [[255, 0, 0], [255, 255, 255], 7, '182,0,0'],
    [[0, 102, 204], [30, 30, 30], 4.5, '6,131,255'], [[240, 200, 0], [255, 255, 255], 3, '176,146,0'], [[246, 212, 126], [127, 189, 195], 3, '123,90,9'],
    [[246, 134, 65], [230, 231, 243], 3, '223,92,11'], [[184, 80, 54], [158, 207, 203], 3, '179,78,53'], [[121, 156, 34], [129, 104, 160], 4.5, '246,251,234'],
    [[186, 174, 201], [154, 39, 215], 3, '193,183,207'], [[247, 209, 208], [3, 49, 122], 7, '247,209,208'],
  ];
  check('contrast: nearest passing colour = brute force', cases.every(([c, o, n, want]) => { const g = C.nearestPassing(c, o, n); return g && g.join() === want && C.contrast(g, o) >= n; }));
  check('contrast: impossible target gives null', C.nearestPassing([128, 128, 128], [128, 128, 128], 21) === null);
  check('contrast: HSL round trip', [[26, 43, 60], [255, 0, 0], [12, 200, 99], [128, 128, 128]].every((c) => C.fromHsl(...C.toHsl(c)).join() === c.join()));
  // Simulated colour vision: red on green collapses for deuteranopia.
  const red = simulate([214, 39, 40], cvdMatrix('deutan')), green = simulate([44, 160, 44], cvdMatrix('deutan'));
  check('contrast: red and green under deuteranopia', red.join() === '133,133,10' && green.join() === '135,135,52' && C.contrast(red, green) < 1.1);
  // Readability = Python, and Flesch's own textbook-style example (6 words, 1 sentence, 6 syllables: 116.145).
  const r1 = C.readability('The cat sat on the mat.');
  check('readability: short sentence', r1.words === 6 && r1.sentences === 1 && r1.syllables === 6 && near(r1.fre, 116.145, 1e-9) && near(r1.fk, -1.45, 1e-9));
  const r2 = C.readability('Contrast matters. People with low vision, colour vision deficiency or a glare-filled phone screen all need text that stands out clearly from its background! Is 3.5 a sentence break? No.');
  check('readability: punctuation and decimals = Python', r2.words === 31 && r2.sentences === 4 && r2.syllables === 46 && near(r2.fre, 73.43326612903226, 1e-9) && near(r2.fk, 4.942177419354842, 1e-9));
  const r3 = C.readability('Readability formulas estimate difficulty from sentence length and word length.\n\nThey cannot judge meaning, organisation or design');
  check('readability: blank line ends a sentence = Python', r3.words === 17 && r3.sentences === 2 && r3.syllables === 36 && near(r3.fre, 19.05455882352942, 1e-9) && near(r3.fk, 12.713235294117649, 1e-9));
  check('readability: syllable estimates', [['cat', 1], ['table', 2], ['make', 1], ['wanted', 2], ['jumped', 1], ['beautiful', 3], ['readability', 5], ['yellow', 2], ['boxes', 2], ['wishes', 2], ['makes', 1]].every(([w, n]) => C.syllables(w) === n));
  check('readability: empty text', Number.isNaN(C.readability('   ').fre) && C.readability('').words === 0);
  check('readability: bands', C.freBand(95) === 'very easy' && C.freBand(65) === 'plain English' && C.freBand(10) === 'very difficult');
};
