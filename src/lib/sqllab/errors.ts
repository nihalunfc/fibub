// SQLite error messages in plain English, with a "did you mean" for misspelt tables and columns.
import type { SchemaTable } from './client';

function dist(a: string, b: string) {
  const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
const closest = (word: string, names: string[]) => {
  let best = '', bd = 99; for (const n of names) { const x = dist(word.toLowerCase(), n.toLowerCase()); if (x < bd) { bd = x; best = n; } }
  return bd <= Math.max(2, Math.floor(word.length / 3)) ? best : '';
};

export function explainError(msg: string, code: string, tables: SchemaTable[]): string {
  const m = msg.replace(/^Error:\s*/, '');
  let r: RegExpExecArray | null;
  if ((r = /no such table: (?:main\.)?(\S+)/i.exec(m))) {
    const g = closest(r[1], tables.map((t) => t.name));
    return `There is no table called "${r[1]}".${g ? ` Did you mean ${g}?` : ''} The tables are: ${tables.map((t) => t.name).join(', ')}.`;
  }
  if ((r = /no such column: (\S+)/i.exec(m))) {
    const word = r[1].replace(/^.*\./, '');
    const all = [...new Set(tables.flatMap((t) => t.cols.map((c) => c.name)))];
    const g = closest(word, all);
    const quoted = /"[^"]*"/.test(code) && /\bWHERE\b[\s\S]*"/i.test(code) ? ' Text values go in single quotes (\'Toronto\'); double quotes are for column names.' : '';
    const pre = r[1].includes('.') ? ` Check that "${r[1].split('.')[0]}" is a table name or alias in FROM or JOIN.` : '';
    return `There is no column called "${r[1]}".${g && g !== word ? ` Did you mean ${g}?` : ''}${pre}${quoted}`;
  }
  if ((r = /ambiguous column name: (\S+)/i.exec(m))) return `"${r[1]}" is in more than one of the joined tables, so SQL doesn't know which one you mean. Put the table name or alias in front, like c.${r[1]}.`;
  if ((r = /near "([^"]*)": syntax error/i.exec(m))) {
    const w = r[1];
    if (/^FROM$/i.test(w) && /,\s*FROM/i.test(code)) return 'There is a comma just before FROM. The last column in SELECT has no comma after it.';
    if (/^(WHERE|GROUP|ORDER|HAVING|LIMIT)$/i.test(w)) return `Something is wrong just before ${w.toUpperCase()}. Check the clause order: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. Also look for a missing comma or bracket.`;
    return `SQL got confused near "${w}". Look for a missing comma, a bracket that isn't closed, a misspelt keyword, or a text value without 'single quotes'.`;
  }
  if (/incomplete input/i.test(m)) return 'The query stops too early: a bracket or a quote is probably not closed.';
  if (/misuse of aggregate/i.test(m)) return 'An aggregate like SUM or COUNT can\'t go in WHERE, because WHERE tests one row at a time. Put the condition in HAVING (after GROUP BY) instead.';
  if (/misuse of window function/i.test(m)) return 'A window function (… OVER (…)) can\'t go in WHERE or GROUP BY. Work it out in a CTE or subquery first, then filter the result.';
  if (/a GROUP BY clause is required/i.test(m)) return 'This needs a GROUP BY.';
  if (/You can only execute one statement/i.test(m)) return 'Run one statement at a time.';
  if (/UNIQUE constraint failed: (\S+)/i.test(m)) return `That value already exists in ${/: (\S+)/.exec(m)![1]}, which must be unique.`;
  if (/NOT NULL constraint failed: (\S+)/i.test(m)) return `${/: (\S+)/.exec(m)![1]} can't be empty (NULL).`;
  if (/SELECTs to the left and right of (UNION|INTERSECT|EXCEPT) do not have the same number/i.test(m)) return 'Both sides of UNION (or INTERSECT, EXCEPT) need the same number of columns.';
  if (/table (\S+) already exists/i.test(m)) return `${/table (\S+)/.exec(m)![1]} already exists. Use DROP TABLE IF EXISTS first, or press "Reset database".`;
  return m;
}
