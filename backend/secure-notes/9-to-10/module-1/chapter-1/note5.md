# Backpropagation — Fixing Mistakes in AI

Hello again!  
I’m **AIVIA**. In this final topic of the chapter, we will learn about one of the **most important learning processes in AI** called **Backpropagation**.

Backpropagation (often called **Backprop**) is the method that allows a neural network to **learn from its mistakes and improve over time**.

---

# What is Backpropagation?

After a neural network makes a prediction, it checks **how wrong the prediction was** using the **Loss Function** we learned in the previous topic.

Then something interesting happens.

Instead of stopping there, the AI sends the **error information backward through the network** to figure out **what caused the mistake**.

This backward flow of error is called **Backpropagation**.

---

# How Backpropagation Works

Backpropagation follows a repeating learning cycle.

Step 1: **Make a Prediction**  
The neural network processes the input using **Forward Propagation** and produces an output.

Step 2: **Measure the Error**  
The AI compares the prediction with the correct answer and calculates the **Loss**.

Step 3: **Send the Error Backward**  
The error travels **from the Output Layer back through the Hidden Layers**.

Step 4: **Adjust the Weights and Biases**  
The network slightly changes the **weights and biases** that contributed to the mistake.

Step 5: **Try Again**  
The network repeats the process with updated values, gradually becoming more accurate.

---

# Analogy: Correcting an Exam Mistake

Imagine a student who just received their exam results.

The student does not simply look at the score and move on.

Instead, they review the paper and ask:

- Which questions did I get wrong?
- Why did I make that mistake?
- How can I correct it next time?

After understanding the mistakes, the student studies the weak areas and performs better in the next exam.

Backpropagation works in exactly the same way.

The AI **reviews its mistakes and improves step by step**.

---

# Why Backpropagation is Powerful

Neural networks can have **thousands or even millions of weights**.

Backpropagation helps the AI figure out:

- Which weights caused the error
- How much each weight should change
- How to reduce the overall Loss

It uses an important mathematical rule called the **Chain Rule** from calculus to calculate these adjustments efficiently.

Because of this method, even extremely large neural networks can **learn quickly and accurately**.

---

# Continuous Learning

Training a neural network is not a one-time process.

The system repeats the cycle many times:

1. Make a prediction  
2. Measure the Loss  
3. Send the error backward  
4. Adjust the weights  
5. Try again  

After **thousands or millions of training cycles**, the AI gradually becomes **more accurate and reliable**.

---

# Key Ideas to Remember

- **Backpropagation** helps neural networks learn from mistakes.
- The AI first calculates the **Loss (error)** in its prediction.
- The error is sent **backward through the network**.
- The network adjusts its **weights and biases**.
- This process repeats many times to **improve accuracy**.
- Backpropagation uses a mathematical rule called the **Chain Rule**.

---

By combining **Forward Propagation**, **Gradient Descent**, and **Backpropagation**, neural networks can learn complex patterns and become highly accurate intelligent systems.