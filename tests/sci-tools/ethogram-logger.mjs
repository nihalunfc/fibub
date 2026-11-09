// #315 ethogram logger. Reference values from an independent Python check on the page's made-up session: the
// state running at each instant sampled on a 1 ms grid (numpy) for time budgets, and bouts listed directly.
import { parseEthogram, bouts, analyse, clock } from '../../src/lib/sci/ethogram.ts';

const LOG = [[0.0, "Vigilant", "state"], [8.9, "Scratch", "event"], [14.1, "Foraging", "state"], [16.3, "Scratch", "event"], [25.5, "Moving", "state"], [27.3, "Call", "event"], [33.6, "Foraging", "state"], [48.6, "Call", "event"], [77.4, "Scratch", "event"], [91.1, "Vigilant", "state"], [93.1, "Resting", "state"], [128.1, "Foraging", "state"], [128.4, "Call", "event"], [147.1, "Moving", "state"], [158.4, "Foraging", "state"], [159.1, "Scratch", "event"], [218.1, "Moving", "state"], [239.4, "Resting", "state"], [239.8, "Call", "event"], [270.9, "Foraging", "state"], [278.3, "Call", "event"], [297.5, "Scratch", "event"], [313.3, "Resting", "state"], [339.9, "Foraging", "state"], [347.4, "Scratch", "event"], [357.8, "Scratch", "event"], [383.7, "Call", "event"], [395.5, "Vigilant", "state"], [412.5, "Moving", "state"], [433.8, "Foraging", "state"], [440.6, "Scratch", "event"], [442.6, "Vigilant", "state"], [464.3, "Foraging", "state"], [484.1, "Resting", "state"], [489.6, "Scratch", "event"], [540.6, "Call", "event"], [557.8, "Call", "event"], [580.0, "", "stop"], [600.0, "Foraging", "state"]].map(([t, name, kind]) => ({ t, name, kind }));
export default async (check) => {
  const near = (name, a, b, tol = 1e-6) => check(`ethogram: ${name} (${a} vs ${b})`, Math.abs(a - b) <= tol);
  const eth = parseEthogram('F, Foraging, state\nR, Resting, state\nV, Vigilant, state\nM, Moving, state\nC, Call, event\nS, Scratch, event');
  check('ethogram: six behaviours read', eth.length === 6 && eth[0].key === 'f' && eth[4].kind === 'event');
  const a = analyse(LOG, 660, eth), st = Object.fromEntries(a.states.map((s) => [s.name, s])), ev = Object.fromEntries(a.events.map((e) => [e.name, e]));
  near('Foraging total', st.Foraging.total, 334.2, 1e-3); near('Foraging share', st.Foraging.share * 100, 50.636, 1e-3);
  check('ethogram: Foraging 9 bouts', st.Foraging.bouts === 9);
  near('Foraging mean bout', st.Foraging.mean, 37.1333, 1e-4); near('Foraging median bout', st.Foraging.median, 42.4, 1e-9);
  near('Foraging shortest', st.Foraging.min, 8.8, 1e-9); near('Foraging longest', st.Foraging.max, 60, 1e-9);
  near('Resting total', st.Resting.total, 189, 1e-3); near('Resting median', st.Resting.median, 33.25, 1e-9); check('ethogram: Resting 4 bouts', st.Resting.bouts === 4);
  near('Vigilant total', st.Vigilant.total, 54.8, 1e-3); near('Vigilant median', st.Vigilant.median, 15.55, 1e-9); near('Vigilant shortest', st.Vigilant.min, 2, 1e-9);
  near('Moving total', st.Moving.total, 62, 1e-3); near('Moving mean', st.Moving.mean, 15.5, 1e-9);
  near('unscored (out of sight)', a.unscored, 20, 1e-6);
  check('ethogram: 8 calls and 9 scratches', ev.Call.count === 8 && ev.Scratch.count === 9);
  near('call rate per minute', ev.Call.perMin, 0.7272727, 1e-6);
  // Hand checks: a stop, repeated keys, a state still running at the end, unseen behaviours.
  const h = analyse([{ t: 0, name: 'A', kind: 'state' }, { t: 10, name: 'A', kind: 'state' }, { t: 15, name: 'B', kind: 'state' }, { t: 20, name: '', kind: 'stop' }, { t: 30, name: 'A', kind: 'state' }, { t: 12, name: 'E', kind: 'event' }], 40, [{ key: 'z', name: 'Z', kind: 'state' }]);
  const hs = Object.fromEntries(h.states.map((s) => [s.name, s]));
  check('ethogram: hand log totals', hs.A.total === 25 && hs.A.bouts === 3 && hs.B.total === 5 && h.unscored === 10 && hs.Z.bouts === 0 && hs.Z.total === 0 && h.transitions === 1);
  check('ethogram: bouts run to the end', bouts([{ t: 5, name: 'A', kind: 'state' }], 9).map((b) => b.end).join() === '9');
  let msg = ''; try { parseEthogram('F, Foraging, state\nf, Fighting, state'); } catch (e) { msg = e.message; }
  check('ethogram: duplicate key refused', msg.includes('used twice'));
  msg = ''; try { parseEthogram('FF, Foraging, state'); } catch (e) { msg = e.message; }
  check('ethogram: long key refused', msg.includes('one letter or digit'));
  check('ethogram: clock', clock(75.25) === '1:15.2' && clock(3725, false) === '1:02:05');
};
