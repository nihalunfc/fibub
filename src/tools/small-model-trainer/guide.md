---
name: Small model trainer
num: 569
shelf: science
section: data-science-and-machine-learning
title: "Train a decision tree, logistic regression, k-NN or k-means model on your CSV, in your browser"
summary: "Train a small machine-learning model on a CSV or Excel table: a decision tree (drawn for you), logistic regression, k-nearest neighbours or k-means clustering with an elbow plot. See train and test accuracy, a confusion matrix and per-class scores. Matches scikit-learn. Nothing is uploaded."
status: live
ads: false
order: 569
icon: chart
works: offline
updated: 2026-11-09
related: [csv-profiler, train-test-splitter, confusion-matrix, embedding-visualiser, regression-workbench, neural-network-toys, roc-curve, sql-playground]
sources:
  - "Algorithms as defined in scikit-learn (DecisionTreeClassifier, LogisticRegression, KNeighborsClassifier, KMeans with greedy k-means++, silhouette_score, StandardScaler); checked against scikit-learn 1.9 on the example and two make_classification data sets."
  - "The example of 150 seedlings of three varieties is made up for this tool."
flow:
  - { icon: file, label: "Open data" }
  - { icon: sliders, label: "Model" }
  - { icon: chart, label: "Train" }
  - { icon: target, label: "Test" }
---

## What it does

Try machine learning on your own table without installing anything. Open a CSV or Excel file, pick the column to predict, and train one of four classic models in a background worker, so the page stays responsive:

- **Decision tree** (CART): a tree of yes/no questions, split by Gini impurity or entropy, with a maximum depth and a minimum number of rows per leaf. The tree is drawn for you, with each feature's importance.
- **Logistic regression** with L2 regularisation (strength set by C): two classes or more (softmax). The weights are listed per class.
- **k-nearest neighbours**: Euclidean or Manhattan distance, equal or distance-weighted votes, with a chart of test accuracy for k from 1 to 30.
- **k-means clustering**: no class needed. k-means++ starts with a seed, the best of 10 runs, an elbow plot of inertia for k = 1 to 10, the silhouette score, the cluster centres and a scatter plot of the clusters on any two features.

For the three classifiers the rows are split into training and test sets (stratified by class, with a seed), and you get training and test accuracy, the test accuracy's 95 % interval, balanced accuracy, macro F1, Cohen's kappa, the test confusion matrix and precision, recall and F1 per class.

Prepare fair training and test sets with the [[train-test-splitter|train/test splitter]], and judge the predictions with the [[confusion-matrix|confusion matrix tool]].

## How to use it

1. Paste a table or open a CSV, TSV or Excel file (up to 20,000 rows and 40 columns).
2. Choose the model and the **class to predict**.
3. Tick the **feature** columns to use. Text columns become one 0/1 column per value; ID columns are left out by default.
4. Set the test share and the seed, and the model's own settings. Leave **scale features** on for logistic regression, k-NN and k-means: it turns every feature into z-scores (using the training rows; all rows for k-means), so a feature measured in large numbers does not dominate.
5. Download the table with the predictions (or cluster numbers) as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up example has 150 seedlings of three varieties (Amber, Birch and Cedar), with leaf length, leaf width, height and soil. With seed 42, 112 rows train and 38 test.

- A **decision tree** of depth 3 has 7 leaves and splits first on leaf length (57.8 mm). Test accuracy is 78.9 % against 92.0 % on the training rows: a sign of overfitting, which the page points out.
- **Logistic regression** with C = 1 scores 94.7 % on the test rows (89.3 % training). Leaf length has the largest weights: −1.921 for Amber and 1.481 for Cedar.
- **k-NN** with k = 5 scores 84.2 %.
- **k-means** with k = 3 on all five features gives clusters of 41, 64 and 45 rows, inertia 282.8 and silhouette 0.419. Untick the soil columns and the clusters follow the varieties more closely.

## How it was checked

Each model follows scikit-learn's definitions, and was compared with scikit-learn 1.9 on the example and two generated data sets: tree splits, thresholds, feature importances and predictions; logistic regression weights (to six decimal places); k-NN predictions for 12 settings; k-means inertia, silhouette and clusters. Where two splits of a tree are exactly as good, scikit-learn picks one at random and this tool takes the first feature, so a deep tree can differ from scikit-learn's while being just as good.

## What it does not do

No regression (predicting a number), no hyper-parameter search or cross-validation, no neural networks, and no saving of the model. For honest scores, set the settings by cross-validation on the training rows (see the train/test splitter) and use the test rows once.

## Frequently asked questions

**Is my data uploaded?** No. The model is trained in your browser, in a worker, and nothing is stored or sent anywhere.

**Why is training accuracy higher than test accuracy?** The model has learnt some noise of the training rows. Lower the tree depth, lower C, or raise k.
