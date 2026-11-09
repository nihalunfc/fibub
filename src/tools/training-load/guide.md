---
name: Training load tracker (ACWR, TRIMP, monotony)
num: 488
shelf: science
section: exercise-and-sport-science
title: "Training load calculator: session RPE, TRIMP, acute:chronic workload ratio (ACWR), monotony and strain"
summary: "Log training sessions and get session RPE load, Banister and Edwards TRIMP, the acute:chronic workload ratio (rolling 7/28 days and EWMA), and weekly monotony and strain, with charts. Import and export CSV; kept only in your browser if you choose."
status: live
ads: false
order: 28
icon: chart
works: offline
updated: 2026-11-09
related: [heart-rate-zones, vo2max-estimator, jump-height, plot-maker, trend-analyser]
sources:
  - "Foster C et al. (2001). A new approach to monitoring exercise training. J Strength Cond Res 15: 109–115 (session RPE)."
  - "Foster C (1998). Monitoring training in athletes with reference to overtraining syndrome. Med Sci Sports Exerc 30: 1164–1168 (monotony and strain)."
  - "Morton RH, Fitz-Clarke JR, Banister EW (1990). Modeling human performance in running. J Appl Physiol 69: 1171–1177; Banister EW (1991), Modeling elite athletic performance, in Physiological Testing of the High-Performance Athlete, Human Kinetics (TRIMP)."
  - "Edwards S (1993). The Heart Rate Monitor Book. Sacramento: Fleet Feet Press (zone TRIMP)."
  - "Hulin BT et al. (2014). Spikes in acute workload are associated with increased injury risk in elite cricket fast bowlers. Br J Sports Med 48: 708–712; Gabbett TJ (2016). The training–injury prevention paradox. Br J Sports Med 50: 273–280 (rolling ACWR)."
  - "Williams S et al. (2017). Better way to determine the acute:chronic workload ratio? Br J Sports Med 51: 209–210 (EWMA)."
  - "Example log: made-up numbers."
flow:
  - { icon: pencil, label: "Log" }
  - { icon: calculator, label: "Load" }
  - { icon: chart, label: "ACWR" }
  - { icon: download, label: "CSV" }
---

## What it does

Coaches and sport scientists track **training load** to see whether an athlete is building up steadily or doing too much too soon. This page takes a simple training log and works out the common load measures: **session RPE**, **Banister TRIMP** and **Edwards TRIMP** for each session, the **acute:chronic workload ratio (ACWR)** day by day, and Foster's weekly **monotony** and **strain**. It draws the daily load with its averages and the ratio over time.

Your log stays on your device. Nothing is sent anywhere. It is not even kept in the browser unless you tick "Remember my log on this device".

## How to use it

1. Choose the **load to track** and, for Banister TRIMP, type **resting** and **maximum heart rate** and pick the **sex** weighting.
2. Type or paste your log, one session per line: date (YYYY-MM-DD), minutes, RPE (0–10), average heart rate, minutes in heart rate zones 1 to 5, and a note. Cells you do not have can be left empty. **Import a CSV** opens a spreadsheet export, and **Add a session** adds one line from a small form.
3. Read the latest ratio, the charts and the weekly table.
4. **Export log (CSV)** saves your sessions; **Download daily results (CSV)** saves the day-by-day numbers. **Clear** empties the log and removes any copy kept in this browser.

## The measures

- **Session RPE** (Foster and colleagues, 2001): RPE on the 0–10 scale × minutes.
- **Banister TRIMP** (Morton, Fitz-Clarke and Banister, 1990): minutes × x × k × e^(b·x), where x is the fraction of heart rate reserve, (average − resting) / (maximum − resting); k = 0.64 and b = 1.92 for men, 0.86 and 1.67 for women.
- **Edwards TRIMP** (Edwards, 1993): minutes in the zones 50–60, 60–70, 70–80, 80–90 and 90–100 % of maximum heart rate, weighted 1 to 5.
- **Rolling ACWR** (Hulin and colleagues, 2014; Gabbett, 2016): the last 7 days' load ÷ the weekly average of the last 28 days (both including today; days without a session count as 0). It starts once there are 28 days of log.
- **EWMA ratio** (Williams and colleagues, 2017): exponentially weighted averages with λ = 2/(N + 1), N = 7 and 28 days, started at the first day's load; acute ÷ chronic.
- **Monotony and strain** (Foster, 1998), for Monday-to-Sunday weeks: monotony = mean daily load ÷ its standard deviation (n − 1, rest days as 0); strain = weekly load × monotony.

## Worked example

The example is a made-up 7-week running log of 35 sessions, ending with a heavy week. With session RPE, the last 7 days add up to 1878 units against a chronic weekly mean of 1328, so the page shows **ACWR 1.41 (rolling) · 1.19 (EWMA)** on 2026-10-25. The last week has a monotony of 1.01 and a strain of 1897. These numbers match pandas (rolling sums, ewm with adjust=False, and weekly standard deviations) to many decimals, for all three load types.

## Tips

- Pick one load measure and stick with it: the units are arbitrary and do not mix.
- Ask for RPE about 30 minutes after the session, about the whole session.
- High monotony means every day is alike; easy days lower it.

## Frequently asked questions

**Is there a "safe" ratio?** Researchers still debate how well the ratio predicts injury, so this page draws no danger zones. Treat it as a picture of how quickly load changes, and talk to a qualified coach or clinician.

**Where is my log kept?** Only in this page while it is open, unless you tick "Remember my log on this device". Then it is kept in this browser's local storage, never sent anywhere, and removed when you untick the box or press Clear.
