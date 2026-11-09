// #1129 Food web builder. Food chains in both example webs were counted by a separate Python depth-first
// search over the same links (forest 14 chains, longest 5 organisms; pond 9, longest 5); trophic levels,
// knock-on extinctions and the 10 % energy pyramid were checked by hand.
import { WEBS, levels, chains, removeEffects, pyramid } from '../../src/lib/sci/foodweb.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const [forest, pond] = WEBS;
  const cf = chains(forest.orgs, forest.links), cp = chains(pond.orgs, pond.links);
  check('web: forest chains match Python', cf.length === 14 && Math.max(...cf.map((c) => c.length)) === 5 && cf.some((c) => c.join('-') === 'grass-deer-tiger'));
  check('web: pond chains match Python', cp.length === 9 && Math.max(...cp.map((c) => c.length)) === 5 && cp.some((c) => c.join('-') === 'algae-larvae-smallfish-heron'));
  const lf = levels(forest.orgs, forest.links), lp = levels(pond.orgs, pond.links);
  check('web: trophic levels', lf.grass === 1 && lf.deer === 2 && lf.frog === 3 && lf.tiger === 3 && lp.heron === 4 && lp.smallfish === 3);
  check('web: no route to a producer gives no level', Number.isNaN(levels([{ id: 'a', name: 'A' }, { id: 'p', name: 'P', producer: true }], [])['a']));
  const g = removeEffects(forest.orgs, forest.links, 'grass');
  check('web: remove grass: grasshopper dies out, others go hungry', g.gone.join() === 'grasshopper' && ['deer', 'rabbit', 'mouse', 'frog', 'sparrow'].every((x) => g.hungrier.includes(x)) && !g.alive.includes('grass'));
  const s = removeEffects(forest.orgs, forest.links, 'snake');
  check('web: remove snake: its prey increase, hawk loses some food', ['mouse', 'frog', 'sparrow'].every((x) => s.more.includes(x)) && s.hungrier.join() === 'hawk' && s.gone.length === 0);
  const d = removeEffects(forest.orgs, forest.links, 'deer');
  check('web: remove deer: tiger dies out', d.gone.join() === 'tiger');
  const a = removeEffects(pond.orgs, pond.links, 'algae');
  check('web: remove algae: knock-on loss down the pond web', ['zoo', 'larvae', 'tadpole', 'smallfish', 'nymph', 'bigfish', 'heron'].every((x) => a.gone.includes(x)) && a.alive.includes('snail'));
  check('web: cycles do not loop for ever', chains([{ id: 'p', name: 'P', producer: true }, { id: 'a', name: 'A' }, { id: 'b', name: 'B' }], [['p', 'a'], ['a', 'b'], ['b', 'a']]).length === 1);
  check('web: 10 % rule', pyramid(10000, 0.1, 4).every((v, i) => near(v, [10000, 1000, 100, 10][i], 1e-9)) && near(pyramid(5000, 0.2, 3)[2], 200));
};
