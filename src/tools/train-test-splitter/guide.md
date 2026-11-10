---
name: Train-test split
num: 571
shelf: science
code: T399
section: data-science-and-machine-learning
title: "Train-test split"
summary: "Split a CSV or Excel table into training, test and validation sets: random, stratified by class, grouped (whole patients or sites together) or by time, or give every row a k-fold number. Set a seed, check the class balance and download each part as CSV. Nothing is uploaded."
status: live
ads: false
order: 571
icon: scissors
works: offline
updated: 2026-11-09
related: [csv-profiler, confusion-matrix, sample-size, small-model-trainer, embedding-visualiser, sql-playground, randomisation-list, bootstrap-permutation]
sources:
  - "Row counts follow scikit-learn's rules (train_test_split, StratifiedShuffleSplit, GroupShuffleSplit, KFold, StratifiedKFold, GroupKFold); checked against scikit-learn 1.9. The random generator is fibub's own (mulberry32), so the rows picked differ from scikit-learn's."
  - "The example of 40 fruit from 8 farms is made up for this tool."
flow:
  - { icon: file, label: "Open data" }
  - { icon: sliders, label: "Method" }
  - { icon: scissors, label: "Split" }
  - { icon: download, label: "CSV files" }
---

## What it does

To know how well a model will do on new data, you test it on rows it never saw while training. This tool makes that split for any table, in your browser, and shows that it is fair:

- **Random:** rows are shuffled with a seed and a share is set aside for testing (and, if you like, validation).
- **Stratified:** every class keeps the same share in each part, so a rare class is not left out of the test set by bad luck.
- **Grouped:** all rows from one group (a patient, a farm, a school) go to the same part, so the test really is on unseen groups.
- **Time-ordered:** the latest rows are the test set, so a forecasting model never trains on the future.
- **k-fold:** every row gets a fold number for cross-validation: shuffled, stratified, grouped or in order (blocks).

The **class balance** table shows how many rows of each class are in each part, and you can download the training, test and validation rows as CSV files, or the whole table with a split or fold column.

Check the table for gaps first with the [[csv-profiler|CSV profiler]], then train on the split with the [[small-model-trainer|small model trainer]].

## How to use it

1. Paste a table or open a CSV, TSV or Excel file (first row = column names).
2. Choose the method, and the class, group or time column it needs. The class column is also used for the balance table.
3. Set the **test** and **validation** percentages (validation 0 for a simple train/test split) or the number of folds **k**.
4. Keep the **seed** to get the same split again, or change it for a different one.
5. Download the parts.

## How the numbers are chosen

The tool follows scikit-learn's rules: the test set gets ceil(test share × rows) rows, so 20 % of 41 rows is 9. A stratified split shares the training rows out over the classes in proportion, rounding down, then gives the leftover rows to the classes with the largest remainders; the test rows come from what is left. The validation part, if any, is then taken from the training rows the same way. A grouped split takes ceil(share × groups) whole groups. Stratified k-fold deals each class round the folds; grouped k-fold puts the biggest groups first, each into the fold with the fewest rows. Row counts match scikit-learn exactly; which rows are picked differs, because the random generator is different.

## Worked example

The made-up example has 40 fruit (24 apples, 7 oranges, 9 pears) from 8 farms. A stratified split with 20 % test gives 32 training and 8 test rows: 5 apples, 1 orange and 2 pears in the test set, the same counts scikit-learn's train_test_split gives with stratify. Switch to **Grouped** on the farm column and 2 of the 8 farms go to the test set. Choose **k-fold**, stratified, with k = 5 and each fold has 8 rows with 4 or 5 apples, 1 or 2 oranges and 1 or 2 pears.

## Tips

- Split before you scale, impute or select features, and fit those steps on the training rows only, or test scores will be too optimistic.
- With repeated measurements of the same subject, always split by group.
- Rows with a missing class are kept as their own class, "(missing)".

## Frequently asked questions

**Will I get the same split as scikit-learn with the same seed?** The same number of rows per class and part, but not the same rows: the random generators differ.

**Is my data uploaded?** No. It is split in your browser, and nothing is stored or sent anywhere.
