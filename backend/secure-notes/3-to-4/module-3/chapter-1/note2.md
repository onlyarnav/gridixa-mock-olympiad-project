# Regression Metrics

## Introduction

Imagine you are a real estate appraiser tasked with predicting the selling price of a house. You analyze the neighborhood, the square footage, and the number of bedrooms, and you confidently predict the house will sell for 500,000 USD. A week later, it sells for 550,000 USD.

Did your model fail? In a classification problem (like predicting whether an image is a cat or a dog), a miss is a simple binary failure; you are either right or wrong. But in a regression problem, predicting a continuous number, you are *never* perfectly right. What matters is *how wrong* you are.

*Example:* Missing a house price by 50,000 USD might be acceptable for a luxury mansion, but catastrophic for a small apartment. Think about predicting the trajectory of a spacecraft landing on Mars. Being off by 1% could mean missing the entire planet.

To evaluate algorithms that predict continuous numbers, we cannot use classification accuracy. We need specialized yardsticks—Regression Metrics—to measure the magnitude, direction, and real-world impact of our continuous errors.

## The Foundation: The Residual

Before we can build metrics, we must understand the fundamental unit of regression error: the **Residual**.

Suppose $y_i$ is the true, actual value of a data point, and $\hat{y}_i$ is the value your machine learning model predicted. The residual (or error) for that single prediction is simply:

$$e_i = y_i - \hat{y}_i$$

If your model predicts 50, but the truth was 60, your residual is 10. If the model predicts 70, the residual is -10.
How do we summarize thousands of these residuals into a single, grading score for our AI?

## Metric 1: Mean Absolute Error (MAE)

The most intuitive way to measure overall error is to just ask: "On average, how far off are my predictions?"

However, we have a mathematical problem. If you miss one prediction by +10 and another by -10, simply averaging them gives an error of 0. Your model looks perfect, even though it missed both times! To fix this, we strip away the negative signs using the absolute value.

### Formal Definition

Mean Absolute Error (MAE) is the arithmetic average of the absolute errors.

$$MAE = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|$$

*Example:* MAE is incredibly easy to interpret. If you are predicting the temperature in degrees Celsius, an MAE of 2.5 means your model is, on average, off by 2.5 degrees. Every error is treated linearly; being off by 10 is exactly twice as bad as being off by 5.

## Metric 2: Mean Squared Error (MSE)

What if all errors are not created equal?

Suppose you are programming a self-driving car's steering angle. Being off by 1 degree ten times is annoying, but manageable. Being off by 10 degrees exactly once will cause a fatal crash. We need a metric that aggressively punishes large outliers.

Instead of taking the absolute value of the residual, we square it.

### Formal Definition

Mean Squared Error (MSE) is the average of the squares of the errors.

$$MSE = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$$

Because we are squaring the residual, an error of 2 is penalized as 4. But an error of 10 is penalized as 100! MSE forces the machine learning model to prioritize fixing its biggest mistakes, even if it means making slightly more small mistakes. Furthermore, $y=x^2$ is a smooth, differentiable curve, which makes it the absolute favorite metric for algorithms that rely on Calculus (like Gradient Descent in Neural Networks).

## Metric 3: Root Mean Squared Error (RMSE)

MSE is mathematically brilliant but practically confusing. If you are predicting house prices in dollars, the MSE unit is "squared dollars." What does a squared dollar even look like?

To bring the metric back to our original, interpretable unit, we simply wrap the MSE in a square root.

### Formal Definition

$$RMSE = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}$$

RMSE maintains the severe penalty for large outliers, but outputs a number that makes sense to human stakeholders.

### Step-by-Step Calculation: MAE vs MSE Experiment

Let us run a small experiment to see how MAE and MSE react to a massive outlier.

```
True Values:      [10, 20, 30, 40]
Model Predictions:[11, 19, 31, 100] <-- Notice the massive error on the 4th prediction!

Step 1: Calculate Residuals
Residuals = [-1, 1, -1, -60]

Step 2: Calculate MAE
Absolute Residuals = [1, 1, 1, 60]
MAE = (1 + 1 + 1 + 60) / 4 = 63 / 4 = 15.75

Step 3: Calculate MSE
Squared Residuals = [1, 1, 1, 3600]
MSE = (1 + 1 + 1 + 3600) / 4 = 3603 / 4 = 900.75

Step 4: Calculate RMSE
RMSE = sqrt(900.75) ≈ 30.01

```

Notice the intuition here: the MAE (15.75) makes the model look somewhat decent, heavily diluted by the three good predictions. But the RMSE (30.01) sounds the alarm, heavily inflated by that single catastrophic error of 60.

## Metric 4: R-Squared (Coefficient of Determination)

Think about this: if you build an AI that predicts the weather tomorrow, and it achieves an RMSE of 5 degrees, is that good?

It depends. If the temperature wildly fluctuates by 40 degrees every day, an error of 5 is amazing! But if you live in a tropical city where the temperature is exactly 25 degrees every single day all year, an error of 5 is terrible.

To know if our model is actually intelligent, we must compare it to a "dumb" baseline model. The standard dumb model is an AI that ignores all input features and simply predicts the historical average ($\bar{y}$) every single time.

### Formal Definition

$R^2$ represents the proportion of the variance in the dependent variable that is predictable from the independent variables.

$$R^2 = 1 - \frac{\sum_{i=1}^{n} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{n} (y_i - \bar{y})^2}$$

* The numerator is the sum of squared errors from **your model**.
* The denominator is the sum of squared errors from the **dumb average baseline**.

If your model is perfect, the numerator is 0, and $R^2 = 1.0$ (100%).
If your model is exactly as bad as just guessing the average, the numerator equals the denominator, and $R^2 = 0.0$ (0%).
If your model is somehow worse than blindly guessing the average, $R^2$ becomes negative!

## Overview of Tradeoffs

| Metric | Interpretation | Sensitivity to Outliers | Best Used When... |
| --- | --- | --- | --- |
| **MAE** | Average absolute distance | Low (Linear) | You want a human-readable error and don't mind occasional large errors. |
| **MSE** | Average squared distance | High (Quadratic) | Training Neural Networks via Gradient Descent. |
| **RMSE** | Root of squared distance | High | You want human-readable units BUT need to strictly penalize large errors. |
| **$R^2$** | Variance explained | Moderate | You need to explain the model's overall quality (e.g., 0% to 100% scale). |

## Practical Python Implementation

In a competition or production environment, we never calculate these by hand. We use `sklearn.metrics`.

```
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# Ground truth and our AI's predictions
y_true = np.array([150.5, 200.0, 250.2, 300.8, 350.0])
y_pred = np.array([152.0, 198.5, 260.0, 295.0, 365.0])

# Calculate Metrics
mae = mean_absolute_error(y_true, y_pred)
mse = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse) # RMSE is just the square root of MSE
r2 = r2_score(y_true, y_pred)

print(f"MAE:  {mae:.2f}")
print(f"MSE:  {mse:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R^2:  {r2:.4f}")

```

### Sample Output

```
MAE:  6.72
MSE:  71.94
RMSE: 8.48
R^2:  0.9856

```

An $R^2$ of 0.9856 means our model successfully explains 98.56% of the variance in the data. It is highly accurate!

## Advanced Understanding: Adjusted R-Squared

*Example:* A common trap in Machine Learning is the illusion of complexity. If you take a linear regression model and keep adding completely random, useless features (like the phases of the moon, or the color of the appraiser's shirt), standard $R^2$ will mathematically *never decrease*. It will either stay the same or artificially creep closer to 1.0.

To combat this, statisticians created **Adjusted $R^2$**. This metric actively penalizes you for adding useless variables to your model. If you add a new feature, and it does not significantly improve the predictions, Adjusted $R^2$ will decrease, warning you that your model is becoming unnecessarily complex.

## Conclusion

**What it is:** Regression metrics are mathematical formulas used to quantify the continuous error (the residual) between a machine learning model's numerical predictions and the actual true values.

**Why it matters:** Unlike classification, regression errors live on a spectrum. These metrics allow us to define exactly what kind of mistakes we are willing to tolerate—whether we want a simple average of errors (MAE) or a system that aggressively penalizes massive outliers (MSE/RMSE).

**Where it is used:** They are used in any AI system predicting continuous values: algorithmic trading, weather forecasting, supply chain demand planning, and biological age estimation.

**Why understanding it is important for AI and Machine Learning:** Choosing the wrong metric can result in a catastrophic model. If you optimize a self-driving car using MAE instead of MSE, the car will happily make life-threatening 10-degree steering errors because it doesn't know large outliers are forbidden. An Olympiad-level data scientist does not just memorize these formulas; they understand the geometric and behavioral consequences of every metric they choose to optimize.