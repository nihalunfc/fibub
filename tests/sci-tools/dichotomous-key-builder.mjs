// #321 dichotomous key builder. Reference results from an independent Python check (networkx 3.7: descendants
// for reached couplets, simple_cycles for loops, all_simple_paths for the path to each taxon) on the page's
// example key and on a deliberately broken key.
import { parseKey, checkKey, keyToText, keyToPrint, keyToJson, keyFromJson } from '../../src/lib/sci/dkey.ts';

const K1 = `Title: Simplified key to some common adult insect orders
1a. Front wings hardened or leathery, at least at the base ... 2
1b. Wings all thin and membranous or scaly, or only one pair of wings ... 3
2a. Front wings hard shells that meet in a straight line down the back ... Beetles (Coleoptera)
2b. Front wings leathery or half leathery, often overlapping ... 4
4a. Hind legs long and thickened for jumping; chewing mouthparts ... Grasshoppers and crickets (Orthoptera)
4b. Hind legs not thickened; mouthparts a jointed beak for piercing and sucking ... True bugs (Hemiptera)
3a. One pair of wings; hind wings reduced to tiny knobs ... Flies (Diptera)
3b. Two pairs of wings ... 5
5a. Wings covered in tiny scales that rub off as dust ... Butterflies and moths (Lepidoptera)
5b. Wings clear, without scales ... 6
6a. Narrow waist between thorax and abdomen; hind wings smaller than front wings ... Bees, wasps and ants (Hymenoptera)
6b. Long slender abdomen; very short antennae; both pairs of wings about the same size ... Dragonflies and damselflies (Odonata)`;
const K2 = `1a. A ... 2
1b. B ... Taxon one
2a. C ... 3
2b. D ... 7
3a. E ... 2
3b. F ... Taxon two
4a. G ... Taxon three
4b. H ... Taxon four
5a. I ... Taxon two
5b. J`;
export default async (check) => {
  const p1 = parseKey(K1), r1 = checkKey(p1.key);
  check('key: example reads with no errors', p1.errors.length === 0 && p1.key.couplets.size === 6 && p1.key.title.startsWith('Simplified key'));
  check('key: example has no issues', r1.issues.length === 0);
  check('key: all 6 couplets reached', [...r1.reached].sort().join() === '1,2,3,4,5,6');
  const path = (r, t) => (r.paths.get(t) ?? []).map((p) => p.join(' ')).join(' | ');
  check('key: path to Hymenoptera 1b 3b 5b 6a', path(r1, 'Bees, wasps and ants (Hymenoptera)') === '1b 3b 5b 6a');
  check('key: path to Orthoptera 1a 2b 4a', path(r1, 'Grasshoppers and crickets (Orthoptera)') === '1a 2b 4a');
  check('key: path to Diptera 1b 3a', path(r1, 'Flies (Diptera)') === '1b 3a');
  check('key: 7 taxa, longest path 4, mean 3', r1.taxa.length === 7 && r1.depth === 4 && r1.meanDepth === 3);
  // The broken key: a line with no destination, a loop 2 → 3 → 2, a dead end to couplet 7, couplets 4 and 5 never reached.
  const p2 = parseKey(K2), r2 = checkKey(p2.key), txt = r2.issues.map((i) => i.text).join(' | ');
  check('key: line with no destination reported', p2.errors.length === 1 && p2.errors[0].startsWith('Line 10'));
  check('key: loop 2 → 3 → 2 found', txt.includes('Loop: 2 → 3 → 2'));
  check('key: dead end to couplet 7', txt.includes('lead 2b goes to couplet 7, which does not exist'));
  check('key: couplets 4, 5 unreached', txt.includes('Couplets 4, 5 cannot be reached'));
  check('key: couplet 5 has one lead', txt.includes('Couplet 5 has only one lead'));
  check('key: unreached taxa three and four', txt.includes('Unreached taxa: Taxon three, Taxon four'));
  check('key: reached couplets as networkx', [...r2.reached].sort().join() === '1,2,3');
  check('key: Taxon two by one path 1a 2a 3b', path(r2, 'Taxon two') === '1a 2a 3b');
  // Expected taxa list.
  const r3 = checkKey(p1.key, ['Beetles (Coleoptera)', 'flies (diptera)', 'Mayflies (Ephemeroptera)']), t3 = r3.issues.map((i) => i.text).join(' | ');
  check('key: expected taxon missing from the key', t3.includes('never reaches: Mayflies (Ephemeroptera)'));
  check('key: key taxa not on the list (case-insensitive match)', t3.includes('not on your list') && !t3.includes('Flies (Diptera),') && t3.includes('True bugs (Hemiptera)'));
  // Other checks: three leads, a taxon keyed twice, both leads alike, primes as the second lead.
  const t4 = checkKey(parseKey("1. Red ... 2\n1'. Blue ... X\n2a. Big ... Y\n2b. Small ... X\n2c. Tiny ... Z").key).issues.map((i) => i.text).join(' | ');
  check('key: primes read as b leads, three leads flagged, X twice', t4.includes('Couplet 2 has 3 leads') && t4.includes('X keys out 2 times (2b, 1b)') && !t4.includes('Couplet 1 has'));
  const t5 = checkKey(parseKey('1a. Same → A\n1b. Same → A').key).issues.map((i) => i.text).join(' | ');
  check('key: arrows read; both leads alike flagged', t5.includes('same place') && t5.includes('same description'));
  // Round trips.
  const back = parseKey(keyToText(p1.key));
  check('key: text round trip', keyToText(back.key) === keyToText(p1.key) && back.key.title === p1.key.title);
  const j = JSON.parse(JSON.stringify(keyToJson(p1.key)));
  check('key: JSON round trip', keyToText(keyFromJson(j)) === keyToText(p1.key) && j.couplets.length === 6 && j.couplets[0].leads[0].to === 2);
  let msg = ''; try { keyFromJson({ hello: 1 }); } catch (e) { msg = e.message; }
  check('key: bad JSON refused', msg.includes('not a key file'));
  const pr = keyToPrint(p1.key, 60);
  check('key: printable lines fit and end with the destination', pr.split('\n').every((l) => l.length <= 60) && pr.includes('.. Beetles (Coleoptera)') && pr.includes('.. 2\n'));
};
