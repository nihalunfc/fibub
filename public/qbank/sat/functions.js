// SAT Math · Advanced math · function notation, composition and transformations. Original (fibub).
import { int, nz, choose, shuffleOpts, fmt, lin, quad, v, steps } from './_util.js';
const F = { section: 'math', domain: 'advanced' };
const X = v('x'), f = v('f'), g = v('g');

export default {
  topic: 'functions',
  gens: [
    { id: 'sat-fn-g01', type: 'nat', level: 1, exams: ['sat'], sub: 'evaluate', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, -3, 4), b = int(r, -6, 6), c = int(r, -10, 10), t = int(r, -4, 5);
        return { q: `<p>The function ${f} is defined by ${f}(${X}) = ${quad(a, b, c)}. What is the value of ${f}(${fmt(t)})?</p>`, answer: a * t * t + b * t + c, tol: 0, a, b, c, t,
          sol: steps(`Replace every ${X} with (${fmt(t)}): ${fmt(a)}(${fmt(t)})<sup>2</sup> + ${fmt(b)}(${fmt(t)}) + ${fmt(c)}.`, `= ${fmt(a * t * t)} + ${fmt(b * t)} + ${fmt(c)} = <b>${fmt(a * t * t + b * t + c)}</b>.`),
          trap: 'Squaring a negative input without brackets: (−3)² is 9, not −9.' };
      },
      verify: (p) => p.a * p.t * p.t + p.b * p.t + p.c },
    { id: 'sat-fn-g02', type: 'nat', level: 2, exams: ['sat'], sub: 'composition', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, -4, 4), b = int(r, -8, 8), c = nz(r, -3, 3), d = int(r, -5, 5), t = int(r, -3, 4);
        const gt = c * t + d, ans = a * gt + b;
        return { q: `<p>${f}(${X}) = ${lin(a, b)}<br>${g}(${X}) = ${lin(c, d)}</p><p>What is the value of ${f}(${g}(${fmt(t)}))?</p>`, answer: ans, tol: 0, a, b, c, d, t,
          sol: steps(`Work from the inside out. ${g}(${fmt(t)}) = ${fmt(c)}(${fmt(t)}) + ${fmt(d)} = ${fmt(gt)}.`, `${f}(${fmt(gt)}) = ${fmt(a)}(${fmt(gt)}) + ${fmt(b)} = <b>${fmt(ans)}</b>.`),
          trap: `Working out f first and then g: f(g(x)) means do g first.` };
      },
      verify: (p) => p.a * (p.c * p.t + p.d) + p.b },
    { id: 'sat-fn-g03', type: 'nat', level: 3, exams: ['sat'], sub: 'transformations', facets: F, format: 'numeric',
      make(r) {
        const h = int(r, -5, 5), k = int(r, -8, 8), dh = nz(r, -4, 4), dk = nz(r, -6, 6), ask = choose(r, ['x', 'y']);
        return { q: `<p>The graph of ${v('y')} = ${f}(${X}) is a parabola with vertex (${fmt(h)}, ${fmt(k)}). The function ${g} is defined by ${g}(${X}) = ${f}(${X} ${dh > 0 ? '−' : '+'} ${Math.abs(dh)}) ${dk > 0 ? '+' : '−'} ${Math.abs(dk)}. What is the ${ask}-coordinate of the vertex of the graph of ${v('y')} = ${g}(${X})?</p>`, answer: ask === 'x' ? h + dh : k + dk, tol: 0, h, k, dh, dk, ask,
          sol: steps(`${f}(${X} − ${v('c')}) moves a graph ${v('c')} units to the <b>right</b> (the opposite of what the sign suggests); adding outside moves it up.`, `Here: ${dh > 0 ? 'right' : 'left'} ${Math.abs(dh)} and ${dk > 0 ? 'up' : 'down'} ${Math.abs(dk)}. The vertex moves from (${fmt(h)}, ${fmt(k)}) to (${fmt(h + dh)}, ${fmt(k + dk)}).`, `So the ${ask}-coordinate is <b>${fmt(ask === 'x' ? h + dh : k + dk)}</b>.`),
          trap: 'Moving the graph left for f(x − c). Inside the brackets the shift goes the opposite way.' };
      },
      verify: (p) => (p.ask === 'x' ? p.h + p.dh : p.k + p.dk) },
    { id: 'sat-fn-g04', type: 'nat', level: 2, exams: ['sat'], sub: 'find a constant', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, -6, 6), b = int(r, -9, 9), t = nz(r, -4, 5);
        return { q: `<p>The function ${f} is defined by ${f}(${X}) = ${v('a')}${X} ${b < 0 ? '−' : '+'} ${Math.abs(b)}, where ${v('a')} is a constant. If ${f}(${fmt(t)}) = ${fmt(a * t + b)}, what is the value of ${v('a')}?</p>`, answer: a, tol: 0, t, b, val: a * t + b,
          sol: steps(`${f}(${fmt(t)}) = ${v('a')}(${fmt(t)}) + ${fmt(b)} = ${fmt(a * t + b)}.`, `${fmt(t)}${v('a')} = ${fmt(a * t)}, so ${v('a')} = <b>${fmt(a)}</b>.`) };
      },
      verify: (p) => (p.val - p.b) / p.t },
    { id: 'sat-fn-g05', type: 'nat', level: 3, exams: ['sat'], sub: 'input from output', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, -5, 5), b = int(r, -10, 10), t = int(r, -6, 8), out = a * t + b;
        return { q: `<p>For the function ${f}(${X}) = ${lin(a, b)}, what value of ${X} gives ${f}(${X}) = ${fmt(out)}?</p>`, answer: t, tol: 0, a, b, out,
          sol: steps(`Set the rule equal to the output: ${lin(a, b)} = ${fmt(out)}.`, `${lin(a, 0)} = ${fmt(out - b)}, so ${X} = <b>${fmt(t)}</b>.`), trap: `Working out f(${fmt(out)}) instead: the question gives the output and asks for the input.` };
      },
      verify: (p) => (p.out - p.b) / p.a },
  ],
  items: [
    { id: 'sat-fn-001', type: 'mcq', level: 2, exams: ['sat'], sub: 'graph reading', facets: F,
      q: '<p>The graph of <i>y</i> = <i>f</i>(<i>x</i>) crosses the <i>x</i>-axis at <i>x</i> = −2, 1 and 4. How many solutions does <i>f</i>(<i>x</i> − 3) = 0 have, and what is the largest?</p>',
      options: ['3 solutions; the largest is 7', '3 solutions; the largest is 1', '3 solutions; the largest is 4', '1 solution; it is 7'], answer: 0,
      sol: '<p><i>f</i>(<i>x</i> − 3) is the same graph moved 3 units right, so the zeros move to 1, 4 and 7. Still three zeros; the largest is 7.</p>' },
    { id: 'sat-fn-002', type: 'mcq', level: 2, exams: ['sat'], sub: 'notation', facets: F,
      q: '<p>For a function <i>p</i>, <i>p</i>(3) = 10. Which statement must be true?</p>',
      options: ['The point (3, 10) is on the graph of <i>y</i> = <i>p</i>(<i>x</i>).', 'The point (10, 3) is on the graph of <i>y</i> = <i>p</i>(<i>x</i>).', '<i>p</i> multiplied by 3 equals 10.', '<i>p</i>(10) = 3'], answer: 0,
      sol: '<p><i>p</i>(3) = 10 means "input 3, output 10". On a graph the input is <i>x</i> and the output is <i>y</i>, so (3, 10) is on it. It says nothing about <i>p</i>(10).</p>' },
  ],
};
