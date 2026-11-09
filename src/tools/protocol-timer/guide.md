---
name: Protocol timer
num: 813
shelf: science
section: lab-management
title: "Lab protocol timer: multi-step timers with alarms that keep time in a background tab"
summary: "Type a protocol as named steps with times (block 1 h, wash 5 min × 3 …) and run it as a timer. Run several protocols at once, hear an alarm at the end of each step, get a notification if you allow it, and save your protocols in your browser."
status: live
ads: false
order: 813
icon: clock
works: offline
updated: 2026-11-09
related: [reagent-inventory, equipment-booking, centrifuge-calculator]
sources:
  - "Durations, step lists and the timer logic are written by fibub. The tests replay 120 random runs (pauses, skips, restarts, added and removed time, long gaps) against an independent Python model that counts down every 10 ms, and the alarms and countdowns match."
  - "The example protocols are made up to show the format; use the times from your own method."
  - "Protocols and running timers are saved only in this browser (localStorage). Nothing is uploaded."
flow:
  - { icon: pencil, label: "Steps" }
  - { icon: clock, label: "Timers" }
  - { icon: check, label: "Alarm" }
  - { icon: download, label: "Save" }
---

## What it does

Many bench methods are a string of timed steps: block, wash three times, antibody, wash again; fix, stain, destain; spin, resuspend, incubate. A kitchen timer needs resetting at every step and cannot run two protocols side by side. This page can:

- **Run a whole protocol.** Type each step on its own line as *name, time*. The timer counts down each step in turn and shows which step is next and when the whole protocol will finish.
- **Run several at once.** Start a blot and a gel stain together; each has its own countdown, progress bar, step list and buttons.
- **Ring an alarm.** A short beep at the end of each step (a longer one at the very end), and a notification if you allow them, so you know even when the tab is out of sight.
- **Wait for you, or run on.** With *Start each step by itself* ticked, the next step begins the moment the last one ends (good for incubations that follow each other). Untick it for steps that need your hands: the timer stops at the end of each step, repeats the alarm every 30 seconds for 5 minutes, and shows how long you are over until you tap *Start* for the next step.
- **Keep correct time.** Each timer stores the moment its step started, not a counter that ticks. Browsers slow down pages in background tabs, and phones pause them when the screen is off, but when the page looks again the time left is worked out from the clock, so it is always right. The alarm sounds are booked ahead on the browser's audio clock, which keeps running in a background tab.

## How to use it

1. Pick an example or *New protocol*, give it a name, and type the steps. Times can be "5 min", "90 s", "1.5 h", "1 h 30 min", "5:00" (minutes:seconds) or "1:30:00" (hours:minutes:seconds); a plain number means minutes. The line under the box adds them up, and lines it cannot read are listed.
2. Choose whether each step starts by itself, then tap **Start timer**. Tap it again (with the same or another protocol) to run more timers at once.
3. While a timer runs you can **Pause** and **Resume**, add or take away a minute, **Restart step**, skip to the next step or **Stop**.
4. Tap **Save protocol** to keep it for next time. *Export protocols* writes them to a JSON file you can import on another device or share with a colleague.

Tap **Test the sound** first, and turn your volume up. On a phone, tick **Keep the screen on** (where the browser offers it) for long steps, because phones may hold back sound while locked.

## Worked example

Open *Western blot washes and antibodies (example)*: nine steps, **3 h 30 min in all** (block 1 h, primary 1 h, three 5-minute washes, secondary 1 h, three 5-minute washes), waiting for you between steps. Start it at 10:00 and the first step reads *Step 1 of 9: Block*, 1:00:00, "This step ends at 11:00". Pause at 10:20 for 5 minutes and the block now ends at 11:05.

Now start *Gel staining (example)* (fix 15 min, stain 30 min, destain 20 min, running on by itself) at 10:30. It shows "All done at 11:35 (1 h 5 min left)". If you lock your phone and come back at 11:20, the stain timer says *Step 3 of 3: Destain* with 15 minutes left: the fix and stain alarms fell due at 10:45 and 11:15 while you were away.

## Your data

Protocols, the sound setting and running timers are saved automatically in this browser on this device, so a running timer survives a reload. Nothing is sent to fibub or anyone else, and the page works offline. *Clear all* removes your protocols and stops all timers. Notifications are shown by your own browser.

## FAQ

**Will the alarm sound if I close the tab?** No. A web page cannot make sound once it is closed. Keep it open in any tab (it may be in the background). When you reopen the page, timers that ended while it was closed show as finished.

**How precise is it?** The time shown is always worked out from your device's clock. In a background tab the beep is booked ahead and sounds on time; the on-screen update and notification may come a little late if the browser slows the page down.

**Can I use it for cooking?** Of course: any list of timed steps works.
