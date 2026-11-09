// #1123 Cell explorer. The parts data is checked for the standard textbook facts (cell wall in plants and
// bacteria, chloroplasts only in plants, no nucleus in bacteria, 70S vs 80S stated) and that every drawn part
// has a description; the magnification sums are checked against hand-worked examples (25 mm drawing of a 50 µm
// cell = ×500; 20 mm at ×10 000 = 2 µm; ×10 eyepiece and ×40 objective = ×400).
import { readFileSync } from 'node:fs';
import { PARTS, partById, partsFor, compare, magnification, realSize, totalMag } from '../../src/lib/sci/cellparts.ts';

export default async (check) => {
  const has = (id, k) => partById(id).in.includes(k);
  check('cells: wall in plant and bacterium, not animal', has('wall', 'plant') && has('wall', 'bacterium') && !has('wall', 'animal'));
  check('cells: chloroplasts only in plants', has('chloro', 'plant') && !has('chloro', 'animal') && !has('chloro', 'bacterium'));
  check('cells: no nucleus in bacteria, nucleoid instead', !has('nucleus', 'bacterium') && has('nucleoid', 'bacterium') && !has('nucleoid', 'plant'));
  check('cells: ribosomes, membrane and cytoplasm everywhere', ['ribo', 'membrane', 'cytoplasm'].every((id) => ['plant', 'animal', 'bacterium'].every((k) => has(id, k))));
  check('cells: mitochondria in eukaryotes only', has('mito', 'plant') && has('mito', 'animal') && !has('mito', 'bacterium'));
  check('cells: 70S and 80S named', partById('ribo').more.includes('70S') && partById('ribo').more.includes('80S'));
  check('cells: ids unique, every part has a job and more', new Set(PARTS.map((p) => p.id)).size === PARTS.length && PARTS.every((p) => p.job.length > 30 && p.more.length > 30 && p.in.length > 0));
  check('cells: Class 9 hides Class 11 parts', !partsFor('animal', 9).some((p) => p.id === 'centriole') && partsFor('animal', 11).some((p) => p.id === 'centriole'));
  check('cells: compare table', compare(9).length === PARTS.filter((p) => p.level === 9).length && compare(11).length === PARTS.length && compare(11).find((r) => r.id === 'lyso').animal === true);
  // every part drawn in the page has data, and every part is drawn in each cell it belongs to
  const src = readFileSync(new URL('../../src/tools/cell-explorer/Tool.astro', import.meta.url), 'utf8');
  const drawn = {};
  for (const m of src.matchAll(/<svg class="cex-svg" data-k="(\w+)"[\s\S]*?<\/svg>/g)) drawn[m[1]] = new Set([...m[0].matchAll(/data-o="(\w+)"/g)].map((x) => x[1]));
  const ok = ['plant', 'animal', 'bacterium'].every((k) => drawn[k] && [...drawn[k]].every((id) => partById(id) && partById(id).in.includes(k)) && partsFor(k, 11).every((p) => drawn[k].has(p.id)));
  check('cells: drawings match the data', ok);
  check('cells: magnification = image ÷ real', magnification(25, 50) === 500 && realSize(20, 10000) === 2 && totalMag(10, 40) === 400);
};
