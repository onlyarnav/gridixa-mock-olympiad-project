# Fairness in Models

Imagine two students apply for the same scholarship.

They have:

* The same grades
* The same achievements
* The same interview performance

But one student gets selected and the other gets rejected simply because of their gender.

Would that be fair?

Of course not.

Now imagine an AI system makes this decision.

Would the decision suddenly become fair just because a computer made it?

Absolutely not.

Artificial Intelligence systems can also make unfair decisions.

Sometimes they learn unfair patterns from data and unintentionally discriminate against certain groups of people.

This is why one of the most important topics in modern AI is:

``` 
Fairness in Machine Learning
```

As AI systems increasingly make decisions about:

* Loans
* Jobs
* Healthcare
* Education
* Insurance
* Criminal justice

ensuring fairness has become a major responsibility for AI engineers.

## What Is Fairness in Machine Learning?

Fairness means:

``` 
Building AI systems that
do not unfairly discriminate
against individuals or groups.
```

A fair model should make decisions based on:

* Relevant information
* Legitimate patterns
* Objective evidence

and not based on:

* Gender
* Race
* Religion
* Age
* Nationality

unless these factors are genuinely necessary for the task.

## Why Fairness Matters

Imagine an AI hiring system.

Suppose:

``` 
Men are selected 80% of the time.
Women are selected 20% of the time.
```

Why?

Is it because men were genuinely more qualified?

Or because the model learned historical biases?

Without fairness analysis, we may never know.

## Real-Life Analogy

Imagine teaching a class.

Two students submit identical answers.

If one receives:

``` 
95 marks
```

and the other receives:

``` 
70 marks
```

simply because of their background, the grading system is unfair.

AI systems should avoid this type of behavior.

## What Is Bias?

Bias means:

``` 
A systematic preference
or disadvantage
toward certain groups.
```

Bias can enter machine learning systems in many ways.

Sometimes the model itself is not intentionally unfair.

Instead, the unfairness comes from the data.

## Historical Bias

Suppose a company hired mostly men in the past.

Training data:

| Candidate | Hired |
| --------- | ----- |
| Male      | Yes   |
| Male      | Yes   |
| Female    | No    |
| Male      | Yes   |

The AI may learn:

``` 
Being male increases
the chance of being hired.
```

The model simply copies historical patterns.

Unfortunately, historical patterns are not always fair.

## The Garbage In, Garbage Out Principle

Machine learning models learn from data.

If the data contains bias:

``` 
Biased Data
↓
Biased Model
```

This idea is often summarized as:

``` 
Garbage In,
Garbage Out.
```

Bad data often leads to bad decisions.

## Example: Facial Recognition Systems

Suppose:

Training data contains:

* 90% light-skinned faces
* 10% dark-skinned faces

The model may perform very well on one group and poorly on another.

The model itself may not be malicious.

The problem is:

``` 
Unbalanced Data.
```

## Example: Loan Approval

Suppose an AI predicts:

``` 
Reject Loan
```

Question:

``` 
Would the decision have been different
if the applicant belonged
to another group?
```

Fairness studies try to answer this question.

## Types of Bias in Machine Learning

There are many forms of bias.

### Historical Bias

Past decisions were unfair.

### Sampling Bias

Certain groups are underrepresented.

### Measurement Bias

Data is collected differently for different groups.

### Label Bias

Human labels themselves are biased.

### Algorithmic Bias

The learning algorithm amplifies existing inequalities.

## Sampling Bias Example

Suppose we build a health prediction model using data from:

``` 
Adults aged 20-40.
```

Then we use it for:

``` 
Elderly patients.
```

The model may perform poorly because older individuals were underrepresented during training.

## Measurement Bias Example

Suppose income data is collected inaccurately for certain regions.

The model may then make poorer predictions for those populations.

The problem is not the algorithm.

The problem is the measurements.

## Label Bias Example

Suppose human reviewers historically rejected applications from certain communities.

The labels themselves become biased.

The AI simply learns these patterns.

## Why Fairness Is Difficult

Fairness sounds simple:

``` 
Treat everyone equally.
```

But in practice, it is extremely challenging.

Consider a university admission system.

Should fairness mean:

* Equal admission rates?
* Equal opportunities?
* Equal accuracy across groups?

Different definitions can lead to different answers.

## Example

Suppose:

| Group   | Students Admitted |
| ------- | ----------------- |
| Group A | 80%               |
| Group B | 40%               |

Is this unfair?

Maybe.

But perhaps:

Group A had higher exam scores.

Or maybe:

The exam itself was biased.

Fairness often requires deep investigation.

## Group Fairness

Group fairness asks:

``` 
Are different groups
being treated similarly?
```

Example:

Do men and women receive similar loan approval rates?

Do different ethnic groups experience similar model performance?

## Individual Fairness

Individual fairness asks:

``` 
Are similar individuals
treated similarly?
```

Example:

Two applicants with nearly identical profiles should receive similar predictions.

## Demographic Parity

One fairness measure is:

``` 
Demographic Parity
```

It asks:

``` 
Does every group receive
positive predictions
at similar rates?
```

Example:

| Group | Approved |
| ----- | -------- |
| A     | 50%      |
| B     | 50%      |

This satisfies demographic parity.

## Equal Opportunity

Another important concept is:

``` 
Equal Opportunity
```

It asks:

``` 
Among qualified individuals,
does every group
have similar chances of success?
```

This is often considered a more practical fairness definition.

## Equalized Odds

Equalized Odds requires:

* Similar True Positive Rates
* Similar False Positive Rates

across different groups.

This ensures that mistakes are not concentrated in one population.

## Example: Medical Diagnosis

Suppose:

Disease detection accuracy:

| Group   | Recall |
| ------- | ------ |
| Group A | 95%    |
| Group B | 60%    |

The system performs much worse for Group B.

This creates an unfair healthcare system.

## Fairness and Accuracy

Sometimes improving fairness can reduce accuracy.

Suppose:

Model A:

``` 
Accuracy = 95%
Fairness = Poor
```

Model B:

``` 
Accuracy = 92%
Fairness = Excellent
```

Which model should we choose?

There is often a tradeoff.

Real-world AI systems must balance:

``` 
Performance
and
Fairness.
```

## Fairness Through Better Data

One way to improve fairness is:

``` 
Collect Better Data.
```

Examples:

* Include underrepresented groups.
* Gather more diverse examples.
* Improve data quality.

Better data often leads to fairer models.

## Fairness Through Feature Selection

Suppose a hiring model uses:

``` 
Gender
```

as an input feature.

Removing the feature may improve fairness.

However, fairness is often more complicated because other variables may indirectly reveal the same information.

## Proxy Variables

Suppose we remove:

``` 
Race
```

but keep:

* Zip code
* Neighborhood
* School attended

These features may indirectly reveal race.

They are called:

``` 
Proxy Variables.
```

Fairness analysis must consider these hidden relationships.

## Bias Detection

Data scientists often ask:

* Does performance vary across groups?
* Are some groups receiving more errors?
* Are false positives concentrated in one population?
* Are false negatives affecting certain communities?

These questions help uncover unfairness.

## Example: Self-Driving Cars

Suppose pedestrian detection works better:

``` 
During daytime
```

than:

``` 
At night.
```

Certain groups may be disproportionately affected.

Fairness is not only about demographics.

It can also involve environmental conditions.

## Explainability and Fairness

Explainability helps us understand:

``` 
Why did the model make this decision?
```

If explanations reveal:

``` 
Gender
```

or

``` 
Race
```

is strongly influencing decisions, fairness concerns arise.

Explainability and fairness are deeply connected.

## Responsible AI

Modern AI development follows several principles:

* Fairness
* Transparency
* Accountability
* Privacy
* Safety

Together, these ideas form:

``` 
Responsible AI.
```

Fairness is one of its most important pillars.

## Real-World Examples

Fairness is critical in:

### Banking

* Loan approval
* Credit scoring

### Healthcare

* Disease diagnosis
* Treatment recommendations

### Hiring

* Resume screening
* Candidate ranking

### Insurance

* Risk assessment
* Premium calculation

### Criminal Justice

* Risk prediction
* Bail recommendations

### Education

* Admissions
* Scholarship selection

## Common Misconceptions

### AI Is Automatically Fair

False.

AI can inherit human biases.

### Removing Sensitive Features Solves Everything

False.

Proxy variables may still create unfairness.

### Fairness Means Equal Outcomes

Not necessarily.

Different definitions of fairness exist.

### Accuracy Is More Important Than Fairness

In many applications, fairness is equally important.

## Why Fairness Matters for Society

Imagine an unfair AI system making millions of decisions every day.

The impact can become enormous.

AI systems can:

* Reduce inequality
* Or unintentionally amplify it.

The choices made by AI engineers therefore have real social consequences.

## The Goal of Fair AI

The goal is not:

``` 
Perfect fairness.
```

Perfect fairness is often impossible.

The goal is:

``` 
Recognize bias,
measure it,
reduce it,
and build systems
that are as fair
and responsible as possible.
```

## Olympiad Insight

As machine learning systems increasingly influence important decisions in society, fairness has become one of the central challenges of artificial intelligence. A highly accurate model that systematically disadvantages certain groups can cause significant harm. Modern AI engineers must therefore think beyond performance metrics and carefully evaluate how their systems affect different populations. Building fair AI is not only a technical challenge but also an ethical responsibility.

## Conclusion

Fairness in machine learning refers to designing AI systems that avoid unjust discrimination and treat individuals and groups responsibly. Bias can enter models through historical data, sampling problems, measurement errors, and proxy variables. Because fairness has multiple definitions and often involves tradeoffs with accuracy, evaluating and improving fairness requires careful analysis and thoughtful design choices. As AI becomes more integrated into society, fairness is becoming an essential requirement for building trustworthy and responsible artificial intelligence systems.
