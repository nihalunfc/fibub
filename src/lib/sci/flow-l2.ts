// School maths (Class 9, algorithms and flowcharts): a few classic flowcharts as data (boxes with positions, arrows
// with bends) and a runner that follows them one box at a time, keeping the variables and the output. No DOM.

export type Vars = Record<string, number>;
export type Kind = 'start' | 'end' | 'input' | 'output' | 'process' | 'decision';
export type Side = 't' | 'b' | 'l' | 'r';
export type Edge = { to: string; label?: string; out?: Side; in?: Side; via?: [number, number][] };
export type Box = {
  id: string; kind: Kind; text: string; x: number; y: number; w?: number;
  act?: (v: Vars, input: Vars) => void; test?: (v: Vars) => boolean; say?: (v: Vars) => string;
  next?: Edge; yes?: Edge; no?: Edge;
};
export type Chart = { id: string; name: string; inputs: { name: string; label: string; value: number; min: number; max: number }[]; height: number; boxes: Box[]; about: string };

const mod = (a: number, b: number) => ((a % b) + b) % b;

export const CHARTS: Chart[] = [
  {
    id: 'even', name: 'Even or odd', height: 320, about: 'One decision splits the path in two.',
    inputs: [{ name: 'n', label: 'n', value: 7, min: -1e6, max: 1e6 }],
    boxes: [
      { id: 's', kind: 'start', text: 'Start', x: 95, y: 24, next: { to: 'i' } },
      { id: 'i', kind: 'input', text: 'Read n', x: 95, y: 80, act: (v, i) => { v.n = i.n; }, next: { to: 'd' } },
      { id: 'd', kind: 'decision', text: '2 divides n?', x: 95, y: 152, test: (v) => mod(v.n, 2) === 0, yes: { to: 'oe', label: 'yes' }, no: { to: 'oo', label: 'no', out: 'r', via: [[255, 152]] } },
      { id: 'oe', kind: 'output', text: 'Say "even"', x: 95, y: 226, say: () => 'even', next: { to: 'e' } },
      { id: 'oo', kind: 'output', text: 'Say "odd"', x: 255, y: 226, w: 130, say: () => 'odd', next: { to: 'e', via: [[255, 294]], in: 'r' } },
      { id: 'e', kind: 'end', text: 'Stop', x: 95, y: 294 },
    ],
  },
  {
    id: 'largest', name: 'Largest of three', height: 420, about: 'Decisions inside decisions: two questions are always enough.',
    inputs: [{ name: 'a', label: 'a', value: 12, min: -1e6, max: 1e6 }, { name: 'b', label: 'b', value: 31, min: -1e6, max: 1e6 }, { name: 'c', label: 'c', value: 25, min: -1e6, max: 1e6 }],
    boxes: [
      { id: 's', kind: 'start', text: 'Start', x: 170, y: 24, next: { to: 'i' } },
      { id: 'i', kind: 'input', text: 'Read a, b, c', x: 170, y: 80, act: (v, i) => { v.a = i.a; v.b = i.b; v.c = i.c; }, next: { to: 'd1' } },
      { id: 'd1', kind: 'decision', text: 'a > b?', x: 170, y: 150, w: 140, test: (v) => v.a > v.b, yes: { to: 'd2', label: 'yes', out: 'l', via: [[85, 150]] }, no: { to: 'd3', label: 'no', out: 'r', via: [[255, 150]] } },
      { id: 'd2', kind: 'decision', text: 'a > c?', x: 85, y: 235, w: 140, test: (v) => v.a > v.c, yes: { to: 'oa', label: 'yes', via: [[85, 284], [55, 284]] }, no: { to: 'oc', label: 'no', out: 'r', via: [[170, 235]] } },
      { id: 'd3', kind: 'decision', text: 'b > c?', x: 255, y: 235, w: 140, test: (v) => v.b > v.c, yes: { to: 'ob', label: 'yes', via: [[255, 284], [285, 284]] }, no: { to: 'oc', label: 'no', out: 'l', via: [[170, 235]] } },
      { id: 'oa', kind: 'output', text: 'Say a', x: 55, y: 322, w: 90, say: (v) => String(v.a), next: { to: 'e', via: [[55, 394]], in: 'l' } },
      { id: 'oc', kind: 'output', text: 'Say c', x: 170, y: 322, w: 90, say: (v) => String(v.c), next: { to: 'e' } },
      { id: 'ob', kind: 'output', text: 'Say b', x: 285, y: 322, w: 90, say: (v) => String(v.b), next: { to: 'e', via: [[285, 394]], in: 'r' } },
      { id: 'e', kind: 'end', text: 'Stop', x: 170, y: 394, w: 110 },
    ],
  },
  {
    id: 'sum', name: 'Add 1 to n', height: 370, about: 'A loop: the arrow goes back up until the question says stop.',
    inputs: [{ name: 'n', label: 'n', value: 5, min: 0, max: 200 }],
    boxes: [
      { id: 's', kind: 'start', text: 'Start', x: 95, y: 24, next: { to: 'i' } },
      { id: 'i', kind: 'input', text: 'Read n', x: 95, y: 80, act: (v, i) => { v.n = i.n; }, next: { to: 'p' } },
      { id: 'p', kind: 'process', text: 's ← 0, i ← 1', x: 95, y: 136, act: (v) => { v.s = 0; v.i = 1; }, next: { to: 'd' } },
      { id: 'd', kind: 'decision', text: 'i ≤ n?', x: 95, y: 206, test: (v) => v.i <= v.n, yes: { to: 'p2', label: 'yes' }, no: { to: 'o', label: 'no', out: 'r', in: 'l' } },
      { id: 'p2', kind: 'process', text: 's ← s + i', x: 95, y: 280, act: (v) => { v.s += v.i; }, next: { to: 'p3' } },
      { id: 'p3', kind: 'process', text: 'i ← i + 1', x: 95, y: 336, act: (v) => { v.i += 1; }, next: { to: 'd', out: 'l', in: 'l', via: [[8, 336], [8, 206]] } },
      { id: 'o', kind: 'output', text: 'Say s', x: 255, y: 206, w: 130, say: (v) => String(v.s), next: { to: 'e' } },
      { id: 'e', kind: 'end', text: 'Stop', x: 255, y: 280, w: 130 },
    ],
  },
  {
    id: 'hcf', name: "Euclid's HCF", height: 320, about: 'The same loop idea finds the HCF of two numbers.',
    inputs: [{ name: 'a', label: 'a', value: 168, min: 1, max: 1e6 }, { name: 'b', label: 'b', value: 60, min: 1, max: 1e6 }],
    boxes: [
      { id: 's', kind: 'start', text: 'Start', x: 95, y: 24, next: { to: 'i' } },
      { id: 'i', kind: 'input', text: 'Read a, b', x: 95, y: 80, act: (v, i) => { v.a = i.a; v.b = i.b; }, next: { to: 'd' } },
      { id: 'd', kind: 'decision', text: 'b = 0?', x: 95, y: 150, test: (v) => v.b === 0, yes: { to: 'o', label: 'yes', out: 'r', in: 'l' }, no: { to: 'p1', label: 'no' } },
      { id: 'p1', kind: 'process', text: 'r ← a mod b', x: 95, y: 224, act: (v) => { v.r = mod(v.a, v.b); }, next: { to: 'p2' } },
      { id: 'p2', kind: 'process', text: 'a ← b, b ← r', x: 95, y: 284, act: (v) => { v.a = v.b; v.b = v.r; }, next: { to: 'd', out: 'l', in: 'l', via: [[8, 284], [8, 150]] } },
      { id: 'o', kind: 'output', text: 'Say a (the HCF)', x: 255, y: 150, w: 130, say: (v) => String(v.a), next: { to: 'e' } },
      { id: 'e', kind: 'end', text: 'Stop', x: 255, y: 224, w: 130 },
    ],
  },
  {
    id: 'leap', name: 'Leap year', height: 430, about: 'A chain of questions: the order matters.',
    inputs: [{ name: 'y', label: 'year', value: 1900, min: 1, max: 9999 }],
    boxes: [
      { id: 's', kind: 'start', text: 'Start', x: 95, y: 24, next: { to: 'i' } },
      { id: 'i', kind: 'input', text: 'Read year y', x: 95, y: 80, act: (v, i) => { v.y = i.y; }, next: { to: 'd1' } },
      { id: 'd1', kind: 'decision', text: '400 divides y?', x: 95, y: 150, test: (v) => mod(v.y, 400) === 0, yes: { to: 'l1', label: 'yes', out: 'r', in: 'l' }, no: { to: 'd2', label: 'no' } },
      { id: 'd2', kind: 'decision', text: '100 divides y?', x: 95, y: 235, test: (v) => mod(v.y, 100) === 0, yes: { to: 'n1', label: 'yes', out: 'r', in: 'l' }, no: { to: 'd3', label: 'no' } },
      { id: 'd3', kind: 'decision', text: '4 divides y?', x: 95, y: 320, test: (v) => mod(v.y, 4) === 0, yes: { to: 'l2', label: 'yes', out: 'r', in: 'l' }, no: { to: 'n2', label: 'no' } },
      { id: 'l1', kind: 'output', text: 'Say "leap year"', x: 255, y: 150, w: 130, say: () => 'leap year', next: { to: 'e', out: 'r', in: 'r', via: [[332, 150], [332, 402]] } },
      { id: 'n1', kind: 'output', text: 'Say "not leap"', x: 255, y: 235, w: 130, say: () => 'not a leap year', next: { to: 'e', out: 'r', in: 'r', via: [[332, 235], [332, 402]] } },
      { id: 'l2', kind: 'output', text: 'Say "leap year"', x: 255, y: 320, w: 130, say: () => 'leap year', next: { to: 'e', out: 'r', in: 'r', via: [[332, 320], [332, 402]] } },
      { id: 'n2', kind: 'output', text: 'Say "not leap"', x: 95, y: 402, say: () => 'not a leap year', next: { to: 'e', out: 'r', in: 'l' } },
      { id: 'e', kind: 'end', text: 'Stop', x: 255, y: 402, w: 130 },
    ],
  },
  {
    id: 'collatz', name: 'Steps to 1', height: 470, about: 'Halve even numbers, triple-and-add-one odd ones. Does every number reach 1? Nobody has proved it.',
    inputs: [{ name: 'n', label: 'n', value: 6, min: 1, max: 100000 }],
    boxes: [
      { id: 's', kind: 'start', text: 'Start', x: 95, y: 24, next: { to: 'i' } },
      { id: 'i', kind: 'input', text: 'Read n', x: 95, y: 80, act: (v, i) => { v.n = i.n; }, next: { to: 'p' } },
      { id: 'p', kind: 'process', text: 'steps ← 0', x: 95, y: 136, act: (v) => { v.steps = 0; }, next: { to: 'd1' } },
      { id: 'd1', kind: 'decision', text: 'n = 1?', x: 95, y: 206, test: (v) => v.n === 1, yes: { to: 'o', label: 'yes', out: 'r', in: 'l' }, no: { to: 'd2', label: 'no' } },
      { id: 'd2', kind: 'decision', text: '2 divides n?', x: 95, y: 290, test: (v) => mod(v.n, 2) === 0, yes: { to: 'pa', label: 'yes' }, no: { to: 'pb', label: 'no', out: 'r', via: [[255, 290]] } },
      { id: 'pa', kind: 'process', text: 'n ← n ÷ 2', x: 95, y: 370, act: (v) => { v.n /= 2; }, next: { to: 'pc' } },
      { id: 'pb', kind: 'process', text: 'n ← 3n + 1', x: 255, y: 370, w: 130, act: (v) => { v.n = 3 * v.n + 1; }, next: { to: 'pc', via: [[255, 440]], in: 'r' } },
      { id: 'pc', kind: 'process', text: 'steps ← steps + 1', x: 95, y: 440, act: (v) => { v.steps += 1; }, next: { to: 'd1', out: 'l', in: 'l', via: [[8, 440], [8, 206]] } },
      { id: 'o', kind: 'output', text: 'Say steps', x: 255, y: 206, w: 130, say: (v) => String(v.steps), next: { to: 'e' } },
      { id: 'e', kind: 'end', text: 'Stop', x: 255, y: 280, w: 130 },
    ],
  },
];

export type Step = { box: string; vars: Vars; out: string[]; note: string; branch?: 'yes' | 'no' };

/** Follow the chart from Start to Stop (or `limit` boxes), recording every box visited. */
export function run(chart: Chart, input: Vars, limit = 3000): { steps: Step[]; finished: boolean } {
  const byId = new Map(chart.boxes.map((b) => [b.id, b]));
  const v: Vars = {}, out: string[] = [], steps: Step[] = [];
  let b = byId.get('s')!;
  for (let k = 0; k < limit; k++) {
    let note = '', branch: Step['branch'];
    let edge: Edge | undefined = b.next;
    if (b.act) { b.act(v, input); note = b.kind === 'input' ? `Read ${chart.inputs.map((x) => `${x.name} = ${input[x.name]}`).join(', ')}.` : `Now ${b.text.replace(/ ← /g, ' = ').split(', ').map((p) => p.split(' = ')[0]).map((n) => `${n} = ${v[n]}`).join(', ')}.`; }
    if (b.test) { const yes = b.test(v); branch = yes ? 'yes' : 'no'; edge = yes ? b.yes : b.no; note = `${b.text.replace('?', '')}: ${branch}.`; }
    if (b.say) { const s = b.say(v); out.push(s); note = `Output: ${s}.`; }
    if (b.kind === 'start') note = 'Start here.';
    if (b.kind === 'end') { steps.push({ box: b.id, vars: { ...v }, out: [...out], note: 'Stop.' }); return { steps, finished: true }; }
    steps.push({ box: b.id, vars: { ...v }, out: [...out], note, branch });
    b = byId.get(edge!.to)!;
  }
  return { steps, finished: false };
}
