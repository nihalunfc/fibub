---
name: Cryovial inventory and freezing helper
num: 193
shelf: science
section: cell-biology-and-cell-culture
title: "Cryovial inventory and box map: track frozen cell stocks, thaw log and freezing medium calculator"
summary: "Keep track of frozen cell vials in your freezers, racks and 9 × 9 or 10 × 10 boxes: line, passage, date frozen, cells per vial, medium and who froze them. Search and filter, mark vials thawed with a thaw log, print a box map, save and open CSV or JSON files, and work out the cells and freezing medium (DMSO % editable) for a new batch. Nothing leaves your device."
status: live
ads: false
order: 15
icon: table
works: offline
updated: 2026-11-09
related: [cell-doubling-time, hemocytometer, media-recipe-scaler, plate-layout, solution-calculator]
sources:
  - "Box positions (row letter, column number), the inventory, search, thaw log and file formats are designed and written by fibub."
  - "The freezing helper is plain arithmetic (cells = vials × cells per vial; medium = vials × volume × (1 + extra); each part = its percentage of the medium; cooling time = temperature drop ÷ rate), written by fibub. Checked in the tests against an independent Python script on the worked example and five random batches; the CSV export was read back with Python's csv module and a CSV written by Python's csv.writer is read by the page."
  - "The starting values (10 % DMSO, 20 % serum, 10 % extra, 1 °C per minute, 24 hours before moving to storage, a test thaw after 7 days) are round values chosen by fibub as common lab practice, not taken from any protocol, paper or maker. All are editable."
  - "The example inventory (lines, people, dates) is made up for this tool."
flow:
  - { icon: table, label: "Box map" }
  - { icon: pencil, label: "Add vials" }
  - { icon: search, label: "Find" }
  - { icon: download, label: "Save" }
---

## What it does

A lab's frozen cell stocks are usually spread over several freezers and tanks, in racks of boxes with 81 or 100 places each. This page keeps that list for you, in your browser:

- **Box map.** Every box is drawn as a grid of places, A1 at the top left. Each vial is coloured by its line and shows its passage number. Tap a vial to see its details, edit it, move it or mark it thawed; tap an empty place to add vials from there.
- **Freezers, racks and boxes.** Give each box a freezer (or tank), a rack (or tower or shelf) and a name, and choose **9 × 9** (81 places) or **10 × 10** (100 places).
- **Vials.** Each vial has a cell line or sample name, passage, date frozen, cells per vial, freezing medium, who froze it and a note. Add a batch at once: the vials fill the free places row by row from the place you choose, skipping full ones.
- **Find vials.** Search any word (line, "P12", initials, a note, a box name), filter by freezer and line, and switch between vials in the freezer, thawed vials or all. Matches light up on the box map. Tick several vials and mark them thawed together.
- **Lines.** One row per line: vials left, vials thawed, passages, dates and cells in stock, with a "running low" tag when a line is down to the number you choose.
- **Thaw log.** Every vial marked thawed, newest first, with where it came from, who thawed it and a note. Undo puts a vial back if its place is still free.
- **Freezing helper.** For a new batch, the cells to spin down, the freezing medium to make (DMSO, serum and medium in mL), how much of your suspension to spin, how many vials your cells would fill, how long cooling to −80 °C takes, and the dates for moving the vials to storage and for a test thaw.

## How to use it

1. **Box map.** Press **Start empty**, then **Add a box**. Add as many boxes as you have; pick one from the **Box** list to see it.
2. **Add vials.** Type the line, passage, date frozen, cells per vial, medium and your initials, how many vials and the place to start. Press **Add vials**. Or fill in the freezing helper and press **Add these vials to the box above**.
3. **Find.** Search or filter, then tap a place in the results to jump to that vial. When you take vials out, mark them thawed with the date, your name and a note.
4. **Save.** Press **Save as CSV** (for spreadsheets) or **Save as JSON** (keeps empty boxes too). **Open a file** reads either back, adding to or replacing what is on the page. **Print this box map** prints a grid with every vial's line, passage and date, and a list, to tape inside the freezer door. The **Box map** buttons save the same as an image, PDF or Word file.

If you tick **Keep my inventory in this browser**, everything is saved on this device only, so it is here next time. It is off by default and **Clear all** deletes it.

## Worked example

The page opens with a made-up inventory. **LN2 tank 1 › Rack 3 › Box 1** (9 × 9) holds six vials of Fibro-A at passage 5 (A1 to A6), four at passage 8 (A7 to B1) and five of Clone 3B at passage 12 (C1 to C5), one of which (C3) was thawed on 2026-10-01. The page shows **14 of 81 places used, 67 free**. **−80 °C freezer B › Shelf 2 › Box 7** (10 × 10) shows 7 of 100 places used: eight Line K-9 vials were frozen and the one in A1 was test-thawed on 2026-11-02.

Search **p8** and four vials match (A7, A8, A9 and B1); the rest of the box map fades. The Lines table shows Fibro-A with 10 vials in the freezer, P5–P8, frozen 2026-03-12 to 2026-06-02, 14,000,000 cells in stock; Clone 3B with 4 left and 1 thawed; Line K-9 with 7 left and 1 thawed.

In the freezing helper, 10 vials of 1,000,000 cells in 1 mL each, with 10 % DMSO, 20 % serum and 10 % extra, need **11 mL of freezing medium**: 1.1 mL of DMSO, 2.2 mL of serum and 7.7 mL of medium, and 11,000,000 cells to spin down (10,000,000 go into the vials) at 1,000,000 cells/mL. With a count of 800,000 cells/mL in 20 mL you spin down **13.75 mL** and could freeze 14 vials. Cooling from 20 °C to −80 °C at 1 °C per minute takes **1 h 40 min**. Freezing on 2026-11-09, the dates are 2026-11-10 to move the vials to storage and 2026-11-16 for a test thaw.

## Tips

- Label the vial itself with the line, passage, date and your initials, as well as entering it here; the page is a map, not a replacement for labels.
- Save a CSV or JSON file after every session and keep it with your lab records. Browsers can delete saved site data.
- Keep one box per line or project where you can; a printed map on the freezer door saves time with the lid open.
- Check the DMSO percentage, cell density and cooling method against your own lab's protocol; the starting values here are only round numbers.

## FAQ

**Is my inventory sent anywhere?** No. Everything happens in your browser. Nothing is uploaded, and nothing is saved unless you tick the box.

**Can I share it with my lab?** Save a CSV or JSON file and share the file. Anyone can open it on this page.

**Can I open my old spreadsheet?** Yes, if it has a header row with at least line, position and date frozen columns (dates as YYYY-MM-DD). Rows with a problem are left out and listed by line number.

**What does "extra for pipetting" do?** It makes a little more freezing medium and spins a few more cells, so the last vial is not short.

**Why are thawed vials kept?** So the thaw log shows what was used, when and by whom. Their places in the box are free again.
