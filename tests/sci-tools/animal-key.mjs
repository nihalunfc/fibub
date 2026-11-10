// #1387 animal classification key. Every example animal walked through the key and checked against its phylum
// as given in standard zoology (Porifera to Chordata); the key's structure checked for dead ends and loops.
import * as A from '../../src/lib/sci/school-animalkey.ts';
export default async (check) => {
  check('key: 11 phyla, 20 animals', A.PHYLA.length === 11 && A.ANIMALS.length === 20);
  for (const a of A.ANIMALS) check(`key: ${a.name} → ${a.phylum}`, A.walk(a.answers).leaf === a.phylum);
  // every leaf reachable, every option points at a real node, no node reached twice on a path
  const seen = new Set(); const stack = [[A.ROOT, []]]; let ok = true;
  while (stack.length) { const [id, trail] = stack.pop(); if (trail.includes(id) || !A.NODES[id]) { ok = false; continue; } seen.add(id); const n = A.NODES[id]; if (!A.isLeaf(n)) for (const o of n.opts) stack.push([o.to, [...trail, id]]); }
  check('key: no loops, no broken links', ok);
  check('key: every node reachable', Object.keys(A.NODES).every((k) => seen.has(k)));
  check('key: every phylum has an example animal', A.PHYLA.every((p) => A.ANIMALS.some((a) => a.phylum === p)));
  check('key: a missing answer stops the walk', A.walk({ org: 1 }).leaf === null && A.walk({ org: 1 }).path.join() === 'org,sym');
};
