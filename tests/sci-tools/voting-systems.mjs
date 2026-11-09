// #751 Voting systems: textbook examples plus the tool's made-up example, cross-checked with an independent
// Python implementation (exact fractions for STV) on 400 random elections.
import * as V from '../../src/lib/sci/voting.ts';

export default async (check) => {
  // Tennessee capital (a standard teaching example): plurality Memphis, IRV Knoxville, Condorcet and Borda Nashville.
  const T = V.parseBallots('42: Memphis > Nashville > Chattanooga > Knoxville\n26: Nashville > Chattanooga > Knoxville > Memphis\n15: Chattanooga > Knoxville > Nashville > Memphis\n17: Knoxville > Chattanooga > Nashville > Memphis');
  check('voting: plurality Memphis', V.plurality(T).winner === 'Memphis' && V.plurality(T).votes.Memphis === 42);
  const ir = V.irv(T);
  check('voting: IRV Knoxville in 3 rounds', ir.winner === 'Knoxville' && ir.rounds.length === 3 && ir.rounds[0].out === 'Chattanooga' && ir.rounds[1].out === 'Nashville' && ir.rounds[2].votes.Knoxville === 58);
  const bo = V.borda(T);
  check('voting: Borda Nashville 194', bo.winner === 'Nashville' && bo.points.Nashville === 194 && bo.points.Memphis === 126 && bo.points.Chattanooga === 173 && bo.points.Knoxville === 107);
  check('voting: Condorcet Nashville', V.condorcet(T).condorcetWinner === 'Nashville' && V.condorcet(T).d[1][0] === 58);
  const tr = V.twoRound(T);
  check('voting: two-round Memphis v Nashville', tr.rounds[1].votes.Nashville === 58 && tr.winner === 'Nashville');

  // Schulze's own 45-voter example: strongest paths make E the winner.
  const S = V.parseBallots('candidates: A,B,C,D,E\n5: A>C>B>E>D\n5: A>D>E>C>B\n8: B>E>D>A>C\n3: C>A>B>E>D\n7: C>A>E>B>D\n2: C>B>A>D>E\n7: D>C>E>B>A\n8: E>B>A>D>C');
  const sc = V.condorcet(S);
  check('voting: Schulze example winner E, no Condorcet winner', sc.condorcetWinner === null && sc.schulzeWinners.join() === 'E' && sc.d[0][1] === 20 && sc.p[0][1] === 28 && sc.p[4][3] === 31 && sc.p[4][0] === 25 && sc.schulzeOrder.join('') === 'EACBD');

  // Party lists: 8 seats, A 100 000, B 80 000, C 30 000, D 20 000.
  const P = V.parseParties('A 100000\nB 80000\nC 30000\nD 20000');
  const s = (m, th = 0) => Object.values(V.listSeats(P, 8, m, th).seats).join(',');
  check("voting: D'Hondt 4,3,1,0", s('dhondt') === '4,3,1,0');
  check('voting: Sainte-Laguë 3,3,1,1', s('sainte-lague') === '3,3,1,1');
  check('voting: Hare 3,3,1,1 and Droop 4,3,1,0', s('hare') === '3,3,1,1' && s('droop') === '4,3,1,0' && V.listSeats(P, 8, 'droop').quota === 25556);
  check('voting: 10 % threshold drops D', s('sainte-lague', 10) === '4,3,1,0' && V.listSeats(P, 8, 'sainte-lague', 10).eligible.length === 3);
  check('voting: Gallagher index', Math.abs(V.gallagher(P, { A: 4, B: 3, C: 1, D: 0 }) - 7.932) < 0.001);

  // The made-up example on the page: every method can pick someone different.
  const E = V.parseBallots('candidates: Ash, Birch, Cedar, Dune, Elm\n31: Ash > Dune > Elm\n24: Birch > Cedar > Elm\n17: Cedar | Birch > Elm > Dune\n12: Elm > Cedar > Birch\n9: Dune > Elm > Cedar\n7: Elm > Dune > Ash');
  check('voting: example parse', E.total === 100 && E.candidates.join() === 'Ash,Birch,Cedar,Dune,Elm' && E.ballots[2].approve === 1);
  check('voting: example winners', V.plurality(E).winner === 'Ash' && V.twoRound(E).winner === 'Birch' && V.irv(E).winner === 'Birch' && V.borda(E).winner === 'Elm' && V.condorcet(E).condorcetWinner === 'Elm' && V.approval(E, 2).winner === 'Cedar');
  const st = V.stv(E, 2);
  check('voting: example STV (quota 34, Birch and Elm)', st.quota === 34 && st.elected.join() === 'Birch,Elm' && st.stages.length === 4 && Math.abs(st.stages[3].votes.Elm - 35) < 1e-9 && st.stages[3].votes.Birch === 34);
  // Weighted inclusive Gregory by hand: Birch has 41, surplus 7, value 7/41 for all 41 ballots; 24 go to Elm (via Cedar), 17 to Elm.
  check('voting: transfer value 7/41', Math.abs(st.stages[3].transferValue - 7 / 41) < 1e-12);

  // Independent Python implementation (scratch voting_ref.py, exact fractions): 400 random elections with
  // 3 to 7 candidates, truncated ballots and approval marks matched on every method (ties skipped). Spot case:
  const R = V.parseBallots('candidates: A,B,C,D\n30: A>B\n25: B>C>D\n20: C>A\n15: D>C\n10: B');
  const rs = V.stv(R, 2);
  check('voting: STV spot case from the Python check', rs.quota === 34 && rs.elected.join() === 'B,C' && rs.stages.length === 3);

  let bad = 0; try { V.parseBallots('3: A > A'); } catch { bad++; } try { V.parseBallots('A'); } catch { bad++; } try { V.stv(E, 5); } catch { bad++; }
  check('voting: bad input is refused', bad === 3);
};
