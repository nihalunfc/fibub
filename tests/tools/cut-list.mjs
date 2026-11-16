// #T1011 Cut list. Packer: src/lib/home/cutlist.ts
import { packCuts } from '../../src/lib/home/cutlist.ts';
export const path = '/everyday/cut-list/';
export default async ({ page, check, BASE }) => {
  // Hand-checked: 5, 4, 3, 3, 3, 2 on boards of 10 with no kerf. First-fit decreasing needs 3 boards
  // ([5,4], [3,3,3], [2]); the exact search finds 2 ([5,3,2], [4,3,3]).
  const a = packCuts(10, 0, [{ label: 'a', len: 5, qty: 1 }, { label: 'b', len: 4, qty: 1 }, { label: 'c', len: 3, qty: 3 }, { label: 'd', len: 2, qty: 1 }]);
  check(a.boards.length === 2 && a.optimal && a.waste === 0 && a.boards.every((b) => b.cuts.reduce((s, c) => s + c.len, 0) === 10), 'cut-list: exact search beats first-fit (2 boards, not 3)');
  // Kerf: 4 × 600 on 2400 with a 3 mm kerf needs 2 boards (600 × 4 + 3 cuts = 2409 > 2400).
  const k = packCuts(2400, 3, [{ label: 'x', len: 600, qty: 4 }]);
  check(k.boards.length === 2 && k.boards[0].cuts.length === 3 && k.boards[0].offcut === 591, 'cut-list: kerf pushes the 4th 600 mm piece onto a 2nd board, 591 mm offcut');
  // Bookcase example in the guide: 2 × 1200, 4 × 764, 1 × 800 on 2400, kerf 3: 3 boards, offcuts 99, 394, 430, waste 13.1 %.
  const bk = packCuts(2400, 3, [{ label: 'Side', len: 1200, qty: 2 }, { label: 'Shelf', len: 764, qty: 4 }, { label: 'Top', len: 800, qty: 1 }]);
  check(bk.boards.length === 3 && bk.optimal && bk.boards.map((b) => b.offcut).join() === '99,394,430' && Math.abs(bk.waste - 13.111) < 0.01, `cut-list: bookcase example 3 boards, offcuts 99/394/430, 13.1% waste (got ${bk.boards.map((b) => b.offcut)})`);
  const tl = packCuts(2400, 3, [{ label: 'Long', len: 2500, qty: 1 }, { label: 'Ok', len: 2400, qty: 1 }]);
  check(tl.tooLong.length === 1 && tl.boards.length === 1 && tl.boards[0].offcut === 0, 'cut-list: piece longer than the board is left out; an exact-length piece needs no cut');

  await page.goto(`${BASE}/everyday/cut-list/`); await page.waitForTimeout(300);
  const R = '.cl';
  check((await page.textContent(`${R} .cl-big`)) === '3 boards of 2400 × 140 mm', 'cut-list: example shows 3 boards');
  check((await page.locator(`${R} .cl-board`).count()) === 3, 'cut-list: draws 3 boards');
  check((await page.textContent(`${R} .cl-text`)).includes('Board 1: Shelf 764, Shelf 764, Shelf 764; offcut 99'), 'cut-list: printable list');
  await page.fill(`${R} .cl-row:nth-child(2) .cl-qty`, '1');
  check((await page.textContent(`${R} .cl-big`)) === '2 boards of 2400 × 140 mm', 'cut-list: fewer shelves, 2 boards');
  await page.fill(`${R} .cl-row:nth-child(2) .cl-qty`, 'x');
  check(!(await page.locator(`${R} .cl-err`).isHidden()), 'cut-list: bad quantity shows an error');
  await page.click(`${R} .cl-units button[data-u=in]`);
  check((await page.textContent(`${R} .cl-big`)) === '3 boards of 96 × 5 1/2 in', 'cut-list: inch example with fractions');
  check((await page.textContent(`${R} .cl-text`)).includes('Shelf 30 1/8'), 'cut-list: inch list shows fractions');
};
