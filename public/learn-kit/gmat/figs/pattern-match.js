// 7.3 Pattern match: strip the topic from an idea, then find the case from another field with the same shape.
import { row, choice, readout } from '../../kit.js';
import { stack, card, clear, shuffle } from './_verbal.js';
const I = {
  fert: { name: 'Fertiliser', idea: 'Farmers buy more fertiliser when they can pay right after harvest, when they have cash, for delivery months later.',
    bare: 'People would gain from spending later, but struggle to hold money until then; letting them commit while they have cash fixes it.',
    cases: [
      { c: 'Workers save more for retirement when the money is taken from each paycheque automatically, before they can spend it.', ok: true, why: 'Same shape: commit the money at the moment you have it, for use much later.' },
      { c: 'Shoppers buy more fruit when its price is cut by half.', ok: false, why: 'A price effect. In the passage the price did not change.' },
      { c: 'Drivers slow down after a class shows them crash statistics.', ok: false, why: 'Information changing behaviour: the explanation the passage rejected.' },
      { c: 'A bakery sells more bread when it opens an hour earlier.', ok: false, why: 'Shares the word “timing” in spirit but has nothing to do with holding money until later.' } ] },
  street: { name: 'Street plans', idea: 'Cities keep old street plans because changing them means overriding many owners’ land claims.',
    bare: 'A design with many separate stakeholders is hard to change, even when a better one exists; change happens where control is concentrated.',
    cases: [
      { c: 'A keyboard layout stays in use for a century because millions of typists and makers would all have to switch at once.', ok: true, why: 'Same shape: many separate parties hold onto an old design; no one can change it alone.' },
      { c: 'A city rebuilds its harbour after a storm destroys it.', ok: false, why: 'Shares the topic (rebuilding a city) but not the logic: nothing about many owners blocking change.' },
      { c: 'A company switches all its staff to new software in one weekend because the owner decided to.', ok: false, why: 'This is the exception the passage predicts (concentrated control), not the main pattern. Close, but the question asks for the main idea.' },
      { c: 'A painter repaints a canvas many times before it is finished.', ok: false, why: 'One person changing a design freely: the opposite of the passage’s idea.' } ] },
};
export default function (host) {
  const ctl = row(host); const box = stack(host); const out = readout(host);
  const go = (k) => {
    const x = I[k]; clear(box);
    card(box, 'The passage’s idea', x.idea); card(box, 'Topic stripped away', x.bare, 'gap');
    const cs = shuffle(x.cases), els = cs.map((c, j) => card(box, 'Case ' + (j + 1), c.c, '', () => {
      els.forEach((e, n) => e.setAttribute('aria-pressed', String(n === j)));
      out.innerHTML = `<b>${c.ok ? 'Match.' : 'Not a match.'}</b> ${c.why}`;
    }));
    out.textContent = 'Which case has the same pattern?';
  };
  choice(ctl, 'Idea', Object.entries(I).map(([k, v]) => [k, v.name]), 'fert', go);
  go('fert');
}
