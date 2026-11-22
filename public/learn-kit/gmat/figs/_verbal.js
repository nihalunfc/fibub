// Shared helpers for the GMAT and GRE verbal figures: text cards that wrap on phones and follow light, dark and red modes.
import { put } from '../../kit.js';
const CSS = `.vx{display:grid;gap:6px;margin:6px 0 8px}
.vx-card{border:1.5px solid var(--line);border-radius:8px;padding:7px 10px;background:var(--surface);font-size:.94rem;line-height:1.4}
.vx-card .vx-tag{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-bottom:2px}
.vx-good{border-color:var(--good)}.vx-bad{border-color:var(--bad)}.vx-gap{border-style:dashed;border-color:var(--warn)}
.vx-arrow{text-align:center;color:var(--muted);font-size:1rem;line-height:1}
.vx-off{opacity:.5}.vx-off .vx-body{text-decoration:line-through}
button.vx-card{text-align:left;cursor:pointer;font:inherit;color:inherit;width:100%}
button.vx-card[aria-pressed=true]{border-color:var(--accent);box-shadow:inset 3px 0 0 var(--accent)}
.vx-meter{height:14px;border:1px solid var(--line);border-radius:7px;position:relative;overflow:hidden;background:var(--surface)}
.vx-meter i{position:absolute;top:0;bottom:0;transition:all .3s}.vx-meter b{position:absolute;left:50%;top:0;bottom:0;width:2px;background:var(--ink)}
@media (prefers-reduced-motion:reduce){.vx-meter i{transition:none}}`;
function css() { if (document.getElementById('vx-css')) return; const s = document.createElement('style'); s.id = 'vx-css'; s.textContent = CSS; document.head.appendChild(s); }
/** A block of cards inside the figure, above its caption. */
export function stack(host) { css(); const d = document.createElement('div'); d.className = 'vx'; put(host, d); return d; }
/** A card: tag (small heading), body html, tone '' | 'good' | 'bad' | 'gap'. Pass onclick to make it a button. */
export function card(parent, tag, html, tone = '', onclick) {
  const el = document.createElement(onclick ? 'button' : 'div');
  if (onclick) { el.type = 'button'; el.addEventListener('click', onclick); el.setAttribute('aria-pressed', 'false'); }
  el.className = 'vx-card' + (tone ? ' vx-' + tone : '');
  el.innerHTML = (tag ? `<span class="vx-tag">${tag}</span>` : '') + `<span class="vx-body">${html}</span>`;
  parent.appendChild(el); return el;
}
export function down(parent, s = '↓') { const d = document.createElement('div'); d.className = 'vx-arrow'; d.setAttribute('aria-hidden', 'true'); d.textContent = s; parent.appendChild(d); return d; }
export function clear(el) { el.innerHTML = ''; return el; }
export function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
