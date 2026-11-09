// School maths: probability with equally likely outcomes (Class 10 probability; Class 9 and 11 experimental and
// classical probability). Sample spaces for two dice, coins and a deck of cards, events on them, the theoretical
// probability as a fraction, and a simulation. No DOM.
import { gcd } from './smath.ts';

export type Outcome = { label: string; v: number[] };   // v: dice faces, coin heads (1/0), or [rank 1..13, suit 0..3]
export const SUITS = ['♠', '♥', '♦', '♣'];               // spades, hearts, diamonds, clubs; hearts and diamonds are red
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function space(kind: 'dice' | 'coins' | 'cards', coins = 2): Outcome[] {
  if (kind === 'dice') { const o: Outcome[] = []; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) o.push({ label: `(${i}, ${j})`, v: [i, j] }); return o; }
  if (kind === 'coins') return Array.from({ length: 2 ** coins }, (_, m) => { const v = Array.from({ length: coins }, (_, k) => ((m >> (coins - 1 - k)) & 1) ^ 1); return { label: v.map((h) => (h ? 'H' : 'T')).join(''), v }; });
  const o: Outcome[] = []; for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) o.push({ label: `${RANKS[r - 1]}${SUITS[s]}`, v: [r, s] }); return o;
}

export type EventDef = { id: string; text: (k: number) => string; test: (v: number[], k: number) => boolean; k?: [number, number, number] };   // k: [min, max, default]
export const EVENTS: Record<string, EventDef[]> = {
  dice: [
    { id: 'sum', text: (k) => `the sum is ${k}`, test: (v, k) => v[0] + v[1] === k, k: [2, 12, 7] },
    { id: 'sumge', text: (k) => `the sum is at least ${k}`, test: (v, k) => v[0] + v[1] >= k, k: [2, 12, 10] },
    { id: 'double', text: () => 'both dice show the same number', test: (v) => v[0] === v[1] },
    { id: 'six', text: () => 'at least one die shows 6', test: (v) => v[0] === 6 || v[1] === 6 },
    { id: 'prodeven', text: () => 'the product is even', test: (v) => (v[0] * v[1]) % 2 === 0 },
    { id: 'prime', text: () => 'the sum is a prime number', test: (v) => [2, 3, 5, 7, 11].includes(v[0] + v[1]) },
  ],
  coins: [
    { id: 'heads', text: (k) => `exactly ${k} head${k === 1 ? '' : 's'}`, test: (v, k) => v.reduce((s, h) => s + h, 0) === k, k: [0, 3, 1] },
    { id: 'atleast', text: () => 'at least one head', test: (v) => v.some((h) => h === 1) },
    { id: 'same', text: () => 'all coins show the same face', test: (v) => v.every((h) => h === v[0]) },
  ],
  cards: [
    { id: 'red', text: () => 'a red card (hearts or diamonds)', test: (v) => v[1] === 1 || v[1] === 2 },
    { id: 'face', text: () => 'a face card (J, Q or K)', test: (v) => v[0] >= 11 },
    { id: 'ace', text: () => 'an ace', test: (v) => v[0] === 1 },
    { id: 'spade', text: () => 'a spade', test: (v) => v[1] === 0 },
    { id: 'redface', text: () => 'a red face card', test: (v) => (v[1] === 1 || v[1] === 2) && v[0] >= 11 },
    { id: 'notheart', text: () => 'not a heart', test: (v) => v[1] !== 1 },
  ],
};

export function probability(outs: Outcome[], test: (v: number[]) => boolean) {
  const fav = outs.filter((o) => test(o.v)).length, n = outs.length, g = gcd(fav, n) || 1;
  return { fav, n, p: fav / n, text: fav === 0 ? '0' : fav === n ? '1' : `${fav / g}/${n / g}` };
}

/** A small seeded random number generator (mulberry32) so a simulation can be repeated. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Run `trials` random draws from the sample space; returns the running relative frequency at each checkpoint. */
export function simulate(outs: Outcome[], test: (v: number[]) => boolean, trials: number, rand: () => number) {
  let hits = 0; const path: [number, number][] = []; const every = Math.max(1, Math.floor(trials / 200));
  for (let i = 1; i <= trials; i++) { if (test(outs[Math.floor(rand() * outs.length)].v)) hits++; if (i % every === 0 || i === trials) path.push([i, hits / i]); }
  return { hits, freq: hits / trials, path };
}
