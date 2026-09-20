# GITHUB_ACTIONS.md

# GitHub Actions Strategy

This document defines the GitHub Actions workflows required for the Gridixa AI Mock Olympiad project.

The goal is to ensure that every Pull Request merged into the `dev` branch is production-ready, builds successfully, passes all tests, and does not introduce regressions.

The workflows should be lightweight enough for fast feedback while still providing confidence before code reaches the integration branch.

---

# Branch Strategy

```
feature/*
        │
        ▼
      dev
        │
        ▼
     main
```

Developers always work on feature branches.

Every feature branch creates a Pull Request into `dev`.

Only after the complete Olympiad implementation is verified should `dev` be merged into `main`.

---

# Workflow Overview

The repository should contain the following workflows.

```
.github/

workflows/

backend.yml

frontend.yml

lint.yml

tests.yml

security.yml

```

Each workflow should have a single responsibility.

Avoid creating one giant workflow.

---

# Backend Workflow

Trigger

```
Pull Request

↓

Target Branch

↓

dev
```

Checks

- Install dependencies
- Build backend
- TypeScript compilation
- Lint
- Unit tests
- Integration tests (if available)

The workflow must fail if any step fails.

---

# Frontend Workflow

Trigger

```
Pull Request

↓

Target Branch

↓

dev
```

Checks

- Install dependencies
- Build Next.js application
- TypeScript compilation
- Lint
- Static analysis

The frontend must compile successfully.

---

# Lint Workflow

Trigger

```
Pull Request

↓

dev
```

Checks

- ESLint
- Formatting
- Unused imports
- Unused variables
- TypeScript strict mode

No warnings should be ignored.

---

# Testing Workflow

Trigger

```
Pull Request

↓

dev
```

Run

- Unit Tests
- Integration Tests

The workflow should fail immediately if any test fails.

---

# Security Workflow

Trigger

```
Pull Request

↓

dev
```

Checks

- npm audit
- Dependency vulnerabilities
- Known security advisories

The workflow should report vulnerabilities before merging.

---

# Required Checks

The following checks must pass before a Pull Request can be merged into `dev`.

✓ Backend Build

✓ Frontend Build

✓ Lint

✓ Unit Tests

✓ Integration Tests

✓ Security Scan

No exceptions.

---

# Build Requirements

Every workflow should verify

- Dependencies install successfully.
- TypeScript compiles successfully.
- No build errors.
- No lint errors.
- No failed tests.

---

# Pull Request Rules

Every Pull Request should satisfy the following.

- Builds successfully.
- Passes every GitHub Action.
- Contains no merge conflicts.
- Has a clear title.
- Has a meaningful description.
- Keeps unrelated changes out of the PR.

Large unrelated refactors should be avoided.

---

# Branch Protection

Protect the `dev` branch.

Require

- Pull Requests
- Passing GitHub Actions
- Up-to-date branch before merge
- Conversation resolution before merge

Direct pushes to `dev` should be disabled.

---

# Merge Strategy

Use

```
Squash and Merge
```

This keeps commit history clean.

Every feature branch becomes one logical commit.

---

# Future Workflows

Future workflows may include

- Docker image build
- End-to-end testing
- Lighthouse performance
- Automatic deployment
- Load testing
- Release tagging

These are not required for the Olympiad implementation.

---

# Goal

The purpose of these workflows is to ensure that every change merged into the `dev` branch is stable, tested, and production-ready before becoming part of the final Olympiad implementation.