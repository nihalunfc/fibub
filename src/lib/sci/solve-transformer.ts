// "Solve my numbers" for the transformer page: Vp / Vs = Np / Ns = Is / Ip for an ideal transformer, with an optional
// efficiency for the currents, and the power-line loss I²R. Plain maths on typed values with units, no DOM.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const U = (base: string, ...more: [string, number][]): [string, number][] => [[base, 1], ...more];
const conv = (i: SIn | undefined, base: string, what: string) => (i && !i.blank && i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);
const kindOf = (Vp: number, Vs: number) => (Vs > Vp ? 'step-up (the voltage goes up, so the current goes down)' : Vs < Vp ? 'step-down (the voltage goes down, so the current goes up)' : 'one-to-one');
const TIP = 'Common mistake: turning the ratio upside down. The side with more turns has the higher voltage: Vs / Vp = Ns / Np. Current goes the other way: Is / Ip = Np / Ns.';

export function transformerSolve(i: Record<string, SIn>, find: string): SOut {
  const lines: string[] = [];
  for (const k of ['Vp', 'Vs', 'Np', 'Ns', 'Ip', 'Is']) { const x = i[k]; if (x && !x.blank && !(x.v > 0)) return { error: `${({ Vp: 'The primary voltage', Vs: 'The secondary voltage', Np: 'The primary turns', Ns: 'The secondary turns', Ip: 'The primary current', Is: 'The secondary current' } as any)[k]} must be above zero.` }; }
  const effPct = i.eff && !i.eff.blank ? i.eff.v : 100;
  if (!(effPct > 0 && effPct <= 100)) return { error: 'Efficiency must be above 0% and at most 100%. A transformer cannot give out more power than it takes in.' };
  const eta = effPct / 100;
  if (find === 'Vs' || find === 'Vp' || find === 'Ns' || find === 'Np') {
    lines.push(...conv(i.Vp, 'V', 'the primary voltage'), ...conv(i.Vs, 'V', 'the secondary voltage'), 'Formula: Vp / Vs = Np / Ns');
    let Vp = i.Vp?.v, Vs = i.Vs?.v, Np = i.Np?.v, Ns = i.Ns?.v, answer = '';
    if (find === 'Vs') { Vs = (Vp * Ns) / Np; lines.push(`Vs = Vp × Ns / Np = ${sf(Vp)} × ${sf(Ns)} ÷ ${sf(Np)} = ${sf(Vs)} V`); answer = `The secondary voltage is ${eng(Vs, 'V')}.`; }
    else if (find === 'Vp') { Vp = (Vs * Np) / Ns; lines.push(`Vp = Vs × Np / Ns = ${sf(Vs)} × ${sf(Np)} ÷ ${sf(Ns)} = ${sf(Vp)} V`); answer = `The primary voltage is ${eng(Vp, 'V')}.`; }
    else if (find === 'Ns') { Ns = (Np * Vs) / Vp; lines.push(`Ns = Np × Vs / Vp = ${sf(Np)} × ${sf(Vs)} ÷ ${sf(Vp)} = ${sf(Ns)}`); answer = Math.abs(Ns - Math.round(Ns)) > 0.05 ? `The secondary needs ${sf(Ns, 4)} turns, so use about ${Math.round(Ns)} (turns are whole numbers).` : `The secondary needs ${Math.round(Ns)} turns.`; }
    else { Np = (Ns * Vp) / Vs; lines.push(`Np = Ns × Vp / Vs = ${sf(Ns)} × ${sf(Vp)} ÷ ${sf(Vs)} = ${sf(Np)}`); answer = Math.abs(Np - Math.round(Np)) > 0.05 ? `The primary needs ${sf(Np, 4)} turns, so use about ${Math.round(Np)} (turns are whole numbers).` : `The primary needs ${Math.round(Np)} turns.`; }
    lines.push(`Turns ratio Ns / Np = ${sf(Ns / Np)}: a ${kindOf(Vp, Vs)} transformer.`);
    return { answer, lines, tip: TIP };
  }
  // Currents: power in = power out ÷ efficiency.
  lines.push(...conv(i.Vp, 'V', 'the primary voltage'), ...conv(i.Vs, 'V', 'the secondary voltage'), ...conv(i.Ip, 'A', 'the primary current'), ...conv(i.Is, 'A', 'the secondary current'));
  const Vp = i.Vp.v, Vs = i.Vs.v;
  if (find === 'Ip') {
    const Is = i.Is.v, Pout = Vs * Is, Pin = Pout / eta, Ip = Pin / Vp;
    lines.push('Formula: power out = Vs Is, power in = power out ÷ efficiency, Ip = power in ÷ Vp', `Power out = ${sf(Vs)} × ${sf(Is)} = ${eng(Pout, 'W')}`, `Power in = ${eng(Pout, 'W')} ÷ ${sf(eta, 3)} = ${eng(Pin, 'W')}`, `Ip = ${eng(Pin, 'W')} ÷ ${sf(Vp)} V = ${eng(Ip, 'A')}`);
    if (eta < 1) lines.push(`Lost as heat in the transformer: ${eng(Pin - Pout, 'W')}`);
    return { answer: `The primary current is ${eng(Ip, 'A')}.`, lines, tip: TIP };
  }
  const Ip = i.Ip.v, Pin = Vp * Ip, Pout = Pin * eta, Is = Pout / Vs;
  lines.push('Formula: power in = Vp Ip, power out = power in × efficiency, Is = power out ÷ Vs', `Power in = ${sf(Vp)} × ${sf(Ip)} = ${eng(Pin, 'W')}`, `Power out = ${eng(Pin, 'W')} × ${sf(eta, 3)} = ${eng(Pout, 'W')}`, `Is = ${eng(Pout, 'W')} ÷ ${sf(Vs)} V = ${eng(Is, 'A')}`);
  return { answer: `The secondary current is ${eng(Is, 'A')}.`, lines, tip: TIP };
}

const find2 = (c: { find: string }) => c.find;
export const TRANSFORMER_SPEC: SSpec = {
  id: 'transformer',
  finds: [['Vs', 'Secondary voltage Vs'], ['Vp', 'Primary voltage Vp'], ['Ns', 'Secondary turns Ns'], ['Np', 'Primary turns Np'], ['Ip', 'Primary current Ip'], ['Is', 'Secondary current Is']],
  fields: [
    { k: 'Vp', label: 'Primary voltage Vp', units: U('V', ['kV', 1e3], ['mV', 1e-3]), show: (c) => find2(c) !== 'Vp', ph: 'e.g. 230' },
    { k: 'Vs', label: 'Secondary voltage Vs', units: U('V', ['kV', 1e3], ['mV', 1e-3]), show: (c) => find2(c) !== 'Vs', ph: 'e.g. 12' },
    { k: 'Np', label: 'Primary turns Np', show: (c) => ['Vs', 'Vp', 'Ns'].includes(find2(c)), ph: 'e.g. 1000' },
    { k: 'Ns', label: 'Secondary turns Ns', show: (c) => ['Vs', 'Vp', 'Np'].includes(find2(c)), ph: 'e.g. 50' },
    { k: 'Ip', label: 'Primary current Ip', units: U('A', ['mA', 1e-3]), show: (c) => find2(c) === 'Is', ph: 'e.g. 0.5' },
    { k: 'Is', label: 'Secondary current Is', units: U('A', ['mA', 1e-3]), show: (c) => find2(c) === 'Ip', ph: 'e.g. 5' },
    { k: 'eff', label: 'Efficiency % (blank = ideal, 100%)', optional: true, show: (c) => ['Ip', 'Is'].includes(find2(c)), ph: 'e.g. 90' },
  ],
  presets: [
    { name: 'Step-down 240 V to 12 V, 2000 primary turns: find Ns', find: 'Ns', vals: { Vp: '240', Vs: '12', Np: '2000' } },
    { name: '500 primary and 50 secondary turns on 230 V: find Vs', find: 'Vs', vals: { Vp: '230', Np: '500', Ns: '50' } },
    { name: 'Step-up: 11 V, 100 turns to 2000 turns: find Vs', find: 'Vs', vals: { Vp: '11', Np: '100', Ns: '2000' } },
    { name: '12 V, 5 A load from 230 V mains at 90%: find Ip', find: 'Ip', vals: { Vp: '230', Vs: '12', Is: '5', eff: '90' } },
    { name: '230 V and 9 V, 60 secondary turns: find Np', find: 'Np', vals: { Vp: '230', Vs: '9', Ns: '60' } },
  ],
  solve: (i, c) => transformerSolve(i, c.find),
};

/** Power line: sending P at voltage V through a line of total resistance R loses I² R as heat. */
export function lineSolve(i: Record<string, SIn>, find: string): SOut {
  const lines: string[] = [];
  const P = i.P.v, R = i.R.v;
  if (!(P > 0)) return { error: 'The power to send must be above zero.' };
  if (!(R >= 0)) return { error: 'The line resistance cannot be negative.' };
  lines.push(...conv(i.P, 'W', 'the power'), ...conv(i.V, 'V', 'the line voltage'));
  if (find === 'loss') {
    const V = i.V.v;
    if (!(V > 0)) return { error: 'The line voltage must be above zero.' };
    const I = P / V, loss = I * I * R, share = loss / P;
    lines.push('Formula: I = P ÷ V, then loss = I² R', `I = ${eng(P, 'W')} ÷ ${sf(V)} V = ${eng(I, 'A')}`, `Loss = I² R = (${sf(I)})² × ${sf(R)} = ${eng(loss, 'W')}`, `Share lost = loss ÷ P = ${sf(share * 100)}%`);
    if (share >= 1) return { error: `At ${eng(V, 'V')} the "loss" (${eng(loss, 'W')}) would be as big as the power sent (${eng(P, 'W')}): it cannot be done. Use a higher voltage.` };
    return { answer: `The line wastes ${eng(loss, 'W')} as heat, which is ${sf(share * 100)}% of the power sent (current ${eng(I, 'A')}).`, lines, tip: 'Common mistake: using the voltage drop in the formula for loss. Loss = I² R uses the current in the line and the line\'s resistance, not the supply voltage. Doubling the voltage cuts the loss to a quarter.' };
  }
  const f = i.f.typed / 100;
  if (!(f > 0 && f < 1)) return { error: 'Type the allowed loss as a percentage between 0 and 100, such as 2.' };
  if (R === 0) return { error: 'With a line resistance of 0 Ω nothing is lost at any voltage.' };
  const V = Math.sqrt((P * R) / f), I = P / V;
  lines.push('Loss share f = I² R ÷ P = P R ÷ V², so V = √(P R ÷ f)', `V = √(${sf(P)} × ${sf(R)} ÷ ${sf(f)}) = ${eng(V, 'V')}`, `Check: I = ${eng(I, 'A')}, loss = ${eng(I * I * R, 'W')} = ${sf(((I * I * R) / P) * 100)}% of P`);
  return { answer: `Send it at ${eng(V, 'V')} or more to lose at most ${sf(f * 100)}%.`, lines, tip: 'The needed voltage grows with the square root: to cut the loss to a quarter you need twice the voltage.' };
}
export const LINE_SPEC: SSpec = {
  id: 'powerline',
  finds: [['loss', 'Power lost in the line'], ['V', 'Voltage needed for a small loss']],
  fields: [
    { k: 'P', label: 'Power to send', units: U('W', ['kW', 1e3], ['MW', 1e6]), ph: 'e.g. 10' },
    { k: 'V', label: 'Line voltage', units: U('V', ['kV', 1e3]), show: (c) => find2(c) === 'loss', ph: 'e.g. 11' },
    { k: 'R', label: 'Line resistance (both wires)', units: U('Ω', ['mΩ', 1e-3]), ph: 'e.g. 5' },
    { k: 'f', label: 'Allowed loss, %', show: (c) => find2(c) === 'V', ph: 'e.g. 2' },
  ],
  presets: [
    { name: '10 MW over 5 Ω at 11 kV: how much is lost?', find: 'loss', vals: { P: ['10', 'MW'], V: ['11', 'kV'], R: '5' } },
    { name: 'Same line at 220 kV', find: 'loss', vals: { P: ['10', 'MW'], V: ['220', 'kV'], R: '5' } },
    { name: '2 MW over 8 Ω, lose at most 2%: find V', find: 'V', vals: { P: ['2', 'MW'], R: '8', f: '2' } },
  ],
  solve: (i, c) => lineSolve(i, c.find),
};
