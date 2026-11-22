// The SQL sandbox page: starts with the code passed in #q=..., and the table list fills the editor.
const box = document.getElementById('sandbox');
if (box) {
  const q = /[#&]q=([^&]*)/.exec(location.hash);
  if (q) { try { box.textContent = decodeURIComponent(q[1]); } catch { /* keep the default */ } }
}
const { liven } = await import('./sqllab');
liven();
for (const b of document.querySelectorAll<HTMLButtonElement>('[data-table]')) b.addEventListener('click', () => {
  const ta = document.querySelector<HTMLTextAreaElement>('#sandbox textarea'); if (!ta) return;
  ta.value = `SELECT *\nFROM ${b.dataset.table}\nLIMIT 20`; ta.dispatchEvent(new Event('input'));
  (document.querySelector('#sandbox .rn-bar .btn') as HTMLButtonElement | null)?.click();
  ta.scrollIntoView({ block: 'center', behavior: 'smooth' });
});
