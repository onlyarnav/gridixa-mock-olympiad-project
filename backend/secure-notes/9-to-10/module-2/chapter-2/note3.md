# Tool Calling — Giving the AI Hands

In the previous topic, we saw how AI Agents use the **ReAct Framework** to think step-by-step while solving problems.

During that process, the AI often performs **Actions** such as:

- Searching the web  
- Sending emails  
- Performing calculations  
- Generating images  

But an important question arises:

**How does an AI actually perform these actions?**

The answer is **Tool Calling**.

---

# What Is Tool Calling?

Tool Calling is the process that allows an AI Agent to **use external software tools** to complete tasks.

These tools are usually connected through something called an **API**.

---

# What Is an API?

An **API (Application Programming Interface)** is a **digital bridge that allows two software systems to communicate with each other**.

It defines a set of rules that lets one program **request information or services** from another program.

In simple terms:

**APIs allow software to talk to other software.**

---

# Analogy: Ordering Food at a Restaurant

Imagine you are sitting at a restaurant.

You want food from the kitchen, but you cannot directly enter the kitchen.

Instead, you tell the **waiter** what you want.

The waiter carries your request to the kitchen and brings the food back.

In this analogy:

- **You** → The AI Agent  
- **Waiter** → The API  
- **Kitchen** → The external tool or service  

The API acts as the **communication bridge**.

---

# How AI Agents Use APIs

When engineers build an AI Agent, they connect the **LLM brain** to different tools using APIs.

When the agent decides to perform an action, it sends a request through the appropriate API.

The external system performs the task and returns the result.

The agent then **observes the result and continues its reasoning loop**.

---

# Examples of AI Tool Calling

AI Agents can connect to many types of APIs.

## Weather API

If the agent needs weather information, it can call a **Weather API**.

Example task:

*"What is the temperature in Delhi today?"*

The agent sends a request to the weather service and receives the current temperature.

---

## Calculator API

If the agent needs to solve a complex mathematical problem, it can use a **Calculator API**.

This ensures the answer is **precise and reliable**.

---

## Image Generation API

If the agent needs to create visuals, it can connect to an **Image Generation API**.

Example task:

*"Generate a promotional poster for a school event."*

The API produces the image and sends it back to the agent.

---

# Why Tool Calling Is Important

Without tool calling, an AI model would only be able to:

- Generate text  
- Answer questions based on its training

With tool calling, AI Agents can:

- Access **live information**
- Perform **accurate calculations**
- Generate **images and media**
- Interact with **real-world systems**

This transforms AI from a **passive chatbot** into an **active digital assistant**.

---

# Key Ideas to Remember

- **Tool Calling** allows AI Agents to perform real tasks.  
- It works through **APIs (Application Programming Interfaces)**.  
- APIs act as **bridges between software systems**.  
- Agents can connect to tools such as **weather services, calculators, databases, and image generators**.  
- Tool calling gives AI **the ability to interact with the real world**, not just generate text.