// Voting systems: single-winner counts from ranked ballots (plurality, two-round, instant runoff, Borda,
// Condorcet with Schulze, approval), multi-seat STV (Droop quota, weighted inclusive Gregory transfers) and
// party-list seats (D'Hondt, Sainte-Laguë, largest remainder with Hare or Droop quota) with a threshold.
//
// Ties are broken the same way everywhere: by the totals in the round before (then the one before that,
// back to the first round), and if still tied by the order candidates are listed in (earlier listed counts
// as ahead). Every tie that had to be broken is reported.

export type Ballot = { count: number; ranking: string[]; approve?: number };
export type Ballots = { candidates: string[]; ballots: Ballot[]; total: number };

const EPS = 1e-9;

/**
 * Ballots as text, one line per group: "12: A > B > C" (12 voters ranked A, then B, then C). The count is
 * optional (1), and ">" or "," separate names. A "|" marks where the voter's approval ends (for approval
 * voting). A line "candidates: A, B, C" sets the order of candidates (and adds ones nobody ranked).
 */
export function parseBallots(text: string): Ballots {
  const candidates: string[] = [];
  const add = (c: string) => { if (!candidates.includes(c)) candidates.push(c); };
  const ballots: Ballot[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  lines.forEach((raw, li) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const cm = line.match(/^candidates?\s*:\s*(.*)$/i);
    if (cm) { cm[1].split(/[>,;\t]/).map((s) => s.trim()).filter(Boolean).forEach(add); return; }
    let count = 1, rest = line;
    const m = line.match(/^(\d+(?:\.\d+)?)\s*(?:[:×x*]\s*|\s+)(.*)$/);
    if (m) { count = Number(m[1]); rest = m[2]; }
    const parts = rest.split('|');
    if (parts.length > 2) throw new Error(`Line ${li + 1}: use "|" at most once (it marks where approval ends).`);
    const sep = /[>,;\t]/.test(rest) ? /[>,;\t]/ : /\s+/;
    const names = (s: string) => s.split(sep).map((x) => x.trim()).filter(Boolean);
    const ranking = names(parts[0]);
    const approve = parts.length === 2 ? ranking.length : undefined;
    if (parts.length === 2) ranking.push(...names(parts[1]));
    if (!ranking.length) throw new Error(`Line ${li + 1} has no candidate names.`);
    if (!(count > 0) || !Number.isFinite(count)) throw new Error(`Line ${li + 1}: the number of voters must be more than 0.`);
    const seen = new Set<string>();
    for (const c of ranking) { if (seen.has(c)) throw new Error(`Line ${li + 1} ranks ${c} twice.`); seen.add(c); }
    ranking.forEach(add);
    ballots.push({ count, ranking, approve });
  });
  if (!ballots.length) throw new Error('Type or paste some ballots first.');
  if (candidates.length < 2) throw new Error('There must be at least two candidates.');
  return { candidates, ballots, total: ballots.reduce((s, b) => s + b.count, 0) };
}

type Tie = { round: string; between: string[]; loser?: string; winner?: string };

/** Pick the lowest (or highest) of `among` by `score`, breaking ties by earlier rounds' totals, then list order. */
function pick(among: string[], score: (c: string) => number, history: Record<string, number>[], order: string[], lowest: boolean, ties: Tie[], label: string) {
  const sgn = lowest ? 1 : -1;
  const best = Math.min(...among.map((c) => sgn * score(c)));
  let tied = among.filter((c) => Math.abs(sgn * score(c) - best) < EPS);
  if (tied.length === 1) return tied[0];
  const all = [...tied];
  for (let h = history.length - 1; h >= 0 && tied.length > 1; h--) {
    const b = Math.min(...tied.map((c) => sgn * (history[h][c] ?? 0)));
    tied = tied.filter((c) => Math.abs(sgn * (history[h][c] ?? 0) - b) < EPS);
  }
  // Still tied: the one listed later is "lower".
  tied.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const out = lowest ? tied[tied.length - 1] : tied[0];
  ties.push(lowest ? { round: label, between: all, loser: out } : { round: label, between: all, winner: out });
  return out;
}

const top = (b: Ballot, active: Set<string>) => b.ranking.find((c) => active.has(c));

export type Round = { label: string; votes: Record<string, number>; exhausted: number; out?: string; elected?: string[]; note?: string };

/** First-preference counts. */
export function plurality(B: Ballots) {
  const votes: Record<string, number> = Object.fromEntries(B.candidates.map((c) => [c, 0]));
  for (const b of B.ballots) votes[b.ranking[0]] += b.count;
  const ties: Tie[] = [];
  const winner = pick(B.candidates, (c) => votes[c], [], B.candidates, false, ties, 'Plurality');
  return { votes, winner, ties };
}

/** Two-round system: a majority in round 1 wins outright; otherwise the top two meet in a run-off, using each ballot's preference between them. */
export function twoRound(B: Ballots) {
  const p = plurality(B), ties: Tie[] = [...p.ties];
  const rounds: Round[] = [{ label: 'Round 1', votes: p.votes, exhausted: 0 }];
  const max = Math.max(...Object.values(p.votes));
  if (max > B.total / 2) return { winner: p.winner, rounds, ties, outright: true };
  const first = pick(B.candidates, (c) => p.votes[c], [], B.candidates, false, ties, 'Round 1 (first place)');
  const second = pick(B.candidates.filter((c) => c !== first), (c) => p.votes[c], [], B.candidates, false, ties, 'Round 1 (second place)');
  const act = new Set([first, second]);
  const v2: Record<string, number> = { [first]: 0, [second]: 0 };
  let exhausted = 0;
  for (const b of B.ballots) { const t = top(b, act); if (t) v2[t] += b.count; else exhausted += b.count; }
  rounds.push({ label: 'Run-off', votes: v2, exhausted });
  const winner = pick([first, second], (c) => v2[c], [p.votes], B.candidates, false, ties, 'Run-off');
  return { winner, rounds, ties, outright: false };
}

/** Instant-runoff (alternative vote): drop the last-placed candidate until one has more than half the continuing votes. */
export function irv(B: Ballots) {
  const active = new Set(B.candidates), rounds: Round[] = [], ties: Tie[] = [], hist: Record<string, number>[] = [];
  for (let r = 1; ; r++) {
    const votes: Record<string, number> = {};
    for (const c of B.candidates) if (active.has(c)) votes[c] = 0;
    let exhausted = 0;
    for (const b of B.ballots) { const t = top(b, active); if (t) votes[t] += b.count; else exhausted += b.count; }
    const cont = B.total - exhausted, list = [...active];
    const lead = pick(list, (c) => votes[c], hist, B.candidates, false, [], '');
    const round: Round = { label: `Round ${r}`, votes, exhausted };
    rounds.push(round);
    if (votes[lead] > cont / 2 + EPS || list.length === 1) { round.elected = [lead]; return { winner: lead, rounds, ties }; }
    const out = pick(list, (c) => votes[c], hist, B.candidates, true, ties, round.label);
    round.out = out; active.delete(out); hist.push(votes);
  }
}

/** Borda count: with n candidates, 1st place scores n−1, 2nd n−2 and so on; candidates a ballot leaves unranked score 0. */
export function borda(B: Ballots) {
  const n = B.candidates.length;
  const points: Record<string, number> = Object.fromEntries(B.candidates.map((c) => [c, 0]));
  for (const b of B.ballots) b.ranking.forEach((c, i) => (points[c] += b.count * (n - 1 - i)));
  const ties: Tie[] = [];
  const winner = pick(B.candidates, (c) => points[c], [], B.candidates, false, ties, 'Borda');
  return { points, winner, ties };
}

/**
 * Pairwise matrix d[i][j]: voters ranking i above j (a ranked candidate is above every unranked one; two
 * unranked candidates are not compared). Condorcet winner (beats everyone), and Schulze (beatpath) with
 * winning-votes strengths.
 */
export function condorcet(B: Ballots) {
  const C = B.candidates, n = C.length, idx = new Map(C.map((c, i) => [c, i]));
  const d = C.map(() => C.map(() => 0));
  for (const b of B.ballots) {
    const pos = new Array(n).fill(Infinity);
    b.ranking.forEach((c, k) => (pos[idx.get(c)!] = k));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && pos[i] < pos[j]) d[i][j] += b.count;
  }
  const beats = (i: number, j: number) => d[i][j] > d[j][i] + EPS;
  const cw = C.findIndex((_, i) => C.every((_, j) => j === i || beats(i, j)));
  // Weak Condorcet winner(s): never lose a pairwise contest.
  const p = C.map((_, i) => C.map((_, j) => (i !== j && beats(i, j) ? d[i][j] : 0)));
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) if (i !== k) for (let j = 0; j < n; j++) if (j !== i && j !== k) p[i][j] = Math.max(p[i][j], Math.min(p[i][k], p[k][j]));
  const wins = C.map((_, i) => C.filter((_, j) => j !== i && p[i][j] > p[j][i] + EPS).length);
  const schulzeWinners = C.filter((_, i) => C.every((_, j) => j === i || p[i][j] >= p[j][i] - EPS));
  // Schulze order: by the number of candidates each one beats on strongest paths.
  const order = [...C].sort((a, b) => wins[idx.get(b)!] - wins[idx.get(a)!] || C.indexOf(a) - C.indexOf(b));
  const copeland = C.map((_, i) => C.reduce((s, _, j) => s + (j === i ? 0 : beats(i, j) ? 1 : beats(j, i) ? 0 : 0.5), 0));
  return { d, p, condorcetWinner: cw >= 0 ? C[cw] : null, schulzeWinners, schulzeOrder: order, schulzeWins: wins, copeland };
}

/** Approval: each ballot approves the names before its "|", or else its first k names. */
export function approval(B: Ballots, k: number) {
  const votes: Record<string, number> = Object.fromEntries(B.candidates.map((c) => [c, 0]));
  for (const b of B.ballots) b.ranking.slice(0, b.approve ?? k).forEach((c) => (votes[c] += b.count));
  const ties: Tie[] = [];
  const winner = pick(B.candidates, (c) => votes[c], [], B.candidates, false, ties, 'Approval');
  return { votes, winner, ties, marked: B.ballots.some((b) => b.approve != null) };
}

export type StvStage = { label: string; action: string; votes: Record<string, number>; exhausted: number; elected: string[]; excluded: string[]; transferValue?: number; note?: string };

/**
 * Single transferable vote for `seats` seats. Droop quota floor(V / (seats + 1)) + 1, with V the number of
 * valid ballots. Weighted inclusive Gregory method: when an elected candidate has a surplus, every ballot
 * they hold moves on to its next continuing choice at its current value × surplus ÷ the candidate's total
 * (ballots with no further choice are exhausted and that share is lost). One surplus (the largest) is
 * transferred per stage; when no one has a surplus to transfer, the last-placed candidate is excluded and
 * all their ballots move on at their current value. Values are kept at full precision (no rounding). When the
 * continuing candidates just fill the remaining seats, they are all elected.
 */
export function stv(B: Ballots, seats: number) {
  const C = B.candidates;
  if (!(seats >= 1) || !Number.isInteger(seats)) throw new Error('Seats must be a whole number of 1 or more.');
  if (seats >= C.length) throw new Error(`With ${C.length} candidates there must be fewer than ${C.length} seats.`);
  const quota = Math.floor(B.total / (seats + 1)) + 1;
  // Each paper: its ranking, weight (count × value) and the candidate holding it.
  const papers = B.ballots.map((b) => ({ ranking: b.ranking, w: b.count, at: '' as string }));
  const continuing = new Set(C), elected: string[] = [], excluded: string[] = [], pending: string[] = [];
  const ties: Tie[] = [], hist: Record<string, number>[] = [], stages: StvStage[] = [];
  let exhausted = 0;
  // An elected candidate whose surplus has moved on keeps exactly the quota.
  const kept: Record<string, number> = {};
  const totals = () => { const v: Record<string, number> = Object.fromEntries(C.map((c) => [c, kept[c] ?? 0])); for (const p of papers) if (p.at) v[p.at] += p.w; return v; };
  const moveOn = (p: (typeof papers)[number]) => { const nxt = p.ranking.find((c) => continuing.has(c)); if (nxt) p.at = nxt; else { exhausted += p.w; p.w = 0; p.at = ''; } };
  papers.forEach(moveOn);
  const snap = (label: string, action: string, tv?: number) => { const v = totals(); stages.push({ label, action, votes: v, exhausted, elected: [...elected], excluded: [...excluded], transferValue: tv }); hist.push(v); return v; };
  let v = snap('Stage 1', 'First preferences');
  for (let s = 2; elected.length < seats; s++) {
    // Elect everyone at or over the quota, highest first.
    const reach = [...continuing].filter((c) => v[c] >= quota - EPS).sort((a, b) => v[b] - v[a] || C.indexOf(a) - C.indexOf(b));
    for (const c of reach) { continuing.delete(c); elected.push(c); if (v[c] > quota + EPS) pending.push(c); }
    if (reach.length) stages[stages.length - 1].elected = [...elected];
    if (elected.length >= seats) break;
    if (continuing.size <= seats - elected.length) {
      const rest = [...continuing].sort((a, b) => v[b] - v[a] || C.indexOf(a) - C.indexOf(b));
      for (const c of rest) { continuing.delete(c); elected.push(c); }
      stages[stages.length - 1].elected = [...elected];
      stages[stages.length - 1].note = `${rest.join(', ')} elected without reaching the quota: only ${rest.length} continuing candidate${rest.length > 1 ? 's' : ''} left for ${rest.length} seat${rest.length > 1 ? 's' : ''}.`;
      break;
    }
    if (pending.length) {
      // Transfer the largest surplus waiting.
      pending.sort((a, b) => v[b] - v[a] || C.indexOf(a) - C.indexOf(b));
      const c = pending.shift()!, total = v[c], surplus = total - quota, tv = surplus / total;
      for (const p of papers) if (p.at === c) { p.w *= tv; moveOn(p); }
      kept[c] = quota;
      v = snap(`Stage ${s}`, `Surplus of ${c} (${round(surplus)}) transferred at ${round(tv, 5)} of each ballot's value`, tv);
      continue;
    }
    const out = pick([...continuing], (c) => v[c], hist.slice(0, -1), C, true, ties, `Stage ${s}`);
    continuing.delete(out); excluded.push(out);
    for (const p of papers) if (p.at === out) moveOn(p);
    v = snap(`Stage ${s}`, `${out} excluded; ballots move on at their current value`);
  }
  return { quota, elected, stages, ties, total: B.total };
}
export const STV_RULE = 'Droop quota = floor(valid ballots ÷ (seats + 1)) + 1. Weighted inclusive Gregory transfers: all ballots of a candidate with a surplus move on at (current value × surplus ÷ candidate total); exhausted ballots lose their share. One surplus per stage, largest first; otherwise the lowest candidate is excluded and their ballots move on at current value. No rounding of values. Ties are broken by the previous stage\'s totals (back to the first), then by listed order.';

const round = (x: number, d = 2) => String(+x.toFixed(d));

// ---------- Party lists ----------
export type Party = { name: string; votes: number };
export type ListMethod = 'dhondt' | 'sainte-lague' | 'modified-sainte-lague' | 'hare' | 'droop';

export function parseParties(text: string): Party[] {
  const out: Party[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const m = line.match(/^(.*?)[\s,;:\t]+([\d][\d,  ]*(?:\.\d+)?)$/);
    if (!m) { if (i === 0 && /votes?/i.test(line)) return; throw new Error(`Line ${i + 1}: write a party name, then its votes, such as "Green 12000".`); }
    const v = Number(m[2].replace(/[,  ]/g, ''));
    const name = m[1].trim();
    if (!name) throw new Error(`Line ${i + 1} has no party name.`);
    if (out.some((p) => p.name === name)) throw new Error(`${name} is listed twice.`);
    out.push({ name, votes: v });
  });
  if (out.length < 2) throw new Error('List at least two parties, one per line, each with its votes.');
  return out;
}

/** Seats for party lists. threshold: percent of all valid votes a party needs to take part. */
export function listSeats(parties: Party[], seats: number, method: ListMethod, threshold = 0) {
  if (!(seats >= 1) || !Number.isInteger(seats)) throw new Error('Seats must be a whole number of 1 or more.');
  const V = parties.reduce((s, p) => s + p.votes, 0);
  const inP = parties.filter((p) => p.votes > 0 && (p.votes / V) * 100 >= threshold - EPS);
  if (!inP.length) throw new Error('No party passes the threshold.');
  const names = parties.map((p) => p.name);
  const seatsOf: Record<string, number> = Object.fromEntries(parties.map((p) => [p.name, 0]));
  const ties: Tie[] = [];
  const steps: { seat: number; party: string; value: number }[] = [];
  const Vin = inP.reduce((s, p) => s + p.votes, 0);
  let quota: number | undefined;
  const rem: Record<string, number> = {};
  if (method === 'hare' || method === 'droop') {
    quota = method === 'hare' ? Vin / seats : Math.floor(Vin / (seats + 1)) + 1;
    for (const p of inP) { seatsOf[p.name] = Math.floor(p.votes / quota + EPS); rem[p.name] = p.votes - seatsOf[p.name] * quota; }
    let left = seats - inP.reduce((s, p) => s + seatsOf[p.name], 0);
    const pool = inP.map((p) => p.name);
    let seatNo = seats - left;
    while (left > 0) {
      const w = pick(pool, (c) => rem[c], [Object.fromEntries(inP.map((p) => [p.name, p.votes]))], names, false, ties, `Seat ${seatNo + 1}`);
      seatsOf[w]++; pool.splice(pool.indexOf(w), 1); left--; seatNo++;
      steps.push({ seat: seatNo, party: w, value: rem[w] });
      if (!pool.length) break;
    }
  } else {
    const div = (k: number) => (method === 'dhondt' ? k + 1 : method === 'sainte-lague' ? 2 * k + 1 : k === 0 ? 1.4 : 2 * k + 1);
    for (let s = 1; s <= seats; s++) {
      const q = (n: string) => inP.find((p) => p.name === n)!.votes / div(seatsOf[n]);
      const w = pick(inP.map((p) => p.name), q, [Object.fromEntries(inP.map((p) => [p.name, p.votes]))], names, false, ties, `Seat ${s}`);
      steps.push({ seat: s, party: w, value: q(w) });
      seatsOf[w]++;
    }
  }
  const divisors = method === 'dhondt' ? [1, 2, 3, 4, 5, 6] : method === 'sainte-lague' ? [1, 3, 5, 7, 9, 11] : method === 'modified-sainte-lague' ? [1.4, 3, 5, 7, 9, 11] : [];
  return { seats: seatsOf, steps, ties, quota, remainders: rem, total: V, counted: Vin, eligible: inP.map((p) => p.name), divisors };
}

/** Gallagher least-squares index of disproportionality, in percentage points. */
export function gallagher(parties: Party[], seats: Record<string, number>) {
  const V = parties.reduce((s, p) => s + p.votes, 0), S = Object.values(seats).reduce((s, x) => s + x, 0);
  return Math.sqrt(parties.reduce((s, p) => s + ((p.votes / V) * 100 - (seats[p.name] / S) * 100) ** 2, 0) / 2);
}
