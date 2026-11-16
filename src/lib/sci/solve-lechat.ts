// "Solve my numbers" for the Le Chatelier sandbox: which way an equilibrium shifts after a change (from the moles of
// gas on each side and whether the reaction is exothermic), which way it goes from Q and K, and K at a new temperature
// by the van 't Hoff equation. Plain maths, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { R } from './lechatelier.ts';

type Ctx = { find: string; ch: Record<string, string> };
type Dir = 'right' | 'left' | 'none';
const WORD: Record<Dir, string> = { right: 'to the right, towards the products', left: 'to the left, towards the reactants', none: 'neither way: nothing shifts' };
const PRESSURE = ['squeeze', 'expand', 'inertP'];

function shift(i: Record<string, SIn>, c: Ctx): SOut {
  const ch = c.ch.change ?? 'addR';
  const lines: string[] = [];
  let dir: Dir = 'none', kline = 'K does not change: only a change of temperature changes K.';
  const tip = 'Common mistakes: thinking a catalyst moves the equilibrium (it only gets you there faster), counting solids or liquids as gas moles, and thinking a change of pressure changes K (it does not).';
  if (PRESSURE.includes(ch)) {
    const nr = i.nr.v, np = i.np.v;
    if (!Number.isInteger(nr) || !Number.isInteger(np) || nr < 0 || np < 0) return { error: 'Type the moles of gas as whole numbers (the coefficients), 0 or more. Count only gases.' };
    const d = np - nr;
    lines.push(`Moles of gas: left = ${nr}, right = ${np}, so the change is ${d > 0 ? '+' : d < 0 ? '−' : ''}${Math.abs(d)} mol of gas from left to right.`);
    if (ch === 'squeeze' || ch === 'expand') {
      const up = ch === 'squeeze';
      if (d === 0) { dir = 'none'; lines.push(`Equal moles of gas on both sides, so ${up ? 'raising' : 'lowering'} the pressure favours neither side.`); }
      else { dir = (up ? d < 0 : d > 0) ? 'right' : 'left'; lines.push(`${up ? 'Higher pressure' : 'Lower pressure'} favours the side with ${up ? 'fewer' : 'more'} moles of gas, which is the ${dir === 'right' ? 'right' : 'left'}-hand side.`); }
    } else {
      lines.push('Adding an inert gas while the pressure is kept fixed makes the volume bigger, which lowers the partial pressure of every reacting gas, just like lowering the pressure.');
      if (d === 0) { dir = 'none'; lines.push('Equal moles of gas on both sides, so nothing shifts.'); }
      else { dir = d > 0 ? 'right' : 'left'; lines.push(`The side with more moles of gas (${dir === 'right' ? 'right' : 'left'}) is favoured.`); }
    }
  } else if (ch === 'heat' || ch === 'cool') {
    const exo = (c.ch.dh ?? 'exo') === 'exo', heat = ch === 'heat';
    dir = heat === exo ? 'left' : 'right';
    lines.push(`The forward reaction is ${exo ? 'exothermic (ΔH negative, it gives out heat)' : 'endothermic (ΔH positive, it takes in heat)'}.`, `${heat ? 'Heating' : 'Cooling'} the system makes it work against the change: it favours the ${heat ? 'endothermic' : 'exothermic'} direction, which is the ${dir === 'right' ? 'forward' : 'reverse'} reaction.`);
    kline = `K ${dir === 'right' ? 'increases' : 'decreases'}: a change of temperature is the only change that alters the value of K.`;
  } else if (ch === 'catalyst') {
    lines.push('A catalyst speeds up the forward and reverse reactions equally, so the equilibrium is reached faster but its position and K are unchanged.');
  } else if (ch === 'inertV') {
    lines.push('An inert gas added at constant volume does not change the concentration or partial pressure of any reacting gas, so Q still equals K.');
  } else {
    const reactant = ch === 'addR' || ch === 'remR', add = ch === 'addR' || ch === 'addP';
    dir = (add === reactant) ? 'right' : 'left';
    lines.push(`${add ? 'Adding' : 'Removing'} a ${reactant ? 'reactant' : 'product'} ${add ? 'raises' : 'lowers'} its concentration, so Q ${add === reactant ? 'falls below' : 'rises above'} K. To restore Q = K the system makes more ${dir === 'right' ? 'products' : 'reactants'}.`);
  }
  lines.push(kline);
  const answer = dir === 'none' ? `No shift: ${lines.some((l) => l.includes('Equal moles')) ? 'equal moles of gas on both sides' : ch === 'catalyst' ? 'a catalyst does not move the position' : 'the position stays the same'}, and K is unchanged.` : `The equilibrium shifts ${WORD[dir]}.`;
  return { answer, lines, tip };
}

function qk(i: Record<string, SIn>): SOut {
  const Q = i.Q.v, K = i.K.v;
  if (Q < 0 || !(K > 0)) return { error: 'Q cannot be negative and K must be more than 0.' };
  const lines = ['Compare the reaction quotient Q (same expression as K, but with the concentrations right now) with K.', `Q = ${sf(Q)}, K = ${sf(K)}`];
  if (Q === K) return { answer: 'Q equals K, so the system is at equilibrium and nothing shifts.', lines, tip: 'Q < K: too many reactants, shifts right. Q > K: too many products, shifts left.' };
  const right = Q < K;
  lines.push(right ? 'Q < K: there are too many reactants and too few products compared with equilibrium, so the net reaction goes forward.' : 'Q > K: there are too many products compared with equilibrium, so the net reaction goes backward.');
  return { answer: `Q ${right ? '<' : '>'} K, so the reaction shifts ${right ? 'to the right (forward)' : 'to the left (reverse)'} until Q = K.`, lines, tip: 'Q < K: too many reactants, shifts right. Q > K: too many products, shifts left. Use the same units for Q and K.' };
}

function vanHoff(i: Record<string, SIn>, c: Ctx): SOut {
  const toK = (x: number) => (c.ch.tk === 'c' ? x + 273.15 : x), T1 = toK(i.T1.typed), T2 = toK(i.T2.typed), K1 = i.K1.v, dH = i.dH.v;
  if (!(T1 > 0 && T2 > 0)) return { error: 'The temperature must be above absolute zero (0 K = −273.15 °C).' };
  if (T1 === T2) return { error: 'The two temperatures must be different.' };
  if (!(K1 > 0)) return { error: 'K must be more than 0.' };
  const lnr = (-dH * 1000 / R) * (1 / T2 - 1 / T1), K2 = K1 * Math.exp(lnr);
  const lines = ["van 't Hoff: ln(K₂/K₁) = −(ΔH/R)(1/T₂ − 1/T₁)", ...(c.ch.tk === 'c' ? [`Convert: ${sf(i.T1.typed)} °C = ${sf(T1, 5)} K and ${sf(i.T2.typed)} °C = ${sf(T2, 5)} K`] : []), `ln(K₂/K₁) = −(${sf(dH * 1000)} ÷ 8.314) × (1/${sf(T2, 5)} − 1/${sf(T1, 5)}) = ${sf(lnr)}`, `K₂ = ${sf(K1)} × e^${sf(lnr)} = ${sf(K2)}`, `Check: ${dH < 0 ? 'exothermic, so K falls when the temperature rises' : dH > 0 ? 'endothermic, so K rises when the temperature rises' : 'ΔH = 0, so K does not change'}.`];
  return { answer: `K at the new temperature is ${sf(K2)} (${K2 > K1 ? 'bigger' : K2 < K1 ? 'smaller' : 'the same'} than before).`, lines, tip: 'Common mistakes: using °C instead of kelvin, and leaving ΔH in J when the formula wants J/mol with R = 8.314 (the card converts kJ/mol for you).' };
}

export const LECHAT_SPEC: SSpec = {
  id: 'lechat',
  finds: [['shift', 'Which way does it shift?'], ['qk', 'Q against K'], ['vh', 'K at a new temperature']],
  fields: [
    { k: 'change', kind: 'choice', label: 'The change', def: 'addR', show: (c) => c.find === 'shift', options: [['addR', 'Add a reactant'], ['remR', 'Remove a reactant'], ['addP', 'Add a product'], ['remP', 'Remove a product'], ['squeeze', 'Increase pressure (smaller volume)'], ['expand', 'Decrease pressure (bigger volume)'], ['heat', 'Heat it'], ['cool', 'Cool it'], ['catalyst', 'Add a catalyst'], ['inertV', 'Add an inert gas, volume fixed'], ['inertP', 'Add an inert gas, pressure fixed']] },
    { k: 'dh', kind: 'choice', label: 'The forward reaction is', def: 'exo', show: (c) => c.find === 'shift' && (c.ch.change === 'heat' || c.ch.change === 'cool'), options: [['exo', 'Exothermic (ΔH negative)'], ['endo', 'Endothermic (ΔH positive)']] },
    { k: 'nr', label: 'Moles of gas on the left (reactants)', show: (c) => c.find === 'shift' && PRESSURE.includes(c.ch.change), ph: 'e.g. 4 for N₂ + 3H₂' },
    { k: 'np', label: 'Moles of gas on the right (products)', show: (c) => c.find === 'shift' && PRESSURE.includes(c.ch.change), ph: 'e.g. 2 for 2NH₃' },
    { k: 'Q', label: 'Reaction quotient Q', show: (c) => c.find === 'qk', ph: 'e.g. 0.8' },
    { k: 'K', label: 'Equilibrium constant K', show: (c) => c.find === 'qk', ph: 'e.g. 0.5' },
    { k: 'tk', kind: 'choice', label: 'Temperatures given in', def: 'k', show: (c) => c.find === 'vh', options: [['k', 'kelvin (K)'], ['c', 'degrees Celsius (°C)']] },
    { k: 'dH', label: 'ΔH of the forward reaction', units: [['kJ/mol', 1], ['J/mol', 1e-3]], neg: true, show: (c) => c.find === 'vh', ph: 'e.g. 57 or −92' },
    { k: 'K1', label: 'K at the first temperature', show: (c) => c.find === 'vh', ph: 'e.g. 0.10' },
    { k: 'T1', label: 'First temperature', neg: true, show: (c) => c.find === 'vh', ph: 'e.g. 330' },
    { k: 'T2', label: 'New temperature', neg: true, show: (c) => c.find === 'vh', ph: 'e.g. 350' },
  ],
  presets: [
    { name: 'N₂ + 3H₂ ⇌ 2NH₃: increase the pressure', find: 'shift', vals: { nr: '4', np: '2' }, ch: { change: 'squeeze' } },
    { name: 'N₂O₄ ⇌ 2NO₂ (endothermic): cool it', find: 'shift', vals: {}, ch: { change: 'cool', dh: 'endo' } },
    { name: 'H₂ + I₂ ⇌ 2HI: increase the pressure', find: 'shift', vals: { nr: '2', np: '2' }, ch: { change: 'squeeze' } },
    { name: 'Add an inert gas at constant volume', find: 'shift', vals: {}, ch: { change: 'inertV' } },
    { name: 'Add more reactant', find: 'shift', vals: {}, ch: { change: 'addR' } },
    { name: 'Q = 0.8 and K = 0.5', find: 'qk', vals: { Q: '0.8', K: '0.5' } },
    { name: 'K = 0.10 at 330 K, ΔH = +57 kJ/mol: K at 350 K', find: 'vh', vals: { dH: '57', K1: '0.10', T1: '330', T2: '350' }, ch: { tk: 'k' } },
  ],
  solve: (i, c) => (c.find === 'shift' ? shift(i, c) : c.find === 'qk' ? qk(i) : vanHoff(i, c)),
};
