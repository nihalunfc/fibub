// Device test kit, the browser part: ask for the microphone or camera with plain-English errors, list devices,
// stop streams, and say which device APIs this browser has. Nothing is recorded or sent anywhere: streams stay in
// the page and are stopped when the visitor presses Stop or leaves.

export type MediaKind = 'audioinput' | 'videoinput' | 'audiooutput';

/** Turn a getUserMedia error into one plain sentence the visitor can act on. */
export function mediaError(e: unknown, what: 'microphone' | 'camera'): string {
  const n = (e as { name?: string })?.name || '';
  if (!window.isSecureContext) return `The ${what} only works on a secure (https) page.`;
  if (n === 'NotAllowedError' || n === 'SecurityError') return `The browser was not allowed to use the ${what}. Press the lock or camera icon by the address bar, allow the ${what}, then try again. On a phone, also check the browser has ${what} access in the system settings.`;
  if (n === 'NotFoundError' || n === 'OverconstrainedError') return `No ${what} was found. Plug one in, or check it is switched on and not disabled in your system settings.`;
  if (n === 'NotReadableError' || n === 'AbortError') return `The ${what} is there but another app is using it (a video call, recorder or another tab). Close that app and try again.`;
  return `The ${what} could not be opened (${n || 'unknown error'}).`;
}

/** True when the browser can ask for this device at all. */
export const canAskMedia = () => !!navigator.mediaDevices?.getUserMedia;

/** Open the microphone. Processing (echo cancellation, noise suppression, auto gain) is off by default so you hear the raw mic. */
export async function openMic(deviceId = '', processing = false): Promise<MediaStream> {
  const audio: MediaTrackConstraints = { echoCancellation: processing, noiseSuppression: processing, autoGainControl: processing };
  if (deviceId) audio.deviceId = { exact: deviceId };
  return navigator.mediaDevices.getUserMedia({ audio });
}

/** Open a camera, asking for the highest resolution it has (up to 4K) unless a size is given. */
export async function openCam(deviceId = '', facing: '' | 'user' | 'environment' = '', w = 3840, h = 2160): Promise<MediaStream> {
  const video: MediaTrackConstraints = { width: { ideal: w }, height: { ideal: h }, frameRate: { ideal: 60 } };
  if (deviceId) video.deviceId = { exact: deviceId };
  else if (facing) video.facingMode = facing;
  return navigator.mediaDevices.getUserMedia({ video });
}

export const stopStream = (s: MediaStream | null | undefined) => s?.getTracks().forEach((t) => t.stop());

/** Devices of one kind. Names only show after the visitor has allowed access once (a browser privacy rule). */
export async function listDevices(kind: MediaKind): Promise<MediaDeviceInfo[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  return (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === kind);
}

/** Fill a <select> with devices, keeping the current choice when it is still there. */
export async function fillDeviceSelect(sel: HTMLSelectElement, kind: MediaKind, label: string) {
  const list = await listDevices(kind), keep = sel.value;
  sel.innerHTML = '';
  if (!list.length) { sel.append(new Option(`Default ${label}`, '')); return list; }
  list.forEach((d, i) => sel.append(new Option(d.label || `${label} ${i + 1}`, d.deviceId)));
  if (list.some((d) => d.deviceId === keep)) sel.value = keep;
  return list;
}

/** Re-list devices when one is plugged in or out. */
export const onDeviceChange = (fn: () => void) => navigator.mediaDevices?.addEventListener?.('devicechange', fn);

/** Which device APIs this browser offers (a 'yes' is not proof the hardware exists). */
export function support() {
  const n = navigator as Navigator & { getBattery?: unknown; requestMIDIAccess?: unknown; hid?: unknown; usb?: unknown; serial?: unknown; bluetooth?: unknown; keyboard?: unknown; deviceMemory?: number };
  return {
    secure: window.isSecureContext,
    mic: !!n.mediaDevices?.getUserMedia,
    camera: !!n.mediaDevices?.getUserMedia,
    speakerChoice: 'setSinkId' in HTMLMediaElement.prototype,
    gamepad: typeof n.getGamepads === 'function',
    vibrate: typeof n.vibrate === 'function',
    motion: typeof DeviceMotionEvent !== 'undefined',
    orientation: typeof DeviceOrientationEvent !== 'undefined',
    battery: typeof n.getBattery === 'function',
    midi: typeof n.requestMIDIAccess === 'function',
    touch: n.maxTouchPoints > 0,
    pointer: typeof PointerEvent !== 'undefined',
    keyboardMap: !!(n.keyboard as { getLayoutMap?: unknown } | undefined)?.getLayoutMap,
    wakeLock: 'wakeLock' in n,
    fullscreen: !!document.documentElement.requestFullscreen,
  };
}

/** Plain browser and OS names from the user agent (shown to the visitor only; never sent). */
export function browserName(ua = navigator.userAgent): { browser: string; os: string } {
  const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iPhone or iPad (iOS)' : /Windows/.test(ua) ? 'Windows' : /CrOS/.test(ua) ? 'ChromeOS' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /Firefox\/|FxiOS/.test(ua) ? 'Firefox' : /Chrome\/|CriOS/.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Unknown';
  return { browser, os };
}

/** iPhone and iPad ask for motion and orientation permission from a tap. Newer Chrome also has requestPermission but may
 *  answer 'prompt' or 'denied' with no sensors present, so only an iOS 'denied' counts as refused; elsewhere we just listen. */
export async function askMotion(): Promise<'granted' | 'denied' | 'none'> {
  const DM = (window as unknown as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent;
  const DO = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
  try {
    const a = DM?.requestPermission ? await DM.requestPermission() : 'granted';
    const b = DO?.requestPermission ? await DO.requestPermission() : 'granted';
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    return !ios || (a === 'granted' && b === 'granted') ? 'granted' : 'denied';
  } catch { return /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'denied' : DM || DO ? 'granted' : 'none'; }
}

/** Keep the screen on while a test runs, where the browser allows it. Returns a release function. */
export async function keepAwake(): Promise<() => void> {
  try {
    const l = await (navigator as Navigator & { wakeLock?: { request(t: 'screen'): Promise<{ release(): Promise<void> }> } }).wakeLock?.request('screen');
    return () => { l?.release().catch(() => {}); };
  } catch { return () => {}; }
}

/** Set a status line with a colour for meaning: '', 'good', 'warn' or 'bad'. */
export function say(el: HTMLElement, text: string, tone: '' | 'good' | 'warn' | 'bad' = '') {
  el.textContent = text; el.dataset.tone = tone;
}
