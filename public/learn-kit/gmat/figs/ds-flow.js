// 8.1 The AD/BCE tree: answer yes or no at each step and watch the letters drop out.
import { row, button, readout } from '../../kit.js';
import { stack, card, clear } from './_verbal.js';
const LET = { A: '(1) alone only', B: '(2) alone only', C: 'together only', D: 'each alone', E: 'not even together' };
export default function (host) {
  let s1 = null, s2 = null, both = null;
  const box = stack(host), ctl = row(host), out = readout(host);
  const alive = () => {
    let L = ['A', 'B', 'C', 'D', 'E'];
    if (s1 === true) L = L.filter((x) => 'AD'.includes(x)); if (s1 === false) L = L.filter((x) => 'BCE'.includes(x));
    if (s2 === true) L = L.filter((x) => 'BD'.includes(x)); if (s2 === false) L = L.filter((x) => 'ACE'.includes(x));
    if (both === true) L = L.filter((x) => x !== 'E'); if (both === false) L = L.filter((x) => x !== 'C');
    return L;
  };
  const go = () => {
    clear(box); clear(ctl); const L = alive();
    card(box, 'Still possible', ['A', 'B', 'C', 'D', 'E'].map((x) => (L.includes(x) ? `<b>${x}</b> ${LET[x]}` : `<s>${x}</s>`)).join(' · '), L.length === 1 ? 'good' : '');
    const ask = (label, set) => { button(ctl, label + ': yes', () => { set(true); go(); }); button(ctl, label + ': no', () => { set(false); go(); }); };
    if (s1 === null) { ask('Is (1) alone sufficient', (v) => (s1 = v)); out.textContent = 'Step 1: cover statement (2). Is statement (1) enough on its own?'; }
    else if (s2 === null) { ask('Is (2) alone sufficient', (v) => (s2 = v)); out.textContent = `Step 2: forget (1). Is statement (2) enough on its own? (You are on ${s1 ? 'AD' : 'BCE'}.)`; }
    else if (L.length > 1) { ask('Are both together sufficient', (v) => (both = v)); out.textContent = 'Neither alone works. Now, and only now, put both statements together.'; }
    else out.innerHTML = `<b>Answer ${L[0]}:</b> ${LET[L[0]]}.${both === null ? ' Two steps were enough: you never needed to combine the statements.' : ''}`;
    if (s1 !== null) button(ctl, 'Start again', () => { s1 = s2 = both = null; go(); });
  };
  go();
}
