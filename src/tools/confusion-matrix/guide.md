---
name: Confusion matrix and metrics calculator
num: 570
shelf: science
section: data-science-and-machine-learning
title: "Confusion matrix calculator: accuracy, precision, recall, F1, specificity, MCC and Cohen's kappa with confidence intervals"
summary: "Type four counts, paste a confusion matrix, or open a file of actual and predicted classes. Get accuracy, precision, recall, F1 (macro, micro and weighted), specificity, balanced accuracy, MCC and Cohen's kappa, with 95 % confidence intervals. Matches scikit-learn. Nothing is uploaded."
status: live
ads: false
order: 570
icon: target
works: offline
updated: 2026-11-09
related: [small-model-trainer, train-test-splitter, csv-profiler, reliability-analysis, sample-size, roc-curve, diagnostic-test-calculator, embedding-visualiser, signal-detection-calculator]
sources:
  - "Metric definitions as in scikit-learn (precision_recall_fscore_support, balanced_accuracy_score, matthews_corrcoef, cohen_kappa_score); Wilson score intervals; kappa's large-sample standard error from Fleiss, Cohen and Everitt (1969). Checked against scikit-learn 1.9 and statsmodels 0.14."
  - "The example counts, matrix and spam/ham table are made up for this tool."
flow:
  - { icon: table, label: "Counts" }
  - { icon: target, label: "Matrix" }
  - { icon: sigma, label: "Metrics" }
  - { icon: download, label: "Report" }
---

## What it does

A classifier, a diagnostic test or a human rater sorts cases into classes. The **confusion matrix** counts how often each actual class was given each predicted class, and every common quality measure comes from it. This calculator builds the matrix and works out the measures, for two classes or many.

- **Overall:** accuracy with its 95 % interval, balanced accuracy, Cohen's kappa with its 95 % interval, and the Matthews correlation coefficient (MCC).
- **Per class:** how many cases were actual and predicted, precision, recall and specificity with Wilson 95 % intervals, and F1.
- **Averages:** macro, weighted and micro precision, recall and F1.
- **Two classes:** sensitivity, specificity, positive and negative predictive value (with intervals), false positive and false negative rates, prevalence, F1, Youden's J and the likelihood ratios.

Train a model to test with the [[small-model-trainer|small model trainer]], and see how the threshold changes things with the [[roc-curve|ROC curve tool]].

## How to use it

1. Choose how to start:
   - **Four counts** for a two-class problem: true positives, false negatives, false positives and true negatives, with names for the two classes.
   - **A matrix of counts**: one row per actual class, one column per predicted class. Class names in the first row and first column are optional.
   - **Columns of actual and predicted classes**: paste a table or open a CSV or Excel file, then pick the two columns. Rows with a missing class are left out and counted.
2. With two classes from a matrix or columns, pick the **positive class** (the one you are trying to find).
3. Download the metrics as CSV, or the report as an image, PDF or Word file.

Classes are put in the same order as scikit-learn: numbers by value, text alphabetically.

## Worked example

The four-count example is a made-up screening test on 100 people: TP 42, FN 8, FP 6, TN 44. The page shows accuracy 86.0 % (95 % CI 77.9 to 91.5 %), sensitivity 84.0 % (71.5 to 91.7 %), specificity 88.0 % (76.2 to 94.4 %), precision 87.5 %, negative predictive value 84.6 %, kappa 0.720 (0.584 to 0.856), MCC 0.721 and a positive likelihood ratio of 7.000.

The matrix example has three made-up classes (cat, dog, rabbit) and 130 cases. Accuracy is 80.0 % (72.3 to 86.0 %), kappa 0.694, MCC 0.694. Dog has the weakest recall (0.740: 8 dogs called cats, 5 called rabbits), so macro F1 is 0.800 and weighted F1 0.799.

## Which measure should I use?

- **Accuracy** is easy to explain but misleading when one class is rare: a test that always says "healthy" is 99 % accurate if 1 % are ill.
- **Balanced accuracy**, **macro F1** and **MCC** treat every class fairly, so they are better for unbalanced data. MCC is high only when all four cells of a two-class table are good.
- **Kappa** compares agreement with what chance alone would give.
- **Precision** answers "when it says positive, how often is it right?"; **recall** (sensitivity) answers "of the real positives, how many did it find?".

## Confidence intervals

Proportions (accuracy, precision, recall, specificity, predictive values) use the Wilson score interval, which behaves well near 0 % and 100 % and with small counts. Kappa uses the large-sample standard error of Fleiss, Cohen and Everitt. F1, MCC and balanced accuracy have no single standard interval, so none is shown; bootstrap your predictions if you need one.

## Frequently asked questions

**Why is precision 0 for a class?** The class was never predicted, so precision is 0 divided by 0. Like scikit-learn, the tool counts it as 0, which also lowers the macro average.

**Does micro F1 differ from accuracy?** Not when every class is included: for single-label problems micro precision, recall and F1 all equal accuracy.

**Is my data uploaded?** No. Everything is worked out in your browser and nothing is stored.
