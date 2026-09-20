# Grading the AI — Accuracy, Precision, Recall, F1 Score & Loss

Hello again.
I am **AIVA (Artificial Intelligence Virtual Assistant)**. In the previous topics, we learned how AI systems are trained using datasets and how models must avoid problems like **overfitting** and **underfitting**.

Now we will learn how AI engineers **evaluate and grade an AI model** after training. Just like students receive marks in a test, AI systems are measured using special evaluation metrics.

Before understanding these scores, we first need to understand **four basic types of AI predictions**.

---

# Understanding AI Predictions

When an AI makes a prediction, the result can either be correct or incorrect. These outcomes are grouped into four categories:

### True Positive (TP)

A **True Positive** happens when the AI correctly predicts **“yes.”**

Example:
If the AI sees an image of a dog and correctly predicts **“dog,”** this is a **True Positive**.

---

### True Negative (TN)

A **True Negative** happens when the AI correctly predicts **“no.”**

Example:
If the AI sees a cat and correctly predicts **“not a dog,”** this is a **True Negative**.

---

### False Positive (FP)

A **False Positive** occurs when the AI predicts **“yes,” but the prediction is incorrect.**

Example:
If the AI sees a **cat** but predicts **“dog,”** this is a **False Positive**.

---

### False Negative (FN)

A **False Negative** occurs when the AI predicts **“no,” but it should have said “yes.”**

Example:
If the AI sees a **dog** but predicts **“not a dog,”** this is a **False Negative**.

---

# Accuracy

**Accuracy** is the simplest way to measure how well an AI performs.

It represents the **percentage of correct predictions** made by the AI.

Accuracy = \frac{TP + TN}{TP + TN + FP + FN}

Example:

If the AI correctly answers **90 out of 100 questions**, the accuracy is:

**90% accuracy**

However, accuracy alone does not always give the full picture of how well the AI is performing.

---

# Precision

**Precision** measures how careful the AI is when it predicts **“yes.”**

It answers the question:

> When the AI says “yes,” how often is it correct?

Precision = \frac{TP}{TP + FP}

A high precision score means the AI **rarely makes false alarms**.

For example, if an AI says something is a dog, it is usually correct.

---

# Recall

**Recall** measures how well the AI finds **all the real positive cases**.

It answers the question:

> Out of all the real “yes” cases, how many did the AI correctly detect?

Recall = \frac{TP}{TP + FN}

A high recall score means the AI is good at **detecting most of the correct cases**, even if it sometimes makes mistakes.

---

# F1 Score

Sometimes an AI may have:

* High precision but low recall, or
* High recall but low precision.

To balance both measurements, engineers use the **F1 Score**.

F1 = \frac{2 \times Precision \times Recall}{Precision + Recall}

The F1 Score provides a **balanced evaluation** of the AI model by combining both precision and recall.

This helps engineers understand the overall performance of the system.

---

# Loss Function

Another important concept in evaluating AI models is the **Loss Function**.

Accuracy only tells us **whether a prediction is correct or incorrect**. However, the loss function tells us **how far the prediction is from the correct answer**.

Think of it like a **dart game**:

* Accuracy tells you whether the dart hit the target.
* Loss tells you **how far away the dart landed from the center**.

### Example

If an AI sees a **horse** and predicts **“zebra,”** the mistake is relatively small because the animals are somewhat similar.

But if the AI predicts **“toaster,”** the mistake is very large.

The purpose of training an AI model is to **reduce the loss as much as possible**, so that the system makes fewer mistakes and smaller errors over time.

---

# Why These Metrics Matter

These evaluation metrics help AI engineers determine whether a model is:

* Reliable
* Accurate
* Balanced in its predictions

Using multiple metrics ensures that the AI is not just correct sometimes, but **consistently performs well across different situations**.

---

# Think Like an AI Engineer

Consider the following situation.

An AI system rarely makes false alarms when identifying dogs, but it sometimes misses real dogs in images.

Which metric is likely very high?

A) Precision
B) Recall
C) Loss

Correct answer: **A**

If the AI rarely makes false positive predictions, it has **high precision**.

---

# Key Points to Remember

**True Positive (TP)**
AI correctly predicts “yes.”

**True Negative (TN)**
AI correctly predicts “no.”

**False Positive (FP)**
AI predicts “yes” but is incorrect.

**False Negative (FN)**
AI predicts “no” but misses the correct answer.

**Accuracy**
Percentage of correct predictions.

**Precision**
How often the AI is correct when it predicts “yes.”

**Recall**
How many real positive cases the AI successfully detects.

**F1 Score**
A balanced measure combining precision and recall.

**Loss Function**
Measures how far the AI’s predictions are from the correct answers.

---

# Message from AIVA

You have now completed **Chapter 2: Data, Models & Training**.

In this chapter, you learned how AI systems are trained using datasets, how engineers prevent learning mistakes such as overfitting and underfitting, and how models are evaluated using metrics like accuracy, precision, recall, and loss.

In the next chapter, we will explore **how modern AI systems like large language models are built and trained on massive datasets to perform complex tasks such as conversation, writing, and reasoning**.
