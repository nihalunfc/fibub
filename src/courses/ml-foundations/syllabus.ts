// From a straight line to an LLM (nihal, 2026-11-21): the junior data analytics and machine learning course,
// the first step before the data courses on nihalsulaiman.com. Plan: /mnt/project-files/ml-foundations-course/plan.md
// (11 modules, 66 lessons, built over 5 PRs). It fills the "How AI works" slot on /learn/courses/.
//
// How it works: the same engine as Offline AI (src/courses/types.ts). A lesson goes live when
// src/courses/ml-foundations/<slug>.md exists. Figures and simulations sit in the text as <!--fig:name-->
// (src/courses/ml-foundations/figures/index.ts); maths is LaTeX in `$...$` or ```math blocks, turned into
// MathML at build time (src/lib/mathml.mjs). The sums behind every simulation live in src/lib/ml/ and are
// checked by tests/ml.mjs.
import type { CourseSyllabus } from '../types';

export const ML_FOUNDATIONS: CourseSyllabus = {
  id: 'ml-foundations',
  name: 'ML foundations',
  title: 'From a straight line to an LLM: data analytics and machine learning foundations',
  text: 'How machines learn from data, from drawing the best straight line to what a large language model really is. Linear and logistic regression, decision trees, random forests, boosting, clustering, neural networks and transformers, each with pictures, simulations you can play with and the maths worked by hand.',
  audience: 'For students from Class 11 up, career changers and anyone starting in data. School maths is enough: Module 1 teaches the rest.',
  updated: '2026-11-21',
  footnote: 'Numbers in the examples are made up to show the idea unless a source is given. Simulations run in your browser; nothing you type is sent anywhere.',
  parts: [
    { name: 'Part A: Data and the maths you need', modules: [
      { n: 1, name: 'Data, models and the maths you need', lessons: [
        ['1.1', 'what-is-machine-learning', 'What data analytics and machine learning are'],
        ['1.2', 'features-labels-models', 'Data, features, labels and models'],
        ['1.3', 'functions-and-slopes', 'Functions, slopes and straight lines'],
        ['1.4', 'vectors-dot-product', 'Vectors and the dot product'],
        ['1.5', 'derivatives-gradient', 'Derivatives and the gradient: which way is downhill'],
        ['1.6', 'probability-basics', 'Probability, mean, variance and the normal curve'],
        ['1.7', 'ml-workflow', 'The machine learning workflow'],
      ] },
      { n: 2, name: 'Looking at data before modelling', lessons: [
        ['2.1', 'types-of-data', 'Types of data: numbers, categories, text and time'],
        ['2.2', 'honest-charts', 'Summaries and charts that tell the truth'],
        ['2.3', 'correlation-causation', 'Correlation is not causation'],
        ['2.4', 'cleaning-data', 'Cleaning: missing values, outliers and scaling'],
        ['2.5', 'train-test-split', 'Train, validation and test sets'],
      ] },
    ] },
    { name: 'Part B: Models that draw lines', modules: [
      { n: 3, name: 'Linear regression: the first model', lessons: [
        ['3.1', 'linear-model', 'What a linear model is'],
        ['3.2', 'least-squares', 'Least squares: why we square the errors'],
        ['3.3', 'gradient-descent', 'Fitting by gradient descent'],
        ['3.4', 'multiple-regression', 'Many inputs: multiple regression and matrices'],
        ['3.5', 'measuring-fit', 'Measuring fit: residuals, RMSE and R²'],
        ['3.6', 'polynomial-features', 'Curves with a linear model: polynomial features'],
        ['3.7', 'overfitting', 'Overfitting and underfitting'],
        ['3.8', 'regularisation', 'Regularisation: ridge and lasso'],
      ] },
      { n: 4, name: 'Classification and logistic regression', lessons: [
        ['4.1', 'classification', 'Predicting a category'],
        ['4.2', 'sigmoid-odds', 'The sigmoid and odds: from a line to a probability'],
        ['4.3', 'log-loss', 'Log-loss: how logistic regression learns'],
        ['4.4', 'decision-boundaries', 'Decision boundaries'],
        ['4.5', 'confusion-matrix', 'Accuracy is not enough: precision, recall and F1'],
        ['4.6', 'roc-auc', 'Thresholds, ROC curves and AUC'],
        ['4.7', 'k-nearest-neighbours', 'k-nearest neighbours'],
        ['4.8', 'naive-bayes', 'Naive Bayes: counting words to catch spam'],
      ] },
    ] },
    { name: 'Part C: Trees and forests', modules: [
      { n: 5, name: 'Decision trees', lessons: [
        ['5.1', 'how-trees-decide', 'Twenty questions: how a tree decides'],
        ['5.2', 'gini-entropy', 'Purity: Gini impurity and entropy'],
        ['5.3', 'information-gain', 'Information gain: choosing the best split'],
        ['5.4', 'regression-trees', 'Trees that predict numbers'],
        ['5.5', 'pruning', 'Deep trees overfit: depth limits and pruning'],
      ] },
      { n: 6, name: 'Ensembles: random forests and boosting', lessons: [
        ['6.1', 'wisdom-of-crowds', 'Wisdom of crowds: why many models beat one'],
        ['6.2', 'bagging-bootstrap', 'Bagging and bootstrap samples'],
        ['6.3', 'random-forests', 'Random forests'],
        ['6.4', 'feature-importance', 'Feature importance, and what it does not tell you'],
        ['6.5', 'boosting', 'Boosting: each model fixes the last one\'s mistakes'],
        ['6.6', 'gradient-boosting', 'Gradient boosting'],
      ] },
      { n: 7, name: 'Judging models honestly', lessons: [
        ['7.1', 'bias-variance', 'Bias and variance'],
        ['7.2', 'cross-validation', 'Cross-validation'],
        ['7.3', 'hyperparameters', 'Hyperparameters and tuning'],
        ['7.4', 'data-leakage', 'Data leakage: the most common mistake'],
        ['7.5', 'fairness-explaining', 'Fairness and explaining predictions'],
      ] },
    ] },
    { name: 'Part D: Patterns, networks and language', modules: [
      { n: 8, name: 'Finding patterns without labels', lessons: [
        ['8.1', 'k-means', 'Clustering with k-means'],
        ['8.2', 'choosing-k', 'Choosing k: elbow and silhouette'],
        ['8.3', 'hierarchical-clustering', 'Hierarchical clustering and dendrograms'],
        ['8.4', 'pca', 'PCA: squashing many columns into two'],
        ['8.5', 'anomaly-detection', 'Finding the odd one out: anomaly detection'],
      ] },
      { n: 9, name: 'Neural networks', lessons: [
        ['9.1', 'perceptron', 'The perceptron: a neuron as a weighted vote'],
        ['9.2', 'activation-functions', 'Activation functions'],
        ['9.3', 'layers', 'Layers: why stacking neurons can draw any shape'],
        ['9.4', 'backpropagation', 'Backpropagation: the chain rule, step by step'],
        ['9.5', 'training-networks', 'Training: loss, batches, epochs and learning rate'],
        ['9.6', 'convolution', 'Images: convolution and filters'],
        ['9.7', 'sequences', 'Sequences: why order matters'],
      ] },
      { n: 10, name: 'From words to an LLM', lessons: [
        ['10.1', 'text-as-numbers', 'Text as numbers: bag of words and TF-IDF'],
        ['10.2', 'embeddings', 'Embeddings: meaning as distance'],
        ['10.3', 'next-word', 'Predicting the next word'],
        ['10.4', 'attention', 'Attention: each word looks at the others'],
        ['10.5', 'transformer-block', 'The transformer block'],
        ['10.6', 'training-an-llm', 'How an LLM is trained'],
        ['10.7', 'what-is-an-llm', 'What an LLM is, and what it is not'],
      ] },
      { n: 11, name: 'Capstone and next steps', lessons: [
        ['11.1', 'capstone', 'Capstone: predict shop sales from a CSV'],
        ['11.2', 'which-model-when', 'Which model when'],
        ['11.3', 'next-steps', 'Where to go next'],
      ] },
    ] },
  ],
};
