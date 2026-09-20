# Hyperparameter Tuning

Imagine you are building a racing car.

You have already designed the engine, tires, and body. But before the race begins, you still need to decide:

* How much fuel should the car carry?
* How soft should the suspension be?
* How much air pressure should be in the tires?

The car itself does not decide these things.

You do.

And these settings can make the difference between winning and losing.

Machine learning models work in exactly the same way.

The algorithm provides the engine, but certain settings must be chosen before training begins.

These settings are called **Hyperparameters**.

Finding the best values for these settings is called **Hyperparameter Tuning**.

It is one of the most important tasks in machine learning because even a powerful algorithm can perform poorly if its hyperparameters are badly chosen.

## Parameters vs Hyperparameters

Before understanding hyperparameter tuning, we must understand the difference between parameters and hyperparameters.

### Parameters

Parameters are values that the model learns automatically during training.

Example:

In Linear Regression:

``` 
y = mx + c
```

The values:

``` 
m and c
```

are learned from the data.

These are parameters.

### Hyperparameters

Hyperparameters are settings chosen before training starts.

Example:

* Number of trees in a Random Forest
* Learning rate in Gradient Descent
* Maximum depth of a Decision Tree

The model does not learn these automatically.

We choose them.

## Why Hyperparameters Matter

Suppose you build two Decision Trees.

### Tree A

Maximum depth:

``` 
2
```

### Tree B

Maximum depth:

``` 
50
```

Even though both use the same algorithm, their performance can be completely different.

Tree A might underfit.

Tree B might overfit.

The algorithm is the same.

Only the hyperparameters changed.

## Real-World Analogy

Imagine baking a cake.

The recipe is your algorithm.

The settings are:

* Oven temperature
* Baking time
* Amount of sugar

These are like hyperparameters.

Two people following the same recipe can end up with completely different cakes simply because they chose different settings.

## Common Hyperparameters

Different algorithms have different hyperparameters.

### Decision Tree

* Maximum depth
* Minimum samples per leaf
* Splitting criterion

### Random Forest

* Number of trees
* Maximum depth
* Number of features considered

### K-Nearest Neighbors

* Value of K

### Neural Networks

* Learning rate
* Batch size
* Number of layers
* Number of neurons
* Number of epochs

### Support Vector Machines

* Kernel type
* Regularization parameter
* Gamma

Every machine learning algorithm comes with its own set of hyperparameters.

## Example: K-Nearest Neighbors

Suppose we choose:

``` 
K = 1
```

The model becomes extremely sensitive to noise.

This may cause overfitting.

Suppose we choose:

``` 
K = 100
```

The model becomes too simple.

This may cause underfitting.

The challenge is to find the best value of K.

This is hyperparameter tuning.

## Example: Decision Trees

Suppose:

``` 
max_depth = 2
```

The tree is too simple.

Suppose:

``` 
max_depth = 50
```

The tree memorizes the data.

The best value usually lies somewhere in between.

## The Goal of Hyperparameter Tuning

The objective is:

``` 
Find the combination of hyperparameters
that gives the best performance on unseen data.
```

Notice:

We do not care about training accuracy.

We care about:

* Generalization
* Test performance
* Avoiding overfitting and underfitting

## The Search Problem

Suppose a Random Forest has:

* Number of trees:

``` 
100, 200, 300
```

* Maximum depth:

``` 
5, 10, 15
```

* Minimum samples:

``` 
2, 4, 6
```

Total combinations:

``` 
3 × 3 × 3 = 27
```

Which one is best?

This is the hyperparameter tuning problem.

## Manual Tuning

The simplest method is trial and error.

Example:

Train with:

``` 
max_depth = 5
```

Then:

``` 
max_depth = 10
```

Then:

``` 
max_depth = 15
```

Compare performance.

This works for small problems but quickly becomes impractical.

## Grid Search

Grid Search tries every possible combination.

Example:

| Trees | Depth |
| ----- | ----- |
| 100   | 5     |
| 100   | 10    |
| 100   | 15    |
| 200   | 5     |
| 200   | 10    |
| 200   | 15    |
| 300   | 5     |
| 300   | 10    |
| 300   | 15    |

Every combination is tested.

The best one is selected.

## Grid Search in Python

``` 
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier()

params = {
    "n_estimators": [100, 200, 300],
    "max_depth": [5, 10, 15]
}

grid = GridSearchCV(
    model,
    params,
    cv=5
)

grid.fit(X, y)
```

Best parameters:

``` 
print(grid.best_params_)
```

## Why Grid Search Can Be Expensive

Imagine:

10 hyperparameters.

Each has 10 possible values.

Total combinations:

``` 
10¹⁰
=
10,000,000,000
```

Testing all of these combinations is impossible.

The search space becomes enormous.

This is called the **Curse of Dimensionality** in hyperparameter optimization.

## Random Search

Instead of testing every combination, Random Search tests randomly selected combinations.

Example:

Out of 1000 possibilities, it may test only 50.

Surprisingly, this often performs almost as well as Grid Search.

And it is much faster.

## Random Search in Python

``` 
from sklearn.model_selection import RandomizedSearchCV
```

Example:

``` 
random_search = RandomizedSearchCV(
    model,
    params,
    n_iter=20,
    cv=5
)
```

The algorithm evaluates only 20 random combinations.

## Why Random Search Works

Suppose only one hyperparameter is extremely important.

Grid Search wastes time trying every possible value of less important hyperparameters.

Random Search explores more diverse combinations.

This often discovers good solutions faster.

## Cross Validation and Hyperparameter Tuning

When evaluating hyperparameters, we should avoid depending on a single train-test split.

Instead, we use:

**Cross Validation**.

Example:

``` 
GridSearchCV(
    model,
    params,
    cv=5
)
```

The dataset is divided into five parts.

Each hyperparameter setting is evaluated five times.

This gives a much more reliable estimate of performance.

## Bayesian Optimization

Modern machine learning systems often use smarter approaches.

Instead of testing values randomly, Bayesian Optimization learns:

``` 
Which hyperparameter values
are likely to work well?
```

It then focuses its search on promising regions.

Popular libraries:

* Optuna
* Hyperopt
* Bayesian Optimization

These methods are widely used in industry and research.

## Hyperparameter Tuning for Neural Networks

Deep learning has many hyperparameters.

Examples:

* Learning rate
* Number of layers
* Batch size
* Number of neurons
* Optimizer
* Dropout rate

Changing even one of these can dramatically affect performance.

## Example: Learning Rate

Suppose:

``` 
Learning Rate = 1
```

The model may jump wildly and never converge.

Suppose:

``` 
Learning Rate = 0.000001
```

Training becomes extremely slow.

The right learning rate allows smooth and efficient learning.

## Hyperparameter Tuning and Bias-Variance Tradeoff

Many hyperparameters directly affect:

* Bias
* Variance

Example:

Increasing Decision Tree depth:

``` 
Bias ↓
Variance ↑
```

Reducing tree depth:

``` 
Bias ↑
Variance ↓
```

Hyperparameter tuning often means finding the right balance between these two.

## Practical Workflow

A typical machine learning workflow looks like this:

``` 
Choose Algorithm
↓
Select Hyperparameters
↓
Train Model
↓
Evaluate Performance
↓
Adjust Hyperparameters
↓
Repeat
```

This process is iterative.

Professional machine learning engineers repeat it many times.

## Common Mistakes

### Using Test Data for Tuning

The test set should remain completely untouched.

Hyperparameter tuning should use:

* Training data
* Validation data
* Cross validation

### Searching Too Few Values

Important regions of the search space may be missed.

### Searching Too Many Values

Training becomes extremely expensive.

### Ignoring Domain Knowledge

Experience often helps narrow the search space.

## Real-World Example

Imagine building an AI system that detects diseases.

Changing:

* Learning rate
* Number of trees
* Regularization strength

could increase accuracy from:

``` 
85%
```

to:

``` 
95%
```

without changing the algorithm itself.

This is why hyperparameter tuning is so important.

## Olympiad Insight

Winning machine learning competition teams often spend more time tuning hyperparameters than writing new algorithms. In many Kaggle competitions, small improvements in hyperparameter choices separate first place from hundreds of other teams. Hyperparameter optimization is therefore considered one of the most valuable practical skills for machine learning engineers.

## Conclusion

Hyperparameter Tuning is the process of finding the best settings for a machine learning algorithm before training begins. Unlike model parameters, hyperparameters are chosen by the engineer and can dramatically influence performance. Techniques such as manual tuning, Grid Search, Random Search, and Bayesian Optimization help discover combinations that improve generalization and reduce overfitting or underfitting. Mastering hyperparameter tuning is essential because even the most powerful algorithm can perform poorly if its settings are not carefully optimized.
