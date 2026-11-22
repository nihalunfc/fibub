// 6.2 The negation test: negate a choice; if the argument breaks, the argument needs it.
import { row, button, readout } from '../../kit.js';
import { stack, card, down, clear } from './_verbal.js';
const ARG = { ev: 'The city will run a new express bus along Main Street.', con: 'So there will be fewer cars on Main Street at rush hour.' };
const C = [
  { s: 'At least some drivers on Main Street will switch to the bus.', n: 'No drivers will switch to the bus.', need: true, why: 'If nobody switches, the bus takes no cars off the road. The argument collapses, so this is an assumption it needs.' },
  { s: 'Most drivers on Main Street will switch to the bus.', n: 'Fewer than half of the drivers will switch.', need: false, why: 'Even if only a few switch, there are still fewer cars. The argument survives, so this choice is too strong to be necessary.' },
  { s: 'The bus will not attract more new car trips than it removes.', n: 'The bus will attract more new car trips than it removes (for example, people driving to the stops).', need: true, why: 'If the bus creates more car trips than it saves, traffic rises. The argument breaks: this is needed.' },
  { s: 'Bus fares will be cheaper than parking downtown.', n: 'Bus fares will not be cheaper than parking.', need: false, why: 'People might still switch for speed or comfort. The argument can survive, so it does not need this.' },
  { s: 'Traffic on Main Street is the worst in the city.', n: 'Traffic on Main Street is not the worst in the city.', need: false, why: 'Whether it is the worst has nothing to do with whether it falls. Out of scope: the argument is untouched.' },
];
export default function (host) {
  let i = 0, neg = false;
  const box = stack(host); const ctl = row(host); const out = readout(host);
  const go = () => {
    const c = C[i]; clear(box);
    card(box, 'Evidence', ARG.ev); down(box);
    card(box, neg ? 'Choice, negated' : `Choice ${i + 1} of ${C.length}`, neg ? c.n : c.s, neg ? (c.need ? 'bad' : 'good') : 'gap'); down(box);
    const k = card(box, 'Conclusion', ARG.con, neg ? (c.need ? 'bad' : 'good') : '');
    if (neg && c.need) k.classList.add('vx-off');
    out.innerHTML = neg ? `<b>${c.need ? 'The argument breaks: the choice is necessary.' : 'The argument survives: not necessary.'}</b> ${c.why}` : 'Is the argument built on this? Press Negate to find out.';
    nb.textContent = neg ? 'Un-negate' : 'Negate';
  };
  const nb = button(ctl, 'Negate', () => { neg = !neg; go(); });
  button(ctl, 'Next choice', () => { i = (i + 1) % C.length; neg = false; go(); });
  go();
}
