# Flowchart Symbols

## Before Writing Code

Imagine you are planning a road trip across a country.

Would you immediately start driving without a map?

Probably not.

Most people first create a route:

```text
Start City
↓
Highway
↓
Fuel Stop
↓
Destination
```

This route helps them understand the journey before beginning.

Programming works in the same way.

Before writing code, programmers often create a **flowchart**, which acts like a map for a program.

A flowchart visually shows how a solution works step by step.

To create flowcharts, we use special shapes called **flowchart symbols**.

Each symbol has a specific meaning.

## What is a Flowchart?

A flowchart is a graphical representation of an algorithm or process.

Instead of writing:

```text
Input marks
Check marks
Display grade
```

We use shapes connected by arrows to show the flow of logic.

Flowcharts help programmers:

* Understand complex problems
* Plan algorithms
* Communicate solutions
* Detect mistakes before coding
* Visualize program execution

Think of a flowchart as a blueprint for a program.

## Why Do We Need Symbols?

Imagine if every traffic sign looked identical.

You would never know whether a sign meant:

* Stop
* Turn left
* Speed limit
* School zone

Different symbols communicate different meanings.

Flowcharts work similarly.

Each shape instantly tells us what type of action is occurring.

This makes flowcharts easier to read and understand.

## The Terminator Symbol (Start/End)

The first symbol every programmer learns is the **Terminator**.

Shape:

```text
  _________
 /         \
|  START   |
 \_________/
```

or

```text
  _________
 /         \
|   END    |
 \_________/
```

Purpose:

* Indicates where a process begins
* Indicates where a process ends

Every flowchart should have:

* One Start
* One End

Example:

```text
START
↓
Display "Hello"
↓
END
```

Without a start and end point, the flowchart becomes incomplete.

## The Process Symbol

Shape:

```text
+-----------+
|  PROCESS  |
+-----------+
```

Purpose:

Represents an action or operation.

Examples:

* Calculate total marks
* Add two numbers
* Multiply values
* Train machine learning model

Example:

```text
START
↓
Calculate Sum
↓
END
```

In programming, most calculations are represented using process symbols.

## The Input/Output Symbol

Shape:

```text
 /---------/
|  INPUT   |
 \---------\
```

Purpose:

Used whenever data enters or leaves the system.

Examples:

Input:

```text
Enter your name
Enter age
Enter marks
```

Output:

```text
Display result
Show grade
Print answer
```

Example:

```text
START
↓
Input Number
↓
Display Number
↓
END
```

Whenever information moves between the user and the computer, this symbol is used.

## The Decision Symbol

Shape:

```text
    /\
   /  \
  < IF >
   \  /
    \/
```

Actually represented as a diamond:

```text
    /\
   /  \
  /    \
  \    /
   \  /
    \/
```

Purpose:

Used when the program must make a choice.

Examples:

* Is age greater than 18?
* Is password correct?
* Is number even?

A decision usually has two paths:

```text
YES
```

or

```text
NO
```

Example:

```text
Input Age
↓
Is Age ≥ 18?
↓
YES → Display "Adult"
NO  → Display "Minor"
```

Decision symbols create branching paths in algorithms.

## The Flow Line

Shape:

```text
↓
→
←
↑
```

Purpose:

Shows the direction of execution.

Flow lines connect symbols together.

Example:

```text
START
  ↓
INPUT
  ↓
PROCESS
  ↓
OUTPUT
  ↓
END
```

Without arrows, we would not know which step comes next.

Flow lines are the roads that connect all parts of the flowchart.

## The Connector Symbol

Shape:

```text
○
```

Purpose:

Used when a flowchart becomes too large.

Instead of drawing long crossing arrows, connectors help keep diagrams neat.

Example:

```text
Part A
↓
○ A

(Elsewhere)

○ A
↓
Continue Process
```

Think of connectors as teleportation points within a flowchart.

They allow the flow to continue without cluttering the diagram.

## The Predefined Process Symbol

Shape:

```text
||---------||
|| PROCESS ||
||---------||
```

Purpose:

Represents a process that has already been defined elsewhere.

Example:

```text
Login System
```

Instead of drawing every step of the login process repeatedly, a predefined process can represent the entire sequence.

This keeps large flowcharts manageable.

## The Document Symbol

Shape:

```text
 __________
|          |
| DOCUMENT |
|_________~
```

Purpose:

Represents a document, report, or file.

Examples:

* Generate PDF report
* Create student report card
* Save output file

This symbol is common in business and data-processing flowcharts.

## The Database Symbol

Shape:

```text
   ______
 /      \
| DATA  |
| BASE  |
 \______/
```

Typically drawn as a cylinder.

Purpose:

Represents stored data.

Examples:

* Student records
* Customer information
* AI training datasets
* User accounts

Modern software systems frequently interact with databases.

## Most Common Symbols You'll Use

Although many flowchart symbols exist, beginners usually need only five:

| Symbol       | Purpose              |
| ------------ | -------------------- |
| Terminator   | Start or End         |
| Process      | Perform an action    |
| Input/Output | Read or display data |
| Decision     | Make a choice        |
| Flow Line    | Connect steps        |

These symbols can describe most beginner algorithms.

## Example Flowchart: Even or Odd Number

Let's design a simple algorithm.

Problem:

Determine whether a number is even.

Flowchart logic:

```text
START
↓
Input Number
↓
Number % 2 = 0 ?
↓
YES → Display "Even"
↓
NO  → Display "Odd"
↓
END
```

Notice how:

* Input uses Input/Output symbol
* Checking uses Decision symbol
* Display uses Input/Output symbol
* Start and End use Terminators

Each symbol serves a specific purpose.

## Example Flowchart: Student Login

Consider a login system.

```text
START
↓
Enter Password
↓
Password Correct?
↓
YES → Display "Access Granted"
↓
NO  → Display "Access Denied"
↓
END
```

This simple flowchart demonstrates how decisions create multiple possible outcomes.

## Flowcharts and Programming

Flowcharts are not programs.

They are planning tools.

Programmers often create a flowchart before writing code because:

* Errors are easier to find
* Logic becomes clearer
* Team members can understand the solution
* Complex systems become easier to design

Many professional software projects begin with flowcharts before a single line of code is written.

## Flowcharts in AI and Machine Learning

Even AI systems can be represented using flowcharts.

Example:

```text
START
↓
Load Dataset
↓
Clean Data
↓
Train Model
↓
Evaluate Accuracy
↓
Save Model
↓
END
```

This flowchart represents a complete machine learning workflow.

Before engineers write Python code, they often visualize the process using diagrams like this.

## Common Mistakes

### Using the Wrong Symbol

Example:

Using a process box for user input.

Incorrect:

```text
+------------+
| Enter Name |
+------------+
```

Correct:

Input/Output symbol should be used.

### Missing Arrows

Without arrows, the execution order becomes unclear.

Always connect symbols using flow lines.

### Multiple Starts

A flowchart should generally have one clear starting point.

### Unlabeled Decision Paths

Decision branches should clearly indicate:

```text
YES
```

and

```text
NO
```

Otherwise the logic becomes confusing.

## Olympiad Thinking

In Olympiad-level programming, difficult problems often seem overwhelming at first.

Instead of jumping directly into code, top problem solvers frequently create:

* Flowcharts
* Pseudocode
* Diagrams

These tools help them visualize the logic before implementation.

A well-designed flowchart can often reveal mistakes that would otherwise take hours to debug in code.

## Conclusion

Flowchart symbols provide a visual language for representing algorithms and problem-solving processes. Each symbol has a specific purpose, such as starting a process, performing actions, taking input, displaying output, or making decisions. By understanding and correctly using these symbols, programmers can design solutions more effectively, communicate ideas clearly, and build stronger foundations for programming, artificial intelligence, and computational thinking.
