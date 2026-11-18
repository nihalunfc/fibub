// A tiny Standard MIDI File (format 0) writer. Plain TypeScript, no DOM. Reusable by any tool that exports notes.
export type MidiNote = { note: number; start: number; dur: number; vel?: number; channel?: number };
export type MidiOptions = { bpm: number; ppq?: number; name?: string; timeSig?: [number, number] };

/** Variable-length quantity as used for MIDI delta times. */
export function vlq(n: number): number[] {
  n = Math.max(0, Math.round(n));
  const out = [n & 0x7f];
  while ((n >>= 7)) out.unshift((n & 0x7f) | 0x80);
  return out;
}
const u32 = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const u16 = (n: number) => [(n >>> 8) & 255, n & 255];
const ascii = (s: string) => Array.from(s, (c) => c.charCodeAt(0) & 127);

/** Write notes (start and dur in beats) as a one-track .mid file. */
export function writeMidi(notes: MidiNote[], o: MidiOptions): Uint8Array {
  const ppq = o.ppq ?? 480, [num, den] = o.timeSig ?? [4, 4];
  const ev: { t: number; order: number; bytes: number[] }[] = [];
  for (const n of notes) {
    const ch = (n.channel ?? 0) & 15, on = Math.round(n.start * ppq), off = on + Math.max(1, Math.round(n.dur * ppq));
    const note = Math.max(0, Math.min(127, Math.round(n.note))), vel = Math.max(1, Math.min(127, Math.round(n.vel ?? 90)));
    ev.push({ t: on, order: 1, bytes: [0x90 | ch, note, vel] }, { t: off, order: 0, bytes: [0x80 | ch, note, 0] });
  }
  ev.sort((a, b) => a.t - b.t || a.order - b.order);
  const track: number[] = [];
  if (o.name) { const nm = ascii(o.name); track.push(0, 0xff, 0x03, ...vlq(nm.length), ...nm); }
  const mpqn = Math.round(60000000 / o.bpm);
  track.push(0, 0xff, 0x51, 3, (mpqn >>> 16) & 255, (mpqn >>> 8) & 255, mpqn & 255);
  track.push(0, 0xff, 0x58, 4, num, Math.round(Math.log2(den)), 24, 8);
  let last = 0;
  for (const e of ev) { track.push(...vlq(e.t - last), ...e.bytes); last = e.t; }
  track.push(0, 0xff, 0x2f, 0);
  return new Uint8Array([...ascii('MThd'), ...u32(6), ...u16(0), ...u16(1), ...u16(ppq), ...ascii('MTrk'), ...u32(track.length), ...track]);
}
