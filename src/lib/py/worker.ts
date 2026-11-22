// Web worker that runs Python with Pyodide (self-hosted in /py/; nothing is sent anywhere). It loads Python
// and pandas once, then runs each cell in a fresh namespace and sends back printed text, tables (from
// DataFrames and Series) and errors, in the order they happened.
type Msg = { id: number; code: string; setup?: string; check?: string; files?: string[] };

const RUNNER = String.raw`
import ast, io, json, math, contextlib, traceback, datetime
import numpy as np, pandas as pd
pd.set_option('display.width', 72); pd.set_option('display.max_columns', 12); pd.set_option('display.max_rows', 30)
_buf = io.StringIO(); _items = []
MAX_ROWS = 60

def _flush():
    t = _buf.getvalue()
    if t:
        _items.append({'kind': 'text', 'text': t}); _buf.seek(0); _buf.truncate(0)

def _cell(v):
    if v is None or v is pd.NA or v is pd.NaT: return None
    if isinstance(v, (bool, np.bool_)): return str(bool(v))
    if isinstance(v, (int, np.integer)): return int(v)
    if isinstance(v, (float, np.floating)):
        if math.isnan(v): return None
        t = f'{float(v):.6g}'
        return t if ('.' in t or 'e' in t or 'n' in t) else t + '.0'
    if isinstance(v, (pd.Timestamp, datetime.date)): return str(v)[:19].replace(' 00:00:00', '')
    return str(v)

def _label(c):
    return ' / '.join(str(x) for x in c) if isinstance(c, tuple) else str(c)

def _table(obj):
    df = obj.to_frame(name=obj.name if obj.name is not None else '') if isinstance(obj, pd.Series) else obj
    n = len(df); show = df.head(MAX_ROWS) if n > MAX_ROWS else df
    names = [str(x) if x is not None else '' for x in show.index.names]
    idx = [list(i) if isinstance(i, tuple) else [i] for i in show.index]
    rows = [[_cell(x) for x in ix] + [_cell(x) for x in r] for ix, r in zip(idx, show.itertuples(index=False, name=None))]
    return {'kind': 'table', 'cols': names + [_label(c) for c in show.columns], 'nIndex': len(names),
            'rows': rows, 'shape': [int(df.shape[0]), int(df.shape[1])], 'cut': n > MAX_ROWS,
            'series': isinstance(obj, pd.Series)}

def display(*objs):
    _flush()
    for o in objs:
        if isinstance(o, (pd.DataFrame, pd.Series)): _items.append(_table(o))
        else: _items.append({'kind': 'text', 'text': repr(o) + '\n'})

def _where(e):
    tb = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == '<your code>']
    return tb[-1].lineno if tb else None

def _run(src, setup, check):
    global _items
    _items = []; _buf.seek(0); _buf.truncate(0)
    g = {'__name__': '__main__', 'pd': pd, 'np': np, 'display': display}
    err = None; ok = None; msg = None
    with contextlib.redirect_stdout(_buf), contextlib.redirect_stderr(_buf):
        try:
            if setup: exec(compile(setup, '<setup>', 'exec'), g)
            tree = ast.parse(src, '<your code>')
            last = tree.body.pop() if tree.body and isinstance(tree.body[-1], ast.Expr) else None
            exec(compile(tree, '<your code>', 'exec'), g)
            g['_'] = None
            if last is not None:
                v = eval(compile(ast.Expression(last.value), '<your code>', 'eval'), g)
                g['_'] = v
                if v is not None: display(v)
        except SyntaxError as e:
            err = {'type': 'SyntaxError', 'msg': e.msg, 'line': e.lineno}
        except Exception as e:
            err = {'type': type(e).__name__, 'msg': str(e), 'line': _where(e)}
        if check and err is None:
            try:
                exec(compile(check, '<check>', 'exec'), g); ok = True
            except AssertionError as e:
                ok = False; msg = str(e) or 'Not quite yet. Compare your result with the task.'
            except Exception as e:
                ok = False; msg = f'{type(e).__name__}: {e}'
    _flush()
    return json.dumps({'items': _items, 'error': err, 'ok': ok, 'msg': msg})
`;

let py: any = null;
let ready: Promise<void> | null = null;
const have = new Set<string>();

function boot() {
  ready ??= (async () => {
    const url = '/py/pyodide.mjs';
    const { loadPyodide } = await import(/* @vite-ignore */ url);
    post({ status: 'Loading Python…' });
    py = await loadPyodide({ indexURL: '/py/' });
    post({ status: 'Loading pandas…' });
    await py.loadPackage(['pandas']);
    py.runPython(RUNNER);
    post({ status: 'ready' });
  })();
  return ready;
}

function post(m: object) { (self as unknown as Worker).postMessage(m); }

async function files(names: string[]) {
  for (const n of names) {
    if (have.has(n) || !/^[\w.-]+$/.test(n)) continue;
    const r = await fetch(`/data/courses/pandas/${n}`);
    if (!r.ok) throw new Error(`Could not load the file ${n}`);
    py.FS.writeFile(n, new Uint8Array(await r.arrayBuffer()));
    have.add(n);
  }
}

self.onmessage = async (e: MessageEvent<Msg | { warm: true }>) => {
  const m = e.data;
  try {
    await boot();
    if ('warm' in m) return;
    await files(m.files ?? []);
    const run = py.globals.get('_run');
    const out = run(m.code, m.setup ?? '', m.check ?? '');
    run.destroy?.();
    post({ id: m.id, result: JSON.parse(out) });
  } catch (err) {
    post({ id: 'id' in m ? m.id : -1, result: { items: [], error: { type: 'Error', msg: String((err as Error)?.message ?? err), line: null }, ok: null, msg: null } });
  }
};
