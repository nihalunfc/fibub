// Small neural networks for the ML foundations course (Module 9): the perceptron, activation functions, a
// fully connected network trained by backpropagation, and 2D convolution. Plain TypeScript, checked in tests/ml.mjs.
import type { Rng } from './core.ts';

export const ACT = {
  step: { f: (z: number) => (z >= 0 ? 1 : 0), d: (_z: number) => 0 },
  sigmoid: { f: (z: number) => 1 / (1 + Math.exp(-z)), d: (z: number) => { const s = 1 / (1 + Math.exp(-z)); return s * (1 - s); } },
  tanh: { f: Math.tanh, d: (z: number) => 1 - Math.tanh(z) ** 2 },
  relu: { f: (z: number) => Math.max(0, z), d: (z: number) => (z > 0 ? 1 : 0) },
} as const;
export type ActName = keyof typeof ACT;

/** One pass of the perceptron rule over the data (labels 0/1): w += rate·(y − ŷ)·x for each mistake. Returns mistakes. */
export function perceptronEpoch(X: number[][], y: number[], w: number[], b: { v: number }, rate = 1) {
  let wrong = 0;
  X.forEach((x, i) => {
    const yh = x.reduce((s, v, j) => s + v * w[j], b.v) >= 0 ? 1 : 0, e = y[i] - yh;
    if (e) { wrong++; x.forEach((v, j) => (w[j] += rate * e * v)); b.v += rate * e; }
  });
  return wrong;
}

export type Net = { sizes: number[]; W: number[][][]; B: number[][]; act: ActName };

/** A network with layer sizes like [2, 8, 8, 1], small random weights (scaled by fan-in), hidden activation `act`. */
export function makeNet(sizes: number[], act: ActName, R: Rng): Net {
  const W: number[][][] = [], B: number[][] = [];
  for (let l = 1; l < sizes.length; l++) {
    const s = Math.sqrt((act === 'relu' ? 2 : 1) / sizes[l - 1]);
    W.push(Array.from({ length: sizes[l] }, () => Array.from({ length: sizes[l - 1] }, () => R.normal(0, s))));
    B.push(new Array(sizes[l]).fill(0));
  }
  return { sizes, W, B, act };
}

/** Forward pass: pre-activations z and activations a for every layer; the output layer uses a sigmoid. */
export function forward(net: Net, x: number[]) {
  const zs: number[][] = [], as: number[][] = [x];
  let a = x;
  net.W.forEach((Wl, l) => {
    const last = l === net.W.length - 1, z = Wl.map((row, i) => row.reduce((s, w, j) => s + w * a[j], net.B[l][i]));
    a = z.map((v) => (last ? ACT.sigmoid.f(v) : ACT[net.act].f(v)));
    zs.push(z); as.push(a);
  });
  return { zs, as, p: a[0] };
}

/**
 * Backpropagation for one example with log-loss: returns gradients for every weight and bias. With a sigmoid
 * output and log-loss, the output error is simply p − y; each earlier layer's error is the next layer's error,
 * sent back through the weights, times the slope of the activation (the chain rule).
 */
export function backward(net: Net, x: number[], y: number) {
  const { zs, as, p } = forward(net, x), L = net.W.length;
  const gW = net.W.map((Wl) => Wl.map((r) => r.map(() => 0))), gB = net.B.map((b) => b.map(() => 0));
  let delta = [p - y];
  for (let l = L - 1; l >= 0; l--) {
    delta.forEach((dv, i) => { gB[l][i] = dv; as[l].forEach((av, j) => (gW[l][i][j] = dv * av)); });
    if (l > 0) delta = as[l].map((_, j) => net.W[l].reduce((s, row, i) => s + row[j] * delta[i], 0) * ACT[net.act].d(zs[l - 1][j]));
  }
  return { gW, gB, loss: -(y * Math.log(Math.max(p, 1e-12)) + (1 - y) * Math.log(Math.max(1 - p, 1e-12))) };
}

/** One gradient step on a batch of rows; returns the batch's mean log-loss. */
export function trainStep(net: Net, X: number[][], y: number[], rate: number, rows?: number[]) {
  const idx = rows ?? X.map((_, i) => i);
  const sW = net.W.map((Wl) => Wl.map((r) => r.map(() => 0))), sB = net.B.map((b) => b.map(() => 0));
  let loss = 0;
  for (const i of idx) {
    const g = backward(net, X[i], y[i]); loss += g.loss;
    g.gW.forEach((Wl, l) => Wl.forEach((r, a) => r.forEach((v, b) => (sW[l][a][b] += v))));
    g.gB.forEach((bl, l) => bl.forEach((v, a) => (sB[l][a] += v)));
  }
  const k = rate / idx.length;
  net.W.forEach((Wl, l) => Wl.forEach((r, a) => r.forEach((_, b) => (r[b] -= k * sW[l][a][b]))));
  net.B.forEach((bl, l) => bl.forEach((_, a) => (bl[a] -= k * sB[l][a])));
  return loss / idx.length;
}

/** Valid 2D convolution (strictly, cross-correlation, as in deep learning libraries) of an image with a kernel. */
export function conv2d(img: number[][], ker: number[][]) {
  const kh = ker.length, kw = ker[0].length, H = img.length - kh + 1, W = img[0].length - kw + 1;
  return Array.from({ length: H }, (_, r) => Array.from({ length: W }, (_, c) => {
    let s = 0; for (let i = 0; i < kh; i++) for (let j = 0; j < kw; j++) s += img[r + i][c + j] * ker[i][j]; return s;
  }));
}

/** A one-unit recurrent cell over a sequence: h_t = tanh(w·x_t + u·h_{t−1} + b). Returns every hidden state. */
export function rnn(xs: number[], w: number, u: number, b = 0) {
  const hs: number[] = []; let h = 0;
  for (const x of xs) { h = Math.tanh(w * x + u * h + b); hs.push(h); }
  return hs;
}
