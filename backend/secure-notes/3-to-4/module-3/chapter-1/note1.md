# Classification Metrics

Imagine you build an AI model that detects whether an email is spam.

You test it on 100 emails and discover that it correctly classifies 95 of them.

Amazing, right?

Not necessarily.

What if:

* There were only 5 spam emails in the entire dataset?
* Your model simply predicted:

``` 
Everything is NOT spam.
```

It would still achieve:

``` 
95% Accuracy
```

even though it completely failed to detect any spam emails.

This teaches us an important lesson:

> Accuracy alone does not always tell the whole story.

Machine learning engineers need better ways to measure model performance.

These measurements are called **Classification Metrics**.

Classification metrics help us understand:

* How often our model is correct.
* What types of mistakes it makes.
* Whether it is reliable enough for real-world applications.

## What Is a Classification Problem?

A classification problem predicts categories.

Examples:

| Problem            | Classes            |
| ------------------ | ------------------ |
| Spam Detection     | Spam, Not Spam     |
| Disease Detection  | Sick, Healthy      |
| Sentiment Analysis | Positive, Negative |
| Fraud Detection    | Fraud, Legitimate  |

The model's job is to place each example into the correct category.

But how do we know if the model is performing well?

This is where classification metrics come in.

## The Confusion Matrix

Almost every classification metric starts with one important tool:

``` 
Confusion Matrix
```

Despite its name, it actually removes confusion.

A confusion matrix summarizes how many predictions were:

* Correct
* Incorrect

For a binary classification problem, it looks like this:

|                 | Predicted Positive | Predicted Negative |
| --------------- | ------------------ | ------------------ |
| Actual Positive | True Positive      | False Negative     |
| Actual Negative | False Positive     | True Negative      |

Understanding these four values is extremely important.

## True Positive (TP)

The model predicts:

``` 
Positive
```

and the answer is actually:

``` 
Positive
```

Example:

AI predicts:

``` 
Patient has disease.
```

The patient actually has the disease.

Correct prediction.

## True Negative (TN)

The model predicts:

``` 
Negative
```

and the answer is actually:

``` 
Negative
```

Example:

AI predicts:

``` 
Patient is healthy.
```

The patient is indeed healthy.

Correct prediction.

## False Positive (FP)

The model predicts:

``` 
Positive
```

but the actual answer is:

``` 
Negative
```

Example:

AI predicts:

``` 
Patient has cancer.
```

But the patient is healthy.

This is also called:

``` 
Type I Error
```

## False Negative (FN)

The model predicts:

``` 
Negative
```

but the actual answer is:

``` 
Positive
```

Example:

AI predicts:

``` 
Patient is healthy.
```

But the patient actually has cancer.

This is called:

``` 
Type II Error
```

## Example Confusion Matrix

Suppose:

|                 | Predicted Spam | Predicted Not Spam |
| --------------- | -------------- | ------------------ |
| Actual Spam     | 40             | 10                 |
| Actual Not Spam | 5              | 45                 |

Then:

``` 
TP = 40
FN = 10
FP = 5
TN = 45
```

All classification metrics are built from these four numbers.

# Accuracy

Accuracy measures:

``` 
How many predictions were correct?
```

Formula:

``` 
Accuracy =
(TP + TN)
/
(TP + TN + FP + FN)
```

Example:

``` 
TP = 40
TN = 45
FP = 5
FN = 10
```

Accuracy:

``` 
(40 + 45) / 100
=
85%
```

The model is correct 85% of the time.

## Why Accuracy Can Be Misleading

Suppose:

1000 patients.

Only:

``` 
10 patients
```

have a disease.

Model predicts:

``` 
Everyone is healthy.
```

Accuracy:

``` 
990 / 1000
=
99%
```

Amazing accuracy.

Terrible model.

It missed every sick patient.

This is why we need other metrics.

# Precision

Precision answers:

``` 
When the model predicts positive,
how often is it correct?
```

Formula:

``` 
Precision =
TP
/
(TP + FP)
```

Example:

``` 
TP = 40
FP = 5
```

Precision:

``` 
40 / 45
=
88.9%
```

Almost 89% of positive predictions are correct.

## When Precision Matters

Precision is important when:

False Positives are expensive.

Examples:

* Spam detection
* Fraud detection
* Legal systems

Imagine incorrectly accusing innocent people of fraud.

High precision becomes critical.

# Recall

Recall answers:

``` 
Out of all actual positives,
how many did we find?
```

Formula:

``` 
Recall =
TP
/
(TP + FN)
```

Example:

``` 
TP = 40
FN = 10
```

Recall:

``` 
40 / 50
=
80%
```

The model found 80% of all positive examples.

## When Recall Matters

Recall is important when:

False Negatives are dangerous.

Examples:

* Cancer detection
* Fraud detection
* Security systems

Missing a cancer patient can have severe consequences.

Therefore, high recall is extremely important.

# Precision vs Recall

Imagine airport security.

### High Precision

Only stop people who are almost certainly dangerous.

Few innocent people are stopped.

But some dangerous people may pass through.

### High Recall

Stop everyone who looks even slightly suspicious.

Catch almost all dangerous people.

But many innocent people are stopped.

There is often a tradeoff between precision and recall.

# F1 Score

Sometimes we want both:

* High precision
* High recall

The F1 Score combines both.

Formula:

``` 
F1 =
2 ×
(Precision × Recall)
/
(Precision + Recall)
```

It is called the:

``` 
Harmonic Mean
```

of precision and recall.

## Example

Precision:

``` 
0.90
```

Recall:

``` 
0.80
```

F1 Score:

``` 
0.847
```

The model balances both objectives.

## Why F1 Score Is Useful

F1 is valuable when:

* Classes are imbalanced.
* Both false positives and false negatives matter.

Examples:

* Medical diagnosis
* Fraud detection
* Cybersecurity

# Specificity

Specificity answers:

``` 
How well do we identify negatives?
```

Formula:

``` 
Specificity =
TN
/
(TN + FP)
```

Example:

``` 
45 / 50
=
90%
```

The model correctly identifies 90% of negatives.

## Sensitivity

Another name for Recall is:

``` 
Sensitivity
```

Both terms mean the same thing.

# False Positive Rate

Formula:

``` 
FPR =
FP
/
(FP + TN)
```

This tells us:

``` 
How often healthy cases
are incorrectly classified as positive.
```

# False Negative Rate

Formula:

``` 
FNR =
FN
/
(FN + TP)
```

This tells us:

``` 
How often positive cases
are missed.
```

# Multi-Class Classification Metrics

Many problems have more than two classes.

Examples:

* Cat
* Dog
* Bird

Metrics can still be computed using:

* Macro averaging
* Micro averaging
* Weighted averaging

The basic ideas remain the same.

# Example in Python

``` 
from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
```

Accuracy:

``` 
accuracy_score(y_true, y_pred)
```

Precision:

``` 
precision_score(y_true, y_pred)
```

Recall:

``` 
recall_score(y_true, y_pred)
```

F1:

``` 
f1_score(y_true, y_pred)
```

Confusion Matrix:

``` 
from sklearn.metrics import confusion_matrix

confusion_matrix(y_true, y_pred)
```

# Choosing the Right Metric

Different problems require different metrics.

### Spam Detection

Precision is important.

### Disease Detection

Recall is important.

### General Classification

Accuracy may be sufficient.

### Imbalanced Datasets

F1 Score is often preferred.

There is no single best metric.

The choice depends entirely on the problem.

# Real-World Example

Suppose an AI system detects tumors.

Accuracy:

``` 
99%
```

Sounds impressive.

But:

``` 
Recall = 60%
```

The model misses 40% of cancer patients.

Such a model would be unacceptable in healthcare.

This example shows why machine learning engineers must look beyond accuracy.

# Olympiad Insight

Professional machine learning systems are rarely evaluated using only one metric. Companies carefully choose metrics depending on the cost of mistakes. Search engines, recommendation systems, fraud detectors, and medical AI systems all optimize different metrics because different errors have different consequences. Understanding classification metrics is therefore essential because building a model is only the first step—knowing how to measure and evaluate it correctly is what turns a machine learning practitioner into an effective AI engineer.

# Conclusion

Classification Metrics are measurements that help us evaluate the performance of classification models. Starting from the confusion matrix, we can compute important metrics such as Accuracy, Precision, Recall, F1 Score, and Specificity. Each metric highlights a different aspect of model behavior and is useful in different situations. Since real-world problems often involve unequal costs for different types of mistakes, selecting the appropriate evaluation metric is just as important as selecting the machine learning algorithm itself.
