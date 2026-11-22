# Adds lesson-kit blocks to existing course lessons (used for the Statistics and pandas upgrade, 2026-11-22).
# Usage: python3 scripts/courses/kit-upgrade.py <course> <blocks.py>
# blocks.py defines L = { slug: dict(big=..., meaning=[(dt, dd), ...], myth=..., steps=[...], intro=..., problems=[ids],
#   keys=[...], sources=[...], analogy=...) }. Idempotent: a lesson that already has a bigidea box is skipped.
import sys, re, pathlib, runpy
course, src = sys.argv[1], sys.argv[2]
L = runpy.run_path(src)['L']
root = pathlib.Path(__file__).resolve().parents[2] / 'src/courses' / course
def q(s): return "'" + s.replace("'", "''") + "'"
for slug, b in L.items():
    p = root / f'{slug}.md'
    md = p.read_text()
    if 'class="bigidea"' in md:
        print('skip', slug); continue
    fm_end = md.index('\n---\n', 4)
    fm, body = md[:fm_end], md[fm_end + 5:]
    if 'sources:' not in fm:
        fm += '\nsources:\n' + ''.join(f'  - {q(s)}\n' for s in b['sources']).rstrip('\n')
    # big idea (and optional everyday analogy) after the opening "**Module ...**" paragraph
    lines = body.split('\n')
    i = next(k for k, l in enumerate(lines) if l.startswith('**Module'))
    add = ['', f'<div class="bigidea">{b["big"]}</div>']
    if b.get('analogy'): add += ['', f'**In everyday terms:** {b["analogy"]}']
    lines[i + 1:i + 1] = add
    body = '\n'.join(lines)
    blk = []
    if b.get('meaning'):
        rows = '\n'.join(f'<dt>{dt}</dt><dd>{dd}</dd>' for dt, dd in b['meaning'])
        blk.append(f'<div class="meaning">\n\n<dl>\n{rows}\n</dl>\n\n</div>')
    if b.get('myth'): blk.append(f'<div class="myth">\n\n{b["myth"]}\n\n</div>')
    if b.get('steps'):
        st = '\n'.join(f'<div class="step">{s}</div>' for s in b['steps'])
        blk.append((b.get('intro', 'Watch it happen, one step at a time:') + '\n\n') + f'<div class="steps">\n{st}\n</div>')
    for pid in b.get('problems', []): blk.append(f'<div class="problem" data-problem="{pid}"></div>')
    ins = '\n\n'.join(blk) + '\n\n'
    anchor = b.get('before', '<details class="maths"')
    k = body.find(anchor)
    if k < 0: k = body.find('\n## ', body.find('## 2.')) + 1  # fall back: before section 3
    body = body[:k] + ins + body[k:]
    keys = '\n'.join(f'- {x}' for x in b['keys'])
    body = body.rstrip('\n') + f'\n\n<div class="keypoints">\n\n{keys}\n\n</div>\n'
    body = body.replace("updated: 2026-11-21", "updated: 2026-11-22")
    p.write_text(fm + '\n---\n' + body)
    print('upgraded', slug)
