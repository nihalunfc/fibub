// Pass a file from one fibub tool to another without uploading it: the file is kept for a
// moment in this browser's own storage (IndexedDB) and removed as soon as the next page reads it.
const DB = 'fibub-handoff', STORE = 'files', KEY = 'next';

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function handOff(file: File, to: string) {
  const db = await open();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put({ name: file.name, type: file.type, lastModified: file.lastModified, blob: file }, KEY);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
  location.href = `${to}?from=handoff`;
}

/** The file handed to this page, if any. It is deleted from storage as it is read. */
export async function receive(): Promise<File | null> {
  if (new URLSearchParams(location.search).get('from') !== 'handoff') return null;
  history.replaceState(null, '', location.pathname);
  try {
    const db = await open();
    const item = await new Promise<any>((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      const st = tx.objectStore(STORE);
      const g = st.get(KEY);
      g.onsuccess = () => { st.delete(KEY); res(g.result); };
      tx.onerror = () => rej(tx.error);
    });
    db.close();
    return item ? new File([item.blob], item.name, { type: item.type, lastModified: item.lastModified }) : null;
  } catch {
    return null;
  }
}
