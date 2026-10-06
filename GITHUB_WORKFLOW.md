# Git and GitHub Collaborative Workflow

This document outlines the standard Git and GitHub workflow adopted for the **College Laboratory Equipment Management System**, following best practices for branching, issue tracking, and code reviews.

---

## 1. Branching Strategy

We follow the **Feature Branch Workflow**:
- `main`: Production-ready, stable codebase.
- `develop`: Integration branch for upcoming releases.
- `feature/<feature-name>`: Dedicated branches for new features.
- `fix/<bug-name>`: Bug fixes and security patches.

### Branch Naming Conventions:
- `feature/equipment-inventory-ui`
- `feature/maintenance-reporting-api`
- `feature/mysql-reporting-aggregates`
- `fix/allocation-return-date-validation`

```bash
# Creating and switching to a new feature branch
git checkout -b feature/equipment-inventory-ui

# Committing changes following Conventional Commits
git commit -m "feat(ui): add equipment filtering and search controls"

# Pushing feature branch to GitHub
git push -u origin feature/equipment-inventory-ui
```

---

## 2. GitHub Issues

Each task or bug is tracked via GitHub Issues with standardized labels:
- `enhancement`: New feature proposals.
- `bug`: Confirmed defects or calculation errors.
- `documentation`: README and API docs updates.
- `good first issue`: Accessible tasks for new contributors.

### Example Issue Format:
- **Title**: `[FEAT] Add Damage Reporting Form with Severity Levels`
- **Description**: Provide user story, acceptance criteria, and API contract specifications.

---

## 3. Pull Request (PR) Based Development

1. Open a Pull Request from `feature/<name>` into `main` or `develop`.
2. Link the corresponding GitHub Issue (e.g., `Closes #12`).
3. Ensure the automated checks (linting, tests, build) pass.
4. Obtain at least one Peer Code Review approval before merging.
5. Use **Squash and Merge** or **Rebase and Merge** to maintain a clean git commit history.
