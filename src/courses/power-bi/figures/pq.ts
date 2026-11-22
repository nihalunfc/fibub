// Power Query in miniature: small tables and the applied steps that clean or reshape them, each with the M
// code Power BI writes for it. PqSteps.astro replays them and highlights what each step changed.
export type Cell = string | number | null;
export type PTable = { cols: string[]; rows: Cell[][]; ids: number[] };
export type PStep = { name: string; m: string; note: string; fn: (t: PTable) => PTable };
export type Scenario = { title: string; start: PTable; steps: PStep[] };

const T = (cols: string[], rows: Cell[][]): PTable => ({ cols, rows, ids: rows.map((_, i) => i + 1) });
const mapCol = (t: PTable, c: string, f: (v: Cell) => Cell): PTable => { const i = t.cols.indexOf(c); return { ...t, rows: t.rows.map((r) => r.map((v, j) => (j === i ? f(v) : v))) }; };
const keep = (t: PTable, f: (r: Cell[]) => boolean): PTable => { const k = t.rows.map(f); return { cols: t.cols, rows: t.rows.filter((_, i) => k[i]), ids: t.ids.filter((_, i) => k[i]) }; };
const title = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const num = (v: Cell) => (v === null || v === '' || v === 'N/A' ? null : Number(String(v).replace(/[$,]/g, '')));
const date = (v: Cell) => { const m = /^(\d\d)\/(\d\d)\/(\d{4})$/.exec(String(v)); return m ? `${m[3]}-${m[2]}-${m[1]}` : v; };

export const SCENARIOS: Record<string, Scenario> = {
  clean: {
    title: 'Cleaning a till export from one store',
    start: T(['Column1', 'Column2', 'Column3', 'Column4', 'Column5'], [
      ['Store Name', 'Sale Date', 'Product', 'Qty', 'Price'],
      ['  falls centre ', '03/01/2025', 'Desk lamp - Large', '2', '$38.00'],
      ['FALLS CENTRE', '03/01/2025', 'Water bottle - 750 ml', 'N/A', '$20.00'],
      ['Falls Centre', '04/01/2025', 'Smart plug - Single', '1', '$30.00'],
      [null, null, null, null, null],
      ['falls centre', '04/01/2025', 'Desk lamp - Small', '3', '$32.00'],
      ['TOTAL', null, null, '6', '$120.00'],
    ]),
    steps: [
      { name: 'Promoted headers', m: 'Table.PromoteHeaders(Source, [PromoteAllScalars=true])', note: 'The first row holds the real column names, so it becomes the header.',
        fn: (t) => ({ cols: t.rows[0].map(String), rows: t.rows.slice(1), ids: t.ids.slice(1) }) },
      { name: 'Trimmed text', m: 'Table.TransformColumns(#"Promoted Headers", {{"Store Name", Text.Trim, type text}})', note: 'Trim removes the spaces at the start and end of the text ("  falls centre " becomes "falls centre").',
        fn: (t) => mapCol(t, 'Store Name', (v) => (v === null ? v : String(v).trim())) },
      { name: 'Capitalized each word', m: 'Table.TransformColumns(#"Trimmed Text", {{"Store Name", Text.Proper, type text}})', note: 'Three spellings of the same store become one, so they group together later.',
        fn: (t) => mapCol(t, 'Store Name', (v) => (v === null ? v : title(String(v)))) },
      { name: 'Removed blank rows', m: 'Table.SelectRows(#"Capitalized Each Word", each not List.IsEmpty(List.RemoveMatchingItems(Record.FieldValues(_), {"", null})))', note: 'Rows where every cell is empty are dropped.',
        fn: (t) => keep(t, (r) => r.some((v) => v !== null && v !== '')) },
      { name: 'Filtered rows', m: 'Table.SelectRows(#"Removed Blank Rows", each [Store Name] <> "Total")', note: 'The till added a TOTAL row. Totals belong in the report, not in the data, or every sum would count them twice.',
        fn: (t) => keep(t, (r) => r[0] !== 'Total') },
      { name: 'Changed type', m: 'Table.TransformColumnTypes(#"Filtered Rows", {{"Sale Date", type date}, {"Qty", Int64.Type}, {"Price", Currency.Type}})', note: 'Text becomes real dates and numbers. Dates are read with the file\'s locale (day/month here); "N/A" can\'t be a number, so it becomes null.',
        fn: (t) => mapCol(mapCol(mapCol(t, 'Sale Date', date), 'Qty', num), 'Price', num) },
      { name: 'Split column by delimiter', m: 'Table.SplitColumn(#"Changed Type", "Product", Splitter.SplitTextByDelimiter(" - "), {"Product", "Size"})', note: 'One column held two facts. Splitting at " - " gives Product and Size their own columns.',
        fn: (t) => { const i = t.cols.indexOf('Product'); return { ...t, cols: [...t.cols.slice(0, i + 1), 'Size', ...t.cols.slice(i + 1)], rows: t.rows.map((r) => { const [a, b] = String(r[i]).split(' - '); return [...r.slice(0, i), a, b ?? null, ...r.slice(i + 1)]; }) }; } },
      { name: 'Added custom column', m: 'Table.AddColumn(#"Split Column", "Amount", each [Qty] * [Price], Currency.Type)', note: 'A new column worked out row by row. The row with no quantity gets null, not 0: you can see it is missing.',
        fn: (t) => { const q = t.cols.indexOf('Qty'), p = t.cols.indexOf('Price'); return { ...t, cols: [...t.cols, 'Amount'], rows: t.rows.map((r) => [...r, r[q] === null || r[p] === null ? null : (r[q] as number) * (r[p] as number)]) }; } },
    ],
  },
  unpivot: {
    title: 'Unpivoting a targets sheet',
    start: T(['Store', 'Jan', 'Feb', 'Mar'], [['Falls Centre', 9200, 8800, 9600], ['Queen Street', 12100, 11500, 12800], ['Rideau', 7800, 7400, 8100]]),
    steps: [
      { name: 'Unpivoted other columns', m: 'Table.UnpivotOtherColumns(Source, {"Store"}, "Attribute", "Value")', note: 'Every month column becomes rows: one row per store per month. The table gets longer and thinner, which is the shape Power BI wants.',
        fn: (t) => { const rows: Cell[][] = [], ids: number[] = []; t.rows.forEach((r) => t.cols.slice(1).forEach((c, j) => { rows.push([r[0], c, r[j + 1]]); ids.push(1000 + rows.length); })); return { cols: ['Store', 'Attribute', 'Value'], rows, ids }; } },
      { name: 'Renamed columns', m: 'Table.RenameColumns(#"Unpivoted Other Columns", {{"Attribute", "Month"}, {"Value", "Target"}})', note: 'Give the new columns names people understand.',
        fn: (t) => ({ ...t, cols: ['Store', 'Month', 'Target'] }) },
      { name: 'Pivoted column (the reverse)', m: 'Table.Pivot(#"Renamed Columns", List.Distinct(#"Renamed Columns"[Month]), "Month", "Target", List.Sum)', note: 'Pivot is the opposite: values of Month become columns again. Useful for a report table, rarely for the model.',
        fn: (t) => { const ms = [...new Set(t.rows.map((r) => r[1] as string))], st = [...new Set(t.rows.map((r) => r[0] as string))]; return { cols: ['Store', ...ms], rows: st.map((s) => [s, ...ms.map((m) => (t.rows.find((r) => r[0] === s && r[1] === m)?.[2] ?? null))]), ids: st.map((_, i) => 2000 + i) }; } },
    ],
  },
  group: {
    title: 'Grouping order lines by store',
    start: T(['Store', 'Product', 'Qty', 'Amount'], [['Falls Centre', 'Desk lamp', 2, 76], ['Rideau', 'Smart plug', 1, 30], ['Falls Centre', 'Water bottle', 3, 60], ['Queen Street', 'Desk lamp', 1, 38], ['Rideau', 'Desk lamp', 2, 76], ['Falls Centre', 'Smart plug', 1, 30]]),
    steps: [
      { name: 'Sorted rows', m: 'Table.Sort(Source, {{"Store", Order.Ascending}})', note: 'Sorting is not needed to group, but it lets you see which rows will end up together.',
        fn: (t) => { const o = t.rows.map((_, i) => i).sort((a, b) => String(t.rows[a][0]).localeCompare(String(t.rows[b][0]))); return { cols: t.cols, rows: o.map((i) => t.rows[i]), ids: o.map((i) => t.ids[i]) }; } },
      { name: 'Grouped rows', m: 'Table.Group(#"Sorted Rows", {"Store"}, {{"Units", each List.Sum([Qty]), type number}, {"Sales", each List.Sum([Amount]), type number}, {"Lines", each Table.RowCount(_), Int64.Type}})', note: 'Rows with the same Store collapse into one row; Units and Sales are added up and Lines counts the rows in each group.',
        fn: (t) => { const g = new Map<string, Cell[][]>(); t.rows.forEach((r) => g.set(r[0] as string, [...(g.get(r[0] as string) ?? []), r])); const rows = [...g].map(([s, rs]) => [s, rs.reduce((a, r) => a + (r[2] as number), 0), rs.reduce((a, r) => a + (r[3] as number), 0), rs.length]); return { cols: ['Store', 'Units', 'Sales', 'Lines'], rows, ids: rows.map((_, i) => 3000 + i) }; } },
    ],
  },
};

/** Apply the first k steps. */
export function upTo(s: Scenario, k: number) { let t = s.start; for (let i = 0; i < k; i++) t = s.steps[i].fn(t); return t; }
