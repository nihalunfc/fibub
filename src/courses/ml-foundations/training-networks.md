---
title: 'Training: loss, batches, epochs and learning rate'
seoTitle: 'Training neural networks: batches, epochs, learning rate'
summary: 'Training a network is gradient descent on small batches of rows, epoch after epoch. Change the learning rate and the batch size, watch the training and validation loss, and learn the defences against overfitting.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 1,000 training rows, batch size 50. How many weight updates per epoch?
    choices: ['20', '50', '1,000']
    ans: 0
    why: An epoch is one pass over all rows; each batch of 50 gives one update, so 1,000 / 50 = 20.
  - q: The training loss jumps around and then shoots up to huge values. Most likely cause?
    choices: ['The learning rate is too high', 'Too much data', 'The batch size is too large']
    ans: 0
    why: Steps that are too big overshoot the bottom of the valley and can diverge (Lesson 3.3).
  - q: Training loss keeps falling but validation loss has risen for 20 epochs. What do you do?
    choices: ['Stop, and keep the weights from the epoch with the lowest validation loss', 'Train for longer', 'Raise the learning rate']
    ans: 0
    why: That is early stopping. The network has started to memorise the training rows.
sources:
  - 'Goodfellow, Bengio and Courville (2016), Deep Learning, MIT Press, Chapters 7 (regularisation) and 8 (optimisation) https://www.deeplearningbook.org/'
  - 'Kingma and Ba (2015), Adam: a method for stochastic optimization, International Conference on Learning Representations https://arxiv.org/abs/1412.6980'
  - 'Srivastava, Hinton, Krizhevsky, Sutskever and Salakhutdinov (2014), Dropout: a simple way to prevent neural networks from overfitting, Journal of Machine Learning Research 15, 1929-1958 https://jmlr.org/papers/v15/srivastava14a.html'
---

**Module 9 · about 25 minutes · read first: 3.7, 9.4.** You'll be able to set up a training loop, choose a learning rate and batch size, read training and validation curves, and use the main defences against overfitting.

<div class="bigidea">Training is many small, slightly noisy steps downhill, each from a handful of examples, and you judge progress only on data the steps never see.</div>

## 1. Why this matters

Backpropagation gives the gradient; the training loop decides how to use it. Most failed neural-network projects fail here: a learning rate that is too high, no validation set, or training long past the point where the network starts memorising. The same knobs appear in every deep-learning library and in every report of how a large language model was trained.

## 2. The training loop

1. Shuffle the training rows.
2. Cut them into **mini-batches** (say 32 rows).
3. For each batch: forward pass, loss, backward pass (Lesson 9.4), and one gradient step on every weight.
4. One pass over all batches is an **epoch**. After each epoch, compute the loss on validation data.
5. Repeat for many epochs; keep the weights from the epoch with the best validation loss.

Using a batch instead of all rows is **stochastic gradient descent** (SGD, "stochastic" meaning "with randomness"). Each step's gradient is a rough estimate from a few rows, like judging a whole pot of soup by one spoonful. But you get many steps per epoch, and the noise even helps escape poor spots.

### Watch it happen: one epoch

<div class="steps">
<div class="step"><p><b>Shuffle.</b> 1,000 training rows are put in a new random order, so each batch is a fair mix.</p></div>
<div class="step"><p><b>Cut into batches.</b> With batch size 50 there are 1,000 ÷ 50 = 20 batches.</p></div>
<div class="step"><p><b>First batch.</b> Forward pass on 50 rows, average loss 0.69. Backward pass gives a gradient for every weight. Take one step: every weight moves a little downhill.</p></div>
<div class="step"><p><b>The rest of the epoch.</b> Batches 2 to 20 do the same. 20 updates in all, each from a different spoonful of data. The training loss drifts down, with wobbles.</p></div>
<div class="step"><p><b>Check on unseen data.</b> Validation loss after this epoch: 0.52, the best so far, so save these weights. If validation loss stops improving for, say, 10 epochs, stop and go back to the saved weights.</p></div>
</div>

<!--fig:training-curves-->

<div class="problem" data-problem="training-networks-updates"></div>

## 3. The knobs

- **Learning rate.** The most important setting: the size of each step. Too small and training crawls. Too big and it bounces or blows up. Try values a factor of 3 or 10 apart (0.3, 0.1, 0.03, ...) and watch the first epochs. Many runs **lower it as training goes** (a schedule), like slowing down as you near a parking spot.
- **Batch size.** Small batches: noisy, many steps per epoch. Large batches: smooth, fast on a graphics card, fewer steps. 32 to 512 is common.
- **Optimiser.** Plain SGD adds `$-\eta \, \nabla L$`. **Momentum** keeps a running average of recent steps, so the path rolls through small bumps like a ball. **Adam** also scales each weight's step by how large its gradients have been. Adam with a rate near 0.001 is a common default.
- **Starting weights.** Small random numbers, scaled to the layer size, so signals neither die out nor explode through the layers.

<div class="meaning">

<dl>
<dt>B (mini-batch)</dt><dd>the handful of rows used for one step</dd>
<dt>∇L (gradient)</dt><dd>the direction in which the loss rises fastest; we step the opposite way</dd>
<dt>η (learning rate)</dt><dd>how big each step is</dd>
<dt>Epoch</dt><dd>one full pass through all the training rows: ⌈n ÷ |B|⌉ steps</dd>
<dt>v, β (momentum)</dt><dd>a running average of recent steps, with β (about 0.9) saying how much of the past to keep</dd>
<dt>Physical meaning</dt><dd>Walking down a foggy valley by feeling the ground under a few stones at a time. Each guess of "downhill" is rough, but many quick guesses get you down faster than surveying the whole valley before every step. A good stride length (learning rate) gets you there; too long and you leap over the bottom.</dd>
</dl>

</div>

## 4. Defences against overfitting

Networks have many weights and can memorise. The usual defences:

- **Early stopping:** watch validation loss, keep the best epoch.
- **Weight decay:** the ridge penalty of Lesson 3.8, applied to every weight.
- **Dropout:** during training, switch off a random half (or so) of a layer's neurons at each step, so no neuron can rely on any other. Like a team that practises with random players missing, so everyone learns to play every role.
- **More data,** or data augmentation (flipped and cropped images, reworded sentences).

<div class="myth">

**"The lower the training loss, the better the model."** Training loss keeps falling as long as the network can memorise more of the training rows, and a big network can memorise all of them. What matters is the loss on rows it has never trained on. When validation loss starts rising while training loss keeps falling, extra training is making the model *worse* at its real job.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** take many small, noisy downhill steps, and judge progress on data the steps never see.

**Mini-batch step:** with batch `$B$` of rows and learning rate `$\eta$`,

```math
\mathbf{w} \leftarrow \mathbf{w} - \eta \, \frac{1}{\lvert B \rvert} \sum_{i \in B} \nabla_{\mathbf{w}} L_i(\mathbf{w})
```

**Momentum** with `$\beta$` around 0.9 keeps a velocity `$\mathbf{v}$`:

```math
\mathbf{v} \leftarrow \beta \mathbf{v} + \nabla L, \qquad \mathbf{w} \leftarrow \mathbf{w} - \eta \, \mathbf{v}
```

**Updates per epoch:** `$\lceil n / \lvert B \rvert \rceil$` for `$n$` training rows.

**Analogy:** finding the bottom of a foggy valley by feeling the ground under a few stones at a time. Each guess is rough, but many quick guesses get you down faster than surveying the whole valley before every step.

**Try it:** 60,000 rows, batch 128, 10 epochs. How many weight updates? (`$\lceil 60{,}000/128 \rceil = 469$` per epoch, 4,690 in all.)
</details>

## 5. Worked example

*Made-up numbers.* A network classifying product photos, validation loss after each epoch:

| epoch | 1 | 5 | 10 | 15 | 20 | 25 | 30 |
|---|---|---|---|---|---|---|---|
| training loss | 1.90 | 0.92 | 0.58 | 0.41 | 0.28 | 0.18 | 0.11 |
| validation loss | 1.85 | 0.97 | 0.69 | 0.62 | 0.64 | 0.71 | 0.80 |

Validation loss is lowest at epoch 15 and rises after, while training loss keeps falling: overfitting from about epoch 15. With early stopping (patience 10 epochs), training stops at epoch 25 and restores the epoch-15 weights. Adding dropout and retraining moves the best validation loss to 0.55 at epoch 22.

## 6. Practice

1. In the simulation, set the learning rate to 10. What happens to the loss?
2. Compare batch size 4 with 60 (all rows) at the same rate. Which needs fewer epochs, and why?
3. Why must early stopping use validation loss, not training loss?

<details>
<summary>Answers</summary>

1. It jumps and then shoots up (shown clipped at the top): the steps overshoot and diverge.
2. Batch 4 usually: it makes 15 updates per epoch against 1, so it gets further per epoch, at the cost of noisier steps.
3. Training loss keeps falling as the network memorises; only data it never trains on shows when it stops generalising.
</details>

**Try it on your own data:** the [[small-model-trainer]] shows training and test scores side by side; the same reading of the gap applies to networks.

**New words:** *mini-batch*, *epoch*, *stochastic gradient descent*, *momentum*, *Adam*, *learning-rate schedule*, *weight decay*, *dropout*, *early stopping*.

<div class="keypoints">

- Training loop: shuffle, cut into mini-batches, and for each batch do forward, loss, backward and one gradient step; one pass over all batches is an epoch.
- The learning rate is the most important knob: too small crawls, too big bounces or diverges.
- Momentum and Adam smooth and scale the steps; Adam near 0.001 is a common default.
- Judge training by validation loss; early stopping, weight decay, dropout and more data fight overfitting.

</div>
